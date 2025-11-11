"use client";

import { useEffect, useState } from "react";
import { MenuItemSize, MenuItem as MenuItemType, OrderItem } from "@/types/MenuItem";
import { Ingredient } from "@/types/Ingredient";
import clsx from "clsx";
import OverlayImageWithFadeIn from "../OverlayImageWithFadeIn";
import MenuItemIngredient, { IngredientOption } from "./MenuItemIngredient";
import {
  getPriceOfIngredientOption,
  showPriceOfIngredient,
  sortIngredientsByCategory,
  sortMenuSize,
} from "@/misc/helper";
import { useMenu } from "../context/Menu";

export interface MenuItemProps {
  menuItem: MenuItemType;
  ingredients: Ingredient[];
  returnToMenu: (item: MenuItemType | null) => void;
}

export default function MenuItem({ menuItem, ingredients, returnToMenu }: MenuItemProps) {
  const { addOrderItem } = useMenu();

  const initialSize = sortMenuSize(menuItem.sizes)[0];
  if (!initialSize) {
    throw new Error("No Size on Menu Item!");
  }

  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [notes, setNotes] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<MenuItemSize>(initialSize);
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [ingredientOptions, setIngredientOptions] = useState<Map<number, IngredientOption>>(
    new Map()
  );
  const [categorizedIngredients, setCategorizedIngredients] = useState<Map<string, Ingredient[]>>(
    new Map()
  );

  useEffect(() => {
    categorizeIngredients();
  }, []);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    calculatePrice();
  }, [ingredientOptions, selectedSize]);

  const calculatePrice = () => {
    let price = selectedSize.price;

    for (const ingredientOption of [...ingredientOptions.values()]) {
      if (showPriceOfIngredient(ingredientOption)) {
        price += getPriceOfIngredientOption(ingredientOption);
      }
    }

    setCurrentPrice(price);
  };

  const categorizeIngredients = () => {
    const ingredientMap = new Map<string, Ingredient[]>();

    for (const ingredient of ingredients) {
      if (ingredient.menuItemCategory != menuItem.category) {
        return;
      }

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

      let menuItemHasIngredient = doesMenuItemHaveIngredient(ingredient);
      let key = menuItemHasIngredient ? "INCLUDED" : ingredient.category;
      if (menuItemHasIngredient) {
        updateIngredientOptions({
          ingredientId: ingredient.id,
          name: ingredient.name,
          basePrice: ingredientSelectedSize.price,
          isRemoved: false,
          isLight: false,
          isRegular: ingredient.canBeLight,
          isDoubled: false,
          isLeftHalf: false,
          isRightHalf: false,
          isWholeItem: ingredient.canBeHalved,
          isIncluded: true,
        });
      }

      const ingredientList = ingredientMap.get(key) ?? [];
      ingredientList.push(ingredient);
      ingredientMap.set(key, ingredientList);
    }

    for (const ingredientList of ingredientMap.values()) {
      ingredientList.sort((a, b) => a.name.localeCompare(b.name));
    }

    setCategorizedIngredients(ingredientMap);
  };

  const updateIngredientOptions = (ingredientOption: IngredientOption) => {
    const tempIngredientOptions = new Map(ingredientOptions);
    tempIngredientOptions.set(ingredientOption.ingredientId, ingredientOption);
    let ingredientCount = 0;

    tempIngredientOptions.values().forEach((ingredientOption) => {
      if (ingredientOption.isWholeItem) {
        ingredientCount += ingredientOption.isDoubled ? 2 : 1;
      } else if (ingredientOption.isLeftHalf || ingredientOption.isRightHalf) {
        ingredientCount += ingredientOption.isDoubled ? 1 : 0.5;
      } else if (ingredientOption.isRemoved) {
        ingredientCount -= 1;
      }
    });

    if (ingredientCount > 10) {
      setError("Maximum number (10) of ingredients has been reached");
      return false;
    }

    setIngredientOptions(tempIngredientOptions);
    return true;
  };

  const removeIngredientOption = (ingredientOption: IngredientOption) => {
    const tempIngredientOptions = new Map(ingredientOptions);
    tempIngredientOptions.delete(ingredientOption.ingredientId);
    setIngredientOptions(tempIngredientOptions);
  };

  const doesMenuItemHaveIngredient = (ingredient: Ingredient) => {
    return (
      menuItem.ingredients.find(
        (menuItemIngredient) => menuItemIngredient.name == ingredient.name
      ) != null
    );
  };

  const addToOrder = () => {
    const orderItem: OrderItem = {
      ...menuItem,
      orderItemId: Math.random(),
      ingredientOptions: Array.from(ingredientOptions.values()),
      chosenSize: selectedSize,
      quantity: 1,
      notes,
      price: currentPrice,
    };
    addOrderItem(orderItem);
    returnToMenu(null);
  };

  const handleNoteUpdate = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Enforce max 100 characters
    if (e.target.value.length <= 100) {
      setNotes(e.target.value);
    }
  };

  return (
    <>
      <div
        className={clsx(
          "flex flex-col w-[95vw] justify-center items-center outline-1 outline-orange-600 bg-yellow-100 px-2 mb-30"
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
        <div className="flex flex-row w-full justify-start gap-2">
          <span className="text-2xl">{menuItem.sizes.length > 1 ? "Sizes" : "Size"}: </span>
          {sortMenuSize(menuItem.sizes).map((menuItemSize) => (
            <button
              key={menuItem.id + menuItemSize.size}
              onClick={() => setSelectedSize(menuItemSize)}
              className={clsx(
                selectedSize && selectedSize.size == "NONE"
                  ? "bg-red-600 hover:bg-red-700"
                  : selectedSize.size == menuItemSize.size
                    ? "bg-red-600 hover:bg-red-700 outline-4 outline-black"
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

        {/* Toppings */}
        <div className="flex flex-col w-full gap-4">
          {Array.from(sortIngredientsByCategory(categorizedIngredients).entries()).map(
            ([category, ingredientList]) => (
              <div key={category} className="flex flex-col w-full">
                <div className="text-2xl">{category} TOPPINGS</div>
                <div className="flex flex-col w-full justify-start items-start gap-2">
                  {ingredientList.map((ingredient) => (
                    <MenuItemIngredient
                      key={ingredient.id}
                      ingredient={ingredient}
                      selectedSize={selectedSize}
                      canBeRemoved={doesMenuItemHaveIngredient(ingredient)}
                      updateIngredientOptions={updateIngredientOptions}
                      removeIngredientOption={removeIngredientOption}
                    />
                  ))}
                </div>
              </div>
            )
          )}
        </div>

        {/* Footer */}
        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-300 shadow-lg z-50 h-30">
          <div className="flex flex-row justify-around items-center w-full max-w-4xl mx-auto p-4 gap-5">
            <div className="flex flex-col w-full max-w-md">
              <label htmlFor="notes" className="mb-1 font-medium text-gray-700">
                Special Requests ({notes.length}/100):
              </label>
              <textarea
                id="notes"
                value={notes}
                onChange={handleNoteUpdate}
                rows={2}
                maxLength={100}
                placeholder="Add order notes..."
                className="resize-none border bg-white border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
              />
              <div className="text-right text-sm text-gray-500 mt-1"></div>
            </div>

            <div className="font-semibold text-lg">Price ${currentPrice.toFixed(2)}</div>

            <button
              onClick={() => addToOrder()}
              className={clsx(
                "bg-red-600 hover:bg-orange-700 text-white",
                "flex items-center justify-center h-10 px-4 rounded shadow-md outline-1 outline-black disabled:opacity-50"
              )}
            >
              Add to Cart
            </button>
          </div>
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
