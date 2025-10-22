import { useState } from "react";
import Image from "next/image";
import { MenuItem as MenuItemType } from "@/types/MenuItem";

export interface MenuItemProps {
  menuItem: MenuItemType;
}

export default function MenuItem({ menuItem }: MenuItemProps) {
  const [size, setSize] = useState<string | null>(null);

  return (
    <div key={menuItem.id} className="flex flex-row max-w-md .h-8">
      <Image
        src="/queens.jpg"
        className="w-32 h-full"
        width={1536}
        height={2048}
        alt={menuItem.name}
      />
      <div className="flex flex-col">
        <div>{menuItem.name}</div>
        <div>{menuItem.description}</div>
        <div>
          {menuItem.ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex flex-row">
              <div>{ingredient.name}</div>
              {ingredient.canBeRemoved && (
                <label>
                  <input type="checkbox" name="canBeRemoved" value="yes" /> Remove?
                </label>
              )}
              {ingredient.canBeDoubled && (
                <label>
                  <input type="checkbox" name="canBeDoubled" value="yes" /> Double?
                </label>
              )}
            </div>
          ))}
        </div>
        <div>
          {menuItem.sizes.map((size) => {
            return (
              <button
                type="button"
                key={menuItem.name + size.price + size.size}
                onClick={() => setSize(size.size)}
                className="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
              >
                {size.size} --- ${size.price}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
