"use client";

import { Ingredient } from "@/types/Ingredient";
import { MenuItem, MenuItemSize } from "@/types/MenuItem";
import { useState, useEffect } from "react";
import { UpdateMenuProps } from "./page";
import { useMenu } from "@/components/context/Menu";

export default function AddUpdateMenuItem({
  ingredients,
  menuItems,
  setTempMenuItems,
}: UpdateMenuProps) {
  const { createMenuItem } = useMenu();

  const [selectedMenuItemName, setSelectedMenuItemName] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [sizes, setSizes] = useState<MenuItemSize[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isCustomizable, setIsCustomizable] = useState<boolean>(false);
  const [defaultIngredients, setDefaultIngredients] = useState<Ingredient[]>([]);
  const [category, setCategory] = useState<MenuItem["category"]>("Signature Pizza");

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean | null>(null);
  const [success, setSuccess] = useState(false);

  const categoryOptions: MenuItem["category"][] = [
    "Signature Pizza",
    "Specialty Item",
    "Dessert",
    "Drink",
  ];
  const sizeOptions: MenuItemSize["size"][] = ["None", "S", "M", "L", "XL"];

  const isUpdateMode = selectedMenuItemName !== "";

  // Load selected menu item data when dropdown changes
  useEffect(() => {
    if (selectedMenuItemName) {
      const menuItem = menuItems.find((item) => item.name?.toString() === selectedMenuItemName);
      if (menuItem) {
        setName(menuItem.name);
        setDescription(menuItem.description || "");
        setSizes(menuItem.sizes || []);
        setImageUrl(menuItem.imageUrl || "");
        setIsCustomizable(menuItem.isCustomizable || false);
        setDefaultIngredients(menuItem.ingredients || []);
      }
    } else {
      // Reset form when dropdown is cleared
      setName("");
      setDescription("");
      setSizes([]);
      setImageUrl("");
      setIsCustomizable(false);
      setDefaultIngredients([]);
    }
  }, [selectedMenuItemName, menuItems]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    try {
      setError(null);
      setSuccess(false);
      setLoading(true);

      if (!name || name.trim() === "") {
        throw new Error("Value for name is required!");
      }

      sizes.forEach((sizeOption) => {
        if (sizeOption.price <= 0) {
          throw new Error(`Price for ${sizeOption.size} must be greater than 0!`);
        }
      });

      const menuItem: MenuItem = {
        id: Math.random(), // Override with proper id when creating in backend
        name,
        description,
        imageUrl,
        isAvailable: false,
        isCustomizable,
        ingredients,
        sizes,
        category,
      };

      if (isUpdateMode) {
        // TODO put request to update
        // updateOrderItem();
        // setTempMenuItems((prev) =>
        //   prev.map((item) => (item.name?.toString() === selectedMenuItemName ? menuItem : item))
        // );
      } else {
        createMenuItem(menuItem);
      }

      setName("");
      setDescription("");
      setSizes([]);
      setImageUrl("");
      setIsCustomizable(false);
      setDefaultIngredients([]);
      setSelectedMenuItemName("");
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
      className="flex flex-col gap-4 w-lg mx-auto p-4 border rounded-lg shadow"
    >
      <h2 className="text-xl font-semibold text-center">Add / Update Menu Item</h2>

      {/* Menu Item Selector */}
      <div>
        <label className="block mb-1 font-medium">Select Menu Item (optional)</label>
        <select
          value={selectedMenuItemName}
          onChange={(e) => setSelectedMenuItemName(e.target.value)}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Create New Menu Item --</option>
          {menuItems.map((item) => (
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

      <div>
        <label className="block mb-1 font-medium">Category</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value as MenuItem["category"])}
          className="border p-2 rounded w-full"
        >
          <option value="">-- Select Category --</option>
          {categoryOptions.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Sizes & Prices */}
      <div>
        <label className="block mb-2 font-medium">Sizes & Prices</label>

        <div className="grid grid-cols-2 gap-4">
          {/* LEFT COLUMN: None */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const isSelected = !!sizes.find((s) => s.size === "None");
                if (isSelected) {
                  setSizes(sizes.filter((s) => s.size !== "None"));
                } else {
                  setSizes([{ size: "None", price: 0 }]);
                }
              }}
              className={`px-3 py-1 rounded border min-w-[60px] text-center ${
                !!sizes.find((s) => s.size === "None")
                  ? "bg-orange-600 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              None
            </button>

            {sizes.find((s) => s.size === "None") && (
              <div className="relative w-28">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  className="border rounded w-full p-1 pl-6 text-right 
                                 [appearance:textfield] 
                                 [&::-webkit-inner-spin-button]:appearance-none 
                                 [&::-webkit-outer-spin-button]:appearance-none 
                                 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  value={sizes.find((s) => s.size === "None")!.price || ""}
                  min={0}
                  step={0.01}
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    setSizes(sizes.map((s) => (s.size === "None" ? { ...s, price: newPrice } : s)));
                  }}
                />
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: S, M, L, XL */}
          <div className="flex flex-col items-end gap-3">
            {sizeOptions
              .filter((s) => s !== "None")
              .map((size) => {
                const sizeObj = sizes.find((x) => x.size === size);
                const isSelected = !!sizeObj;

                return (
                  <div key={size} className="flex items-center gap-3">
                    {isSelected ? (
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
                            setSizes(
                              sizes.map((s) => (s.size === size ? { ...s, price: newPrice } : s))
                            );
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-28" />
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        const isSelected = !!sizes.find((s) => s.size === size);
                        if (isSelected) {
                          setSizes(sizes.filter((s) => s.size !== size));
                        } else {
                          const withoutNone = sizes.filter((s) => s.size !== "None");
                          setSizes([...withoutNone, { size, price: 0 }]);
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
            {ingredients.map((ingredient) => {
              const isSelected = defaultIngredients.some((i) => i.name === ingredient.name);

              return (
                <button
                  key={ingredient.name}
                  type="button"
                  onClick={() => {
                    if (isSelected) {
                      setDefaultIngredients(
                        defaultIngredients.filter((i) => i.name !== ingredient.name)
                      );
                    } else {
                      setDefaultIngredients([...defaultIngredients, ingredient]);
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

        {isUpdateMode && (
          <button
            type="button"
            onClick={() => {
              if (confirm("Are you sure you want to delete this menu item?")) {
                setTempMenuItems((prev) =>
                  prev.filter((item) => item.name?.toString() !== selectedMenuItemName)
                );
                setSelectedMenuItemName("");
                setSuccess(true);
              }
            }}
            disabled={loading ?? false}
            className="w-1/3 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
          >
            Delete Menu Item
          </button>
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
