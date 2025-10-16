"use client"

import { Ingredient } from "@/types/Ingredient";
import { useState } from "react";

interface AddMenuItemProps {
  availableIngredients: Ingredient[] | null;
}

export default function AddMenuItem({ availableIngredients }: AddMenuItemProps) {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [sizes, setSizes] = useState<string[]>([]);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isCustomizable, setIsCustomizable] = useState<boolean>(false);
  const [defaultIngredients, setDefaultIngredients] = useState<Ingredient[]>([]);

  const sizeOptions = ["None", "S", "M", "L", "XL"];

  return (
    <div className="flex flex-col gap-4 p-4">
      <h2 className="text-2xl font-bold">Add/Update Menu Item</h2>
      
      <div>
        <label className="block mb-1">Name</label>
        <input 
          type="text" 
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Description</label>
        <input 
          type="text" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Price</label>
        <input 
          type="number" 
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="block mb-1">Sizes</label>
        <select 
          multiple
          value={sizes}
          onChange={(e) => setSizes(Array.from(e.target.selectedOptions, option => option.value))}
          className="border rounded px-2 py-1 w-full"
        >
          {sizeOptions.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1">Image URL</label>
        <input 
          type="text" 
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="border rounded px-2 py-1 w-full"
        />
      </div>

      <div>
        <label className="flex items-center gap-2">
          <input 
            type="checkbox" 
            checked={isCustomizable}
            onChange={(e) => setIsCustomizable(e.target.checked)}
          />
          Can be customized by customer?
        </label>
      </div>

        {availableIngredients != null && 
            <div>
                <label className="block mb-1">Ingredients</label>
                <select 
                multiple
                value={defaultIngredients.map(i => i.id.toString())}
                onChange={(e) => {
                    const selectedIds = Array.from(e.target.selectedOptions, option => option.value);
                    const selected = availableIngredients?.filter(ing => 
                    selectedIds.includes(ing.id.toString())
                    );
                    setDefaultIngredients(selected ?? []);
                }}
                className="border rounded px-2 py-1 w-full h-32"
                >
                {availableIngredients?.map(ingredient => (
                    <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name}
                    </option>
                ))}
                </select>
            </div>
        }
    </div>
  );
}