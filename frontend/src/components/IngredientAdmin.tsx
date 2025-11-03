import { Ingredient as IngredientType } from "@/types/Ingredient";
import { useState } from "react";

export interface IngredientAdminProps {
  ingredient: IngredientType;
}

export default function IngredientAdmin({ ingredient }: IngredientAdminProps) {
  return (
    <div className="flex gap-4 p-4 border rounded-lg shadow bg-orange-600 w-[45vw] h-fit">
      {/* Right: Content */}
      <div className="flex-1 flex flex-col gap-3">
        {/* Name and Description - Side by Side */}
        <div className="flex gap-4">
          {/* Name */}
          <div className="flex-1 text-sm w-2/5">
            <div className="flex gap-4 w-3/4">
              <span className="font-bold">Name:</span>
              <span className="text-black">{ingredient.name}</span>
            </div>

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
          <div className="flex gap-4 w-3/5">
            <div className="text-sm font-bold mb-2">
              Sizes
              {/* Available Sizes */}
              {ingredient.sizes && ingredient.sizes.length > 0 && (
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2">
                    {ingredient.sizes.map((size) => (
                      <button
                        key={size.size}
                        type="button"
                        disabled
                        className="px-3 py-1 font-normal rounded border bg-red-600 text-black cursor-default"
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
    </div>
  );
}
