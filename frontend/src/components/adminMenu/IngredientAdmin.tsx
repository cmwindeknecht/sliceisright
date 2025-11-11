import { Ingredient as IngredientType } from "@/types/Ingredient";
import { useState } from "react";
import OverlayImageWithFadeIn from "../OverlayImageWithFadeIn";
import { sortIngredientSize } from "@/misc/helper";

export interface IngredientAdminProps {
  ingredient: IngredientType;
}

export default function IngredientAdmin({ ingredient }: IngredientAdminProps) {
  return (
    <div className="flex gap-4 p-2 border rounded-lg shadow bg-orange-600 w-[95vw] h-fit">
      <div className="flex flex-col gap-4 w-full">
        <div className="flex flex-row flex-wrap gap-4 text-sm w-full">
          <OverlayImageWithFadeIn
            imageUrl={ingredient.imageUrl || ""}
            itemName={ingredient.name}
            useOverlay={false}
            wrapperClass="w-[5vw] relative bg-gray-300"
          />

          <div className="flex flex-col items-stretch w-1/4">
            <div className="flex flex-row justify-between gap-4 text-lg">
              <span className="font-bold">Name:</span>
              <span className="text-black">{ingredient.name}</span>
            </div>
            <div className="flex flex-row justify-between  gap-4">
              <span className="font-bold">Ingredient Category:</span>
              <span className="text-black">{ingredient.category}</span>
            </div>
            <div className="flex flex-row justify-between  gap-4">
              <span className="font-bold">Menu Item Category:</span>
              <span className="text-black">{ingredient.menuItemCategory}</span>
            </div>
          </div>

          <div className="border-2 border-black" />

          <div className="flex flex-col items-stretch w-1/4">
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="pl-1">Can be doubled? </div>
              <input type="checkbox" checked={ingredient.canBeDoubled} readOnly />
            </div>
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="pl-1">Can be removed? </div>
              <input type="checkbox" checked={ingredient.canBeRemoved} readOnly />
            </div>
            <div className="flex flex-row items-center justify-between gap-4">
              <div className="pl-1">Can be halved? </div>
              <input type="checkbox" checked={ingredient.canBeHalved} readOnly />
            </div>
            <div className="flex flex-row  items-center justify-between gap-4">
              <div className="pl-1">Can be light? </div>
              <input type="checkbox" checked={ingredient.canBeLight} readOnly />
            </div>
          </div>

          <div className="border-2 border-black" />

          <div className="flex flex-col items-stretch w-1/4 flex-wrap">
            <div className="text-sm font-bold mb-2">Sizes</div>
            <div className="flex flex-wrap gap-2">
              {[...sortIngredientSize(ingredient.sizes)].map((size) => (
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
        </div>
      </div>
    </div>
  );
}
