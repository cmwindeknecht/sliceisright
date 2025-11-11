"use client";

import { Ingredient } from "@/types/Ingredient";
import { MenuItem, MenuItemSize } from "@/types/MenuItem";
import { useState, useEffect } from "react";
import { UpdateMenuProps } from "./page";
import { useMenu } from "@/components/context/Menu";
import ItemSelector from "@/components/ItemSelector";
import CategorySelector from "@/components/CategorySelector";
import AdminSizeSelector from "@/components/AdminSizeSelector";

export default function AddUpdateMenuItem({ ingredients, menuItems, setReload }: UpdateMenuProps) {
  const { createMenuItem, updateMenuItem, deleteMenuItem } = useMenu();

  const [selectedMenuItemId, setSelectedMenuItemId] = useState<number | null>(null);

  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(null);
  const [id, setId] = useState<number | null>(null);
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [sizes, setSizes] = useState<MenuItemSize[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isCustomizable, setIsCustomizable] = useState<boolean>(false);
  const [menuItemIngredients, setMenuItemIngredients] = useState<Ingredient[]>([]);
  const [category, setCategory] = useState<MenuItem["category"]>("PIZZAS");

  const [isUpdateMode, setIsUpdateMode] = useState<boolean | null>(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  const categoryOptions: MenuItem["category"][] = [
    "PIZZAS",
    "SUBS",
    "APPETIZERS",
    "DESSERTS",
    "BEVERAGES",
    "DEALS",
  ];
  const sizeOptions: MenuItemSize["size"][] = ["NONE", "S", "M", "L", "XL"];
  const defaultSelectorText = "-- Create New Menu Item --";

  // Load selected menu item data when dropdown changes
  useEffect(() => {
    let menuItem = null;
    if (selectedMenuItemId) {
      menuItem = menuItems.find((menuItem) => menuItem.id === selectedMenuItemId);
    }

    setSelectedMenuItem(menuItem ?? null);
    setId(menuItem ? menuItem.id : null);
    setName(menuItem ? menuItem.name : "");
    setDescription(menuItem ? menuItem.description : "");
    setSizes(menuItem ? menuItem.sizes : []);
    setImageUrl(menuItem ? menuItem.imageUrl : "");
    setCategory(menuItem ? menuItem.category : "PIZZAS");
    setIsCustomizable(menuItem ? menuItem.isCustomizable : false);
    setIsAvailable(menuItem ? menuItem.isAvailable : false);
    setMenuItemIngredients(menuItem ? menuItem.ingredients : []);
    setIsUpdateMode(menuItem != null);
  }, [selectedMenuItemId, menuItems]);

  const resetOnSuccess = () => {
    setSuccess(true);
    setName("");
    setDescription("");
    setSizes([]);
    setImageUrl("");
    setIsCustomizable(false);
    setMenuItemIngredients([]);
    setSelectedMenuItemId(null);
    setReload(true);
    setSelectedMenuItem(null);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      setError(null);
      setSuccess(false);
      setLoading(true);

      validateName();
      validateSizes();

      const menuItem: MenuItem = {
        id: id ?? Math.random(),
        name,
        description,
        imageUrl,
        isAvailable: selectedMenuItem ? selectedMenuItem.isAvailable : false,
        isCustomizable,
        ingredients: menuItemIngredients,
        sizes,
        category,
      };

      let response;
      if (isUpdateMode) {
        response = await updateMenuItem(menuItem);
      } else {
        validateNonExistingOnCreate(menuItem);
        response = await createMenuItem(menuItem);
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

  const handleDelete = async (menuItem: MenuItem) => {
    const response = await deleteMenuItem(menuItem);

    if (response.success) {
      resetOnSuccess();
    } else {
      setSuccess(false);
      setError(response.error || "An unexpected error occurred.");
    }
  };

  const handleMakeAvailable = async (menuItem: MenuItem) => {
    menuItem.isAvailable = !menuItem.isAvailable;
    const response = await updateMenuItem(menuItem);

    if (response.success) {
      resetOnSuccess();
    } else {
      setSuccess(false);
      setError(response.error || "An unexpected error occurred.");
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

  const validateNonExistingOnCreate = (menuItem: MenuItem) => {
    const exists = menuItems.some((item) => item.name.toLowerCase() === name.toLowerCase());

    if (exists) {
      throw new Error(`Name ${menuItem.name} already exists!`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 w-lg mx-auto p-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-center">Add / Update Menu Item</h2>

      <ItemSelector
        label="Select Menu Item (optional)"
        value={selectedMenuItemId?.toString() || ""}
        onChange={(e) => setSelectedMenuItemId(Number(e.target.value))}
        items={menuItems}
        defaultText="-- Create New Menu Item --"
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
        <label className="block mb-1 font-medium">Description</label>
        <input
          type="text"
          placeholder="Description"
          className="border p-2 rounded w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

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

      <CategorySelector
        title="Menu Item Category"
        value={category}
        onChange={(e) => setCategory(e.target.value as MenuItem["category"])}
        categoryOptions={categoryOptions}
      />

      <AdminSizeSelector sizes={sizes} setSizes={setSizes} sizeOptions={sizeOptions} />

      {/* Ingredients */}
      {ingredients && (
        <div>
          <div className="flex items-center justify-between gap-2 mb-2 font-medium">
            <label>Ingredients</label>
            <div className="flex flex-row items-center">
              <input
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) => setIsCustomizable(e.target.checked)}
              />
              <div className="pl-1">Can be customized by customer?</div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ingredients
              .filter((ingredient) => ingredient.menuItemCategory === category)
              .map((ingredient) => {
                const isSelected = menuItemIngredients.some((i) => i.name === ingredient.name);

                return (
                  <button
                    key={ingredient.id}
                    type="button"
                    onClick={() => {
                      if (isSelected) {
                        setMenuItemIngredients(
                          menuItemIngredients.filter((i) => i.name !== ingredient.name)
                        );
                      } else {
                        setMenuItemIngredients([...menuItemIngredients, ingredient]);
                      }
                    }}
                    className={`px-3 py-1 rounded border ${
                      isSelected ? "bg-orange-600 text-white" : "bg-white text-gray-700"
                    }`}
                  >
                    {ingredient.name}
                  </button>
                );
              })}
          </div>
        </div>
      )}

      {/* Submit and Delete Buttons */}
      <div className="flex justify-between gap-2">
        <button
          type="submit"
          disabled={loading ?? false}
          className="w-1/3 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : isUpdateMode ? "Update Menu Item" : "Create Menu Item"}
        </button>

        {isUpdateMode && selectedMenuItem != null && (
          <>
            <button
              type="button"
              onClick={() => {
                if (confirm("Are you sure you want to delete this menu item?")) {
                  handleDelete(selectedMenuItem);
                }
              }}
              disabled={loading ?? false}
              className="w-1/3 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
            >
              Delete Menu Item
            </button>
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    `Are you sure you want to make this menu item ${selectedMenuItem.isAvailable ? "unavailable" : "available"}?`
                  )
                ) {
                  handleMakeAvailable(selectedMenuItem);
                }
              }}
              disabled={loading ?? false}
              className="w-1/3 bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
            >
              Make {selectedMenuItem.isAvailable ? "Unavailable" : "Available"} On Menu
            </button>
          </>
        )}
      </div>

      {/* Feedback Messages */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && (
        <p className="text-green-500 text-sm text-center">
          Menu item {isUpdateMode ? "updated" : "created"} successfully!
        </p>
      )}
    </form>
  );
}
