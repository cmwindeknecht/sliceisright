"use client";

import { Ingredient, IngredientSize } from "@/types/Ingredient";
import { MenuItem, MenuItemSize } from "@/types/MenuItem";
import { useState, useEffect } from "react";
import { UpdateMenuProps } from "./page";
import { useMenu } from "@/components/context/Menu";
import ItemSelector from "@/components/ItemSelector";
import CategorySelector from "@/components/CategorySelector";
import AdminSizeSelector from "@/app/admin/menu/AdminSizeSelector";

export default function AddUpdateIngredient({ ingredients, setReload }: UpdateMenuProps) {
  const { createIngredient, updateIngredient, deleteIngredient } = useMenu();

  const [selectedIngredientId, setSelectedIngredientId] = useState<number | null>(null);

  const [selected, setSelected] = useState<Ingredient | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [sizes, setSizes] = useState<IngredientSize[]>([]);
  const [category, setCategory] = useState<Ingredient["category"]>("MEAT");
  const [menuItemCategory, setMenuItemCategory] =
    useState<Ingredient["menuItemCategory"]>("PIZZAS");
  const [canBeRemoved, setCanBeRemoved] = useState<boolean>(false);
  const [canBeDoubled, setCanBeDoubled] = useState<boolean>(false);
  const [canBeHalved, setCanBeHalved] = useState<boolean>(false);
  const [canBeLight, setCanBeLight] = useState<boolean>(false);

  const [isUpdateMode, setIsUpdateMode] = useState<boolean | null>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  const categoryOptions: Ingredient["category"][] = ["MEAT", "VEGETABLE", "FRUIT", "OTHER"];
  const menuItemCategoryOptions: Ingredient["menuItemCategory"][] = [
    "PIZZAS",
    "SUBS",
    "APPETIZERS",
    "DESSERTS",
    "BEVERAGES",
    "DEALS",
  ];
  const sizeOptions: IngredientSize["size"][] = ["NONE", "S", "M", "L", "XL"];

  useEffect(() => {
    if (selectedIngredientId) {
      const ingredient = ingredients.find((ingredient) => ingredient.id == selectedIngredientId);

      setSelected(ingredient ?? null);
      setId(ingredient ? ingredient.id : null);
      setName(ingredient ? ingredient.name : "");
      setSizes(ingredient ? ingredient.sizes : []);
      setCategory(ingredient ? ingredient.category : "MEAT");
      setMenuItemCategory(ingredient ? ingredient.menuItemCategory : "PIZZAS");
      setCanBeDoubled(ingredient ? ingredient.canBeDoubled : false);
      setCanBeRemoved(ingredient ? ingredient.canBeRemoved : false);
      setCanBeHalved(ingredient ? ingredient.canBeHalved : false);
      setCanBeLight(ingredient ? ingredient.canBeLight : false);
      setIsUpdateMode(ingredient != null);
    }
  }, [selectedIngredientId, ingredients]);

  const resetOnSuccess = () => {
    setName("");
    setImageUrl("");
    setSizes([]);
    setCategory("MEAT");
    setMenuItemCategory("PIZZAS");
    setCanBeDoubled(false);
    setCanBeRemoved(false);
    setCanBeHalved(false);
    setCanBeLight(false);
    setSelectedIngredientId(null);
    setSuccess(true);
    setReload(true);
    setSelected(null);
    setIsUpdateMode(false);
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
        imageUrl,
        sizes,
        category,
        menuItemCategory,
        canBeDoubled,
        canBeRemoved,
        canBeHalved,
        canBeLight,
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
  };

  const validateNonExistingOnCreate = (ingredient: Ingredient) => {
    const exists = ingredients.some(
      (item) =>
        item.name.toLowerCase() === name.toLowerCase() &&
        item.menuItemCategory == ingredient.menuItemCategory
    );

    if (exists) {
      throw new Error(
        `Name ${ingredient.name} and category ${ingredient.menuItemCategory} already exists!`
      );
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
        value={selectedIngredientId?.toString() || ""}
        onChange={(e) => setSelectedIngredientId(Number(e.target.value))}
        items={ingredients}
        defaultText="-- Create New Ingredient --"
      />

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

      <div>
        <label className="block mb-1 font-medium">Image URL</label>
        <input
          type="text"
          placeholder="Name"
          className="border p-2 rounded w-full"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />
      </div>

      <CategorySelector
        title="Ingredient Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as Ingredient["category"])}
        categoryOptions={categoryOptions}
      />

      <CategorySelector
        title="Menu Item Category"
        value={menuItemCategory}
        onChange={(e) => setMenuItemCategory(e.target.value as Ingredient["menuItemCategory"])}
        categoryOptions={menuItemCategoryOptions}
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

      <div className="flex flex-row">
        <input
          type="checkbox"
          checked={canBeHalved}
          onChange={(e) => setCanBeHalved(e.target.checked)}
        />
        <div className="pl-1">Can be halved? </div>
      </div>

      <div className="flex flex-row">
        <input
          type="checkbox"
          checked={canBeLight}
          onChange={(e) => setCanBeLight(e.target.checked)}
        />
        <div className="pl-1">Can be light? </div>
      </div>

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

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm text-center">
          Ingredient {isUpdateMode ? "updated" : "created"} successfully!
        </p>
      )}
    </form>
  );
}
