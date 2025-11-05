"use client";

import { useEffect, useState } from "react";
import { MenuItemSize, MenuItem as MenuItemType } from "@/types/MenuItem";
import { Ingredient } from "@/types/Ingredient";
import clsx from "clsx";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import MenuItemIngredient, { IngredientOption } from "./MenuItemIngredient";
import { sortIngredientsByCategory, sortMenuSize } from "@/misc/helper";

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
  const [categorizedIngredients, setCategorizedIngredients] = useState<Map<string, Ingredient[]>>(
    new Map()
  );

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const ingredientMap = new Map<string, Ingredient[]>();

    for (const ingredient of ingredients) {
      const ingredientSelectedSize = ingredient.sizes.find(
        (ingredientSize) => ingredientSize.size != selectedSize.size
      );
      if (!ingredientSelectedSize) {
        console.warn(
          `Ingredient ${ingredient.name} does not have the selected size and will not be listed`
        );
        continue;
      }
      if (ingredient.id == null) {
        console.error(`Ingredient ${ingredient.name} does not have an id!`);
        continue;
      }

      let key;
      if (doesMenuItemHaveIngredient(ingredient)) {
        key = "INCLUDED";
        updateIngredientOptions({
          ingredientId: ingredient.id,
          basePrice: ingredientSelectedSize.price,
          isRemoved: false,
          isLight: false,
          isRegular: true,
          isDoubled: false,
          isLeftHalf: false,
          isRightHalf: false,
          isWholePizza: true,
        });
      } else {
        key = ingredient.category;
      }

      const ingredientList = ingredientMap.get(key) ?? [];
      ingredientList.push(ingredient);
      ingredientMap.set(key, ingredientList);
    }

    for (const ingredientList of ingredientMap.values()) {
      ingredientList.sort((a, b) => a.name.localeCompare(b.name));
    }

    setCategorizedIngredients(ingredientMap);
  }, [ingredients]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const updateIngredientOptions = (ingredientOption: IngredientOption) => {
    let ingredientCount = 0;

    ingredientOptions.values().forEach((ingredientOption) => {
      if (ingredientOption.isWholePizza) {
        ingredientCount += ingredientOption.isDoubled ? 2 : 1;
      } else if (ingredientOption.isLeftHalf || ingredientOption.isRightHalf) {
        ingredientCount += ingredientOption.isDoubled ? 1 : 0.5;
      } else if (ingredientOption.isRemoved) {
        ingredientCount -= 1;
      }
    });

    // TODO hmm somehow this happened when I created a new ingredient, so something fucked up is going on
    if (ingredientCount) {
      setError("Maximum number (10) of ingredients has been reached");
      return false;
    }

    const tempIngredientOptions = new Map(ingredientOptions);
    tempIngredientOptions.set(ingredientOption.ingredientId, ingredientOption);
    setIngredientOptions(tempIngredientOptions);
    return true;
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

        {/* Sizes */}
        <div className="flex flex-col w-full justify-start items-start gap-2">
          <div className="p-2 text-2xl">Sizes</div>
          <div className="flex flex-row w-full justify-start items-start gap-2">
            {sortMenuSize(menuItem.sizes).map((menuItemSize) => (
              <button
                key={menuItem.id + menuItemSize.size}
                onClick={() => setSelectedSize(menuItemSize)}
                className={clsx(
                  selectedSize && selectedSize.size == menuItemSize.size
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-gray-600 hover:bg-orange-700",
                  "outline-1 outline-black text-white px-1 rounded"
                )}
              >
                {menuItemSize.size === "NONE"
                  ? `$${menuItemSize.price.toFixed(2)}`
                  : `${menuItemSize.size} - $${menuItemSize.price.toFixed(2)}`}
              </button>
            ))}
          </div>
        </div>

        {/* Toppings */}
        <div className="flex flex-col w-full gap-4">
          {Array.from(sortIngredientsByCategory(categorizedIngredients).entries()).map(
            ([category, ingredientList]) => (
              <div key={category} className="flex flex-col w-full">
                <div className="p-2 text-2xl">{category} TOPPINGS</div>
                <div className="flex flex-col w-full justify-start items-start gap-2">
                  {ingredientList.map((ingredient) => (
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
            )
          )}
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
      {error && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg text-sm animate-fade-in">
          {error}
        </div>
      )}
    </>
  );
}
