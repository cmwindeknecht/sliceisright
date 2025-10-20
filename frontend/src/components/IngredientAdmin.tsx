import { Ingredient as IngredientType } from "@/types/Ingredient";
import { useState } from "react";

export interface IngredientAdminProps {
  ingredient: IngredientType;
}

export default function IngredientAdmin({ ingredient }: IngredientAdminProps) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg shadow bg-white min-w-lg h-fit">
      {/* Right: Content */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Name and Description - Side by Side */}
        <div className="flex gap-4">
          {/* Name */}
          <div className="flex-1">
            <h3 className="text-xl font-semibold">{ingredient.name}</h3>

            <div className="flex flex-row">
              <input type="checkbox" checked={ingredient.canBeDoubled} readOnly />
              <div className="pl-1">Can be doubled? </div>
            </div>
            <div className="flex flex-row">
              <input type="checkbox" checked={ingredient.canBeRemoved} readOnly />
              <div className="pl-1">Can be removed? </div>
            </div>
          </div>

          {/* Available Sizes and Ingredients - Side by Side */}
          <div className="flex gap-4">
            {/* Available Sizes */}
            {ingredient.availableSizes && ingredient.availableSizes.length > 0 && (
              <div className="flex-1">
                <div className="text-sm font-medium mb-2">Available Sizes:</div>
                <div className="flex flex-wrap gap-2">
                  {ingredient.availableSizes.map((size) => (
                    <button
                      key={size.size}
                      type="button"
                      disabled
                      className="px-3 py-1 rounded border bg-gray-100 text-gray-700 cursor-default"
                    >
                      {size.size}: ${size.price.toFixed(2)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
