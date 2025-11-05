"use client";

import { Ingredient, IngredientSize } from "@/types/Ingredient";
import { MenuItem, MenuItemSize } from "@/types/MenuItem";
import { useState, useEffect } from "react";
import { UpdateMenuProps } from "./page";
import { useMenu } from "@/components/context/Menu";
import ItemSelector from "@/components/ItemSelector";
import CategorySelector from "@/components/CategorySelector";
import AdminSizeSelector from "@/components/AdminSizeSelector";

export default function AddUpdateIngredient({ ingredients, setReload }: UpdateMenuProps) {
  const { createIngredient, updateIngredient, deleteIngredient } = useMenu();

  const [selectedIngredientName, setSelectedIngredientName] = useState<string>("");

  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [sizes, setSizes] = useState<IngredientSize[]>([]);
  const [category, setCategory] = useState<Ingredient["category"]>("MEAT");
  const [canBeRemoved, setCanBeRemoved] = useState<boolean>(false);
  const [canBeDoubled, setCanBeDoubled] = useState<boolean>(false);

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  const categoryOptions: Ingredient["category"][] = ["MEAT", "VEGETABLE", "FRUIT", "OTHER"];
  const sizeOptions: IngredientSize["size"][] = ["NONE", "S", "M", "L", "XL"];
  const isUpdateMode = selectedIngredientName !== "";

  // Load selected ingredient data when dropdown changes

  // TODO add image URL, canBeHalved (cheese, sauce can't really be on half), canBeLight (sauce, cheese)
  useEffect(() => {
    if (selectedIngredientName) {
      const ingredient = ingredients.find(
        (item) => item.name?.toString() === selectedIngredientName
      );

      setSelected(ingredient ?? null);
      setId(ingredient ? ingredient.id : null);
      setName(ingredient ? ingredient.name : "");
      setSizes(ingredient ? ingredient.sizes : []);
      setCategory(ingredient ? ingredient.category : "MEAT");
      setCanBeDoubled(ingredient ? ingredient.canBeDoubled : false);
      setCanBeRemoved(ingredient ? ingredient.canBeRemoved : false);
    }
  }, [selectedIngredientName, ingredients]);

  const resetOnSuccess = () => {
    setName("");
    setSizes([]);
    setCanBeDoubled(false);
    setCanBeRemoved(false);
    setSelectedIngredientName("");
    setSuccess(true);
    setReload(true);
    setSelected(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      setError(null);
      setSuccess(false);
      setLoading(true);

      validateName();
      validateSizes();

      const ingredient: Ingredient = {
        id: id ?? Math.random(),
        name,
        sizes,
        category,
        canBeDoubled,
        canBeRemoved,
      };

      let response;
      if (isUpdateMode) {
        response = await updateIngredient(ingredient);
      } else {
        validateNonExistingOnCreate(ingredient);
        response = await createIngredient(ingredient);
      }

      if (response.success) {
        resetOnSuccess();
      } else {
        setSuccess(false);
        setError(response.error || "An unexpected error occurred.");
      }
    } catch (err: any) {
      setSuccess(false);
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (ingredient: Ingredient) => {
    try {
      setError(null);
      setSuccess(false);
      setLoading(true);

      const response = await deleteIngredient(ingredient);

      if (response.success) {
        resetOnSuccess();
      } else {
        setSuccess(false);
        setError(response.error || "An unexpected error occurred.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const validateName = () => {
    if (!name || name.trim() === "") {
      throw new Error("Value for name is required!");
    }
  };

  const validateSizes = () => {
    if (sizes.length <= 0) {
      throw new Error("At least one size is required!");
    }

    sizes.forEach((sizeOption) => {
      if (sizeOption.price <= 0) {
        throw new Error(`Price for ${sizeOption.size} must be greater than 0!`);
      }
    });
  };

  const validateNonExistingOnCreate = (ingredient: Ingredient) => {
    const exists = ingredients.some((item) => item.name.toLowerCase() === name.toLowerCase());

    if (exists) {
      throw new Error(`Name ${ingredient.name} already exists!`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-lg h-fit mx-auto p-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-center">Add / Update Ingredient</h2>

      <ItemSelector
        label="Select Ingredient (optional)"
        value={selectedIngredientName}
        onChange={(e) => setSelectedIngredientName(e.target.value)}
        items={ingredients}
        defaultText="-- Create New Ingredient --"
      />

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

      <CategorySelector
        value={category}
        onChange={(e) => setCategory(e.target.value as Ingredient["category"])}
        categoryOptions={categoryOptions}
      />

      <AdminSizeSelector sizes={sizes} setSizes={setSizes} sizeOptions={sizeOptions} />

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
              if (confirm("Are you sure you want to delete this ingredient?") && selected != null) {
                handleDelete(selected);
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
