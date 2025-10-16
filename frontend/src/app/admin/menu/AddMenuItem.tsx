"use client"

import { Ingredient } from "@/types/Ingredient";
import { MenuItem, MenuItemSize } from "@/types/MenuItem";
import { useState } from "react";

interface AddMenuItemProps {
  ingredients: Ingredient[];
  menuItems: MenuItem[];
  setTempMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>;
}

export default function AddMenuItem({ ingredients, menuItems, setTempMenuItems }: AddMenuItemProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [availableSizes, setAvailableSizes] = useState<MenuItemSize[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isCustomizable, setIsCustomizable] = useState<boolean>(false);
  const [defaultIngredients, setDefaultIngredients] = useState<Ingredient[]>([]);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

    const sizeOptions: MenuItemSize["size"][] = ["None", "S", "M", "L", "XL"];

    


  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // prevent default form submission if this is used in a <form>

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

        const menuItem: MenuItem = {
        id: null,
        name,
        description,
        imageUrl,
        isAvailable: false,
        isCustomizable,
        defaultIngredients,
        availableSizes,
        };

        setTempMenuItems((prev) => [...(prev ?? []), menuItem]);
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
    className="flex flex-col gap-4 max-w-lg mx-auto p-4 border rounded-lg shadow"
  >
    <h2 className="text-xl font-semibold text-center">Add / Update Menu Item</h2>

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

    {/* Description */}
    <div>
      <label className="block mb-1 font-medium">Description</label>
      <input
        type="text"
        placeholder="Description"
        className="border p-2 rounded w-full"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
    </div>

    {/* Image URL */}
    <div>
      <label className="block mb-1 font-medium">Image URL</label>
      <input
        type="text"
        placeholder="https://example.com/image.jpg"
        className="border p-2 rounded w-full"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
    </div>

    {/* Sizes & Prices - two column layout */}
<div>
  <label className="block mb-2 font-medium">Sizes & Prices</label>

  <div className="grid grid-cols-2 gap-4">
    {/* LEFT COLUMN: None (left-justified) */}
    <div className="flex items-center gap-3">
      {/* "None" button */}
      <button
        type="button"
        onClick={() => {
          const isSelected = !!availableSizes.find((s) => s.size === "None");
          if (isSelected) {
            setAvailableSizes(availableSizes.filter((s) => s.size !== "None"));
          } else {
            setAvailableSizes([{ size: "None", price: 0 }]);
          }
        }}
        className={`px-3 py-1 rounded border min-w-[60px] text-center ${
          !!availableSizes.find((s) => s.size === "None")
            ? "bg-orange-600 text-white"
            : "bg-white text-gray-700"
        }`}
      >
        None
      </button>

      {/* None price input (always shows when selected) */}
      {availableSizes.find((s) => s.size === "None") && (
        <div className="relative w-28">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="number"
            className="border rounded w-full p-1 pl-6 text-right 
                       [appearance:textfield] 
                       [&::-webkit-inner-spin-button]:appearance-none 
                       [&::-webkit-outer-spin-button]:appearance-none 
                       focus:outline-none focus:ring-2 focus:ring-orange-500"
            value={availableSizes.find((s) => s.size === "None")!.price || ""}
            min={0}
            step={0.01}
            onChange={(e) => {
              const newPrice = Number(e.target.value);
              setAvailableSizes(
                availableSizes.map((s) =>
                  s.size === "None" ? { ...s, price: newPrice } : s
                )
              );
            }}
          />
        </div>
      )}
    </div>

    {/* RIGHT COLUMN: S, M, L, XL (right-justified) */}
    <div className="flex flex-col items-end gap-3">
      {sizeOptions
        .filter((s) => s !== "None")
        .map((size) => {
          const sizeObj = availableSizes.find((x) => x.size === size);
          const isSelected = !!sizeObj;

          return (
            <div key={size} className="flex items-center gap-3">
              {/* Price input on left of the label */}
              {isSelected ? (
                <div className="relative w-28">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
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
              ) : (
                <div className="w-28" />
              )}

              {/* Size button / label to the right */}
              <button
                type="button"
                onClick={() => {
                  const isSelected = !!availableSizes.find((s) => s.size === size);
                  if (isSelected) {
                    setAvailableSizes(availableSizes.filter((s) => s.size !== size));
                  } else {
                    const withoutNone = availableSizes.filter((s) => s.size !== "None");
                    setAvailableSizes([...withoutNone, { size, price: 0 }]);
                  }
                }}
                className={`px-3 py-1 rounded border min-w-[48px] text-center ${
                  isSelected ? "bg-orange-600 text-white" : "bg-white text-gray-700"
                }`}
              >
                {size}
              </button>
            </div>
          );
        })}
    </div>
  </div>
</div>



    {/* Ingredients */}
    {ingredients && (
      <div>
        <div>
            <div className="flex items-center justify-between gap-2 font-medium">
                <label>Ingredients</label>
                <div className="flex flex-row">
                    <input
                        type="checkbox"
                        checked={isCustomizable}
                        onChange={(e) => setIsCustomizable(e.target.checked)}
                    />
                    <div className="pl-1">Can be customized by customer? </div>
                </div>
            </div>
        </div>
        <select
          multiple
          value={defaultIngredients.map((i) => i.id.toString())}
          onChange={(e) => {
            const selectedIds = Array.from(
              e.target.selectedOptions,
              (option) => option.value
            );
            const selected = ingredients.filter((ingredient) =>
              selectedIds.includes(ingredient.id.toString())
            );
            setDefaultIngredients(selected ?? []);
          }}
          className="border p-2 rounded w-full h-32"
        >
          {ingredients.map((ingredient) => (
            <option key={ingredient.id} value={ingredient.id}>
              {ingredient.name}
            </option>
          ))}
        </select>
      </div>
    )}

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading ?? false} 
      className="bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
    >
      {loading ? "Saving..." : "Save Menu Item"}
    </button>

    {/* Feedback Messages */}
    {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    {success && (
      <p className="text-green-500 text-sm text-center">
        Menu item saved successfully!
      </p>
    )}
  </form>
);

}