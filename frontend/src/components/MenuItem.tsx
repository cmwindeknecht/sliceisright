"use client";

import { useEffect, useState } from "react";
import { MenuItemSize, MenuItem as MenuItemType } from "@/types/MenuItem";
import { Ingredient } from "@/types/Ingredient";
import clsx from "clsx";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import MenuItemIngredient, { IngredientOption } from "./MenuItemIngredient";
import { sortMenuSize } from "@/misc/helper";

export interface MenuItemProps {
  menuItem: MenuItemType;
  ingredients: Ingredient[];
}

export default function MenuItem({ menuItem, ingredients }: MenuItemProps) {
  const initialSize = sortMenuSize(menuItem.sizes)[0];
  if (!initialSize) {
    throw new Error("No Size on Menu Item!");
  }

  const [selectedSize, setSelectedSize] = useState<MenuItemSize>(initialSize);
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);
  const [ingredientOptions, setIngredientOptions] = useState<Map<number, IngredientOption>>(
    new Map()
  );

  const updateIngredientOptions = (ingredientOption: IngredientOption) => {
    const tempIngredientOptions = new Map(ingredientOptions);
    tempIngredientOptions.set(ingredientOption.ingredientId, ingredientOption);
    setIngredientOptions(tempIngredientOptions);
  };

  function doesMenuItemHaveIngredient(ingredient: Ingredient) {
    return (
      menuItem.ingredients.find(
        (menuItemIngredient) => menuItemIngredient.name == ingredient.name
      ) != null
    );
  }

  return (
    <>
      <div
        className={clsx(
          "flex flex-col w-[95vw] justify-center items-center outline-1 outline-orange-600 bg-yellow-100"
        )}
      >
        {/* Image / Name & Description */}
        <div className="flex flex-row items-stretch w-[95vw]">
          <OverlayImageWithFadeIn
            itemName={menuItem.name}
            wrapperClass="w-[15vw] relative bg-gray-300 cursor-pointer"
          />

          <div className="flex flex-col w-[80vw] bg-red-600">
            <div className="font-bold bg-orange-600">{menuItem.name}</div>
            <div className="flex flex-row gap-2">
              <div className="p-3 w-full">{menuItem.description}</div>
            </div>
          </div>
        </div>

        {/* Toppings */}
        {/* TODO Have the toppings like Outbound dashboard 
          At top is a list of already included ingredients to be modified
          Next is a list of ingredients that can be added
          */}
        <div className="flex flex-col w-full justify-start items-start">
          {ingredients.map((ingredient) => (
            <MenuItemIngredient
              key={ingredient.id}
              ingredient={ingredient}
              selectedSize={selectedSize}
              canBeRemoved={doesMenuItemHaveIngredient(ingredient)}
              updateIngredientOptions={updateIngredientOptions}
            />
          ))}
        </div>
      </div>
      {showImageOverlay && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setShowImageOverlay(false)}
        >
          <img
            // src={menuItem.imageUrl || "/queens.jpg"}
            src={"/queens.jpg"}
            alt={menuItem.name}
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
