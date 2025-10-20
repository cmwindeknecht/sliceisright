"use client";

import { Ingredient } from "@/types/Ingredient";
import { MenuItem, MenuItemSize } from "@/types/MenuItem";
import { useState, useEffect } from "react";
import { AdminMenuItemProps } from "./page";

export default function AddUpdateIngredient({
  ingredients,
  setTempIngredients,
}: AdminMenuItemProps) {
  const [selectedIngredientName, setSelectedIngredientName] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<MenuItemSize[]>([]);
  const [canBeRemoved, setCanBeRemoved] = useState<boolean>(false);
  const [canBeDoubled, setCanBeDoubled] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  const sizeOptions: MenuItemSize["size"][] = ["None", "S", "M", "L", "XL"];
  const isUpdateMode = selectedIngredientName !== "";

  // Load selected menu item data when dropdown changes
  useEffect(() => {
    if (selectedIngredientName) {
      const ingredient = ingredients.find(
        (item) => item.name?.toString() === selectedIngredientName
      );
      if (ingredient) {
        setName(ingredient.name);
        setAvailableSizes(ingredient.availableSizes || []);
        setCanBeDoubled(ingredient.canBeDoubled || false);
        setCanBeRemoved(ingredient.canBeRemoved || false);
      }
    } else {
      // Reset form when dropdown is cleared
      setName("");
      setAvailableSizes([]);
      setCanBeDoubled(false);
      setCanBeRemoved(false);
    }
  }, [selectedIngredientName, ingredients]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      setError(null);
      setSuccess(false);
      setLoading(true);

      if (!name || name.trim() === "") {
        throw new Error("Value for name is required!");
      }

      availableSizes.forEach((sizeOption) => {
        if (sizeOption.price <= 0) {
          throw new Error(`Price for ${sizeOption.size} must be greater than 0!`);
        }
      });

      const ingredient: Ingredient = {
        id: Math.random(),
        name,
        availableSizes,
        canBeDoubled,
        canBeRemoved,
      };

      if (isUpdateMode) {
        setTempIngredients((prev) =>
          prev.map((item) => (item.name?.toString() === selectedIngredientName ? ingredient : item))
        );
      } else {
        const exists = ingredients.some((item) => item.name.toLowerCase() === name.toLowerCase());

        if (exists) {
          throw new Error(`Name ${ingredient.name} already exists!`);
        }

        setTempIngredients((prev) => [...(prev ?? []), ingredient]);
      }

      setName("");
      setAvailableSizes([]);
      setCanBeDoubled(false);
      setCanBeRemoved(false);
      setSelectedIngredientName("");
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-lg h-fit mx-auto p-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-center">Add / Update Ingredient</h2>

      {/* Menu Item Selector */}
      <div>
        <label className="block mb-1 font-medium">Select Ingredient (optional)</label>
        <select
          value={selectedIngredientName}
          onChange={(e) => setSelectedIngredientName(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Create New Ingredient --</option>
          {ingredients.map((item) => (
            <option key={item.name} value={item.name?.toString()}>
              {item.name}
            </option>
          ))}
        </select>
      </div>
      {/* Name */}
      <div>
        <label className="block mb-1 font-medium">Name</label>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      {/* Sizes & Prices */}
      <div>
        <label className="block mb-2 font-medium">Sizes & Prices</label>

        <div className="flex flex-col gap-3">
          {sizeOptions.map((size) => {
            const sizeObj = availableSizes.find((x) => x.size === size);
            const isSelected = !!sizeObj;

            return (
              <div key={size} className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const isSelected = !!availableSizes.find((s) => s.size === size);
                    if (isSelected) {
                      setAvailableSizes(availableSizes.filter((s) => s.size !== size));
                    } else {
                      setAvailableSizes([...availableSizes, { size, price: 0 }]);
                    }
                  }}
                  className={`px-3 py-1 rounded border min-w-[60px] text-center ${
                    isSelected ? "bg-orange-600 text-white" : "bg-white text-gray-700"
                  }`}
                >
                  {size}
                </button>

                {isSelected && (
                  <div className="relative w-28">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">
                      $
                    </span>
                    <input
                      type="number"
                      className="border rounded w-full p-1 pl-6 text-right 
                                     [appearance:textfield] 
                                     [&::-webkit-inner-spin-button]:appearance-none 
                                     [&::-webkit-outer-spin-button]:appearance-none 
                                     focus:outline-none focus:ring-2 focus:ring-orange-500"
                      value={sizeObj!.price || ""}
                      min={0}
                      step={0.01}
                      onChange={(e) => {
                        const newPrice = Number(e.target.value);
                        setAvailableSizes(
                          availableSizes.map((s) =>
                            s.size === size ? { ...s, price: newPrice } : s
                          )
                        );
                      }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-row">
        <input
          type="checkbox"
          checked={canBeDoubled}
          onChange={(e) => setCanBeDoubled(e.target.checked)}
        />
        <div className="pl-1">Can be doubled? </div>
      </div>

      <div className="flex flex-row">
        <input
          type="checkbox"
          checked={canBeRemoved}
          onChange={(e) => setCanBeRemoved(e.target.checked)}
        />
        <div className="pl-1">Can be removed? </div>
      </div>

      {/* Submit and Delete Buttons */}
      <div className="flex justify-between gap-2">
        <button
          type="submit"
          disabled={loading ?? false}
          className="w-1/3 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : isUpdateMode ? "Update Ingredient" : "Create Ingredient"}
        </button>

        {isUpdateMode && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to delete this menu item?")) {
                setTempIngredients((prev) =>
                  prev.filter((item) => item.name?.toString() !== selectedIngredientName)
                );
                setSelectedIngredientName("");
                setSuccess(true);
              }
            }}
            disabled={loading ?? false}
            className="w-1/3 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete Ingredient
          </button>
        )}
      </div>

      {/* Feedback Messages */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm text-center">
          Ingredient {isUpdateMode ? "updated" : "created"} successfully!
        </p>
      )}
    </form>
  );
}
