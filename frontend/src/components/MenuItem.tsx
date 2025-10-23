"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { MenuItemSize, MenuItem as MenuItemType } from "@/types/MenuItem";
import IngredientDropdown from "./IngredientDropdown";
import { Ingredient, IngredientSize } from "@/types/Ingredient";
import clsx from "clsx";
import { useMenu } from "./context/Menu";
import { useRouter } from "next/navigation";

export interface MenuItemProps {
  menuItem: MenuItemType;
}

export default function MenuItem({ menuItem }: MenuItemProps) {
  const { ingredients } = useMenu();
  const router = useRouter();
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);

  const [size, setSize] = useState<MenuItemSize | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [ingredientsToAdd, setIngredientsToAdd] = useState<Ingredient[]>([]);
  const [ingredientsToRemove, setIngredientsToRemove] = useState<Ingredient[]>([]);
  const [ingredientsToDouble, setIngredientsToDouble] = useState<Ingredient[]>([]);
  const [price, setPrice] = useState<number | null>(null);

  const sizeOrder = ["S", "M", "L", "XL"];

  useEffect(() => {
    getSize();
  }, []);

  useEffect(() => {
    let currentSize: MenuItemSize = getSize();
    let currentPrice = price ?? currentSize.price;
    currentPrice += getIngredientsPrice(ingredientsToAdd, currentSize);
    currentPrice += getIngredientsPrice(ingredientsToDouble, currentSize);
    setPrice(currentPrice);
  }, [ingredientsToAdd, ingredientsToDouble]);

  function getIngredientsPrice(ingredients: Ingredient[], currentSize: MenuItemSize) {
    let tempPrice = 0;
    ingredients.forEach((ingredient) => {
      let foundIngredientSize: IngredientSize | null = null;

      for (const ingredientSize of ingredient.sizes) {
        if (ingredientSize.size === currentSize.size) {
          foundIngredientSize = ingredientSize;
          break;
        }
      }

      if (foundIngredientSize === null) {
        throw new Error(
          `There are no matching ingredient sizes for ${ingredient.name} and size ${currentSize.size}!`
        );
      } else {
        tempPrice += foundIngredientSize.price;
      }
    });

    return tempPrice;
  }

  function getSize() {
    if (size != null) {
      return size;
    }

    let tempSize: MenuItemSize | null = null;
    menuItem.sizes.forEach((size) => {
      if (tempSize == null || tempSize.price < size.price) {
        tempSize = size;
      }
    });

    if (tempSize == null) {
      throw new Error(`There are no sizes available for menu item ${menuItem.name}!`);
    }

    setSize(tempSize);
    return tempSize;
  }

  // TODO proper shit - add to a cart and what not
  function addToCart() {
    router.back();
  }

  function cancel() {
    router.back();
  }

  return (
    <>
      <div
        className={clsx(
          "flex flex-col min-w-[90vw] justify-center items-center outline-1 outline-orange-600 bg-yellow-100"
        )}
      >
        <div className="flex flex-row items-stretch w-[90vw]">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => setShowImageOverlay(true)}>
            <Image
              src="/queens.jpg"
              className="w-[10vw] h-full object-cover"
              width={1536}
              height={2048}
              alt={menuItem.name}
            />
          </div>
          <div className="flex flex-col w-[80vw] bg-red-600">
            <div className="font-bold bg-orange-600">{menuItem.name}</div>
            <div className="pl-5 pt-2">{menuItem.description}</div>
          </div>
        </div>

        <div className="flex flex-col w-[65vw] h-full justify-between p-5">
          <div className={clsx("flex flex-row h-full")}>
            {[...menuItem.sizes]
              .sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size))
              .map((size) => (
                <button
                  type="button"
                  key={menuItem.name + size.price + size.size}
                  onClick={() => setSize(size)}
                  className={clsx(
                    "text-sm text-white bg-red-700 font-medium",
                    "rounded-lg px-5 py-2.5 me-2 mb-2 w-[25%]",
                    "hover:bg-red-800 focus:outline-none focus:ring-4 focus:ring-red-300",
                    "dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                  )}
                >
                  {size.size}
                </button>
              ))}
          </div>

          <div className={clsx("flex flex-col h-full w-[65vw]")}>
            <IngredientDropdown
              ingredients={ingredients ?? []}
              setSelectedIngredient={setSelectedIngredient}
            />
            {selectedIngredient && (
              <div className="flex flex-col items-center justify-center">
                <div
                  className={clsx(
                    "rounded-lg p-2 m-1",
                    "font-semibold font-stretch-ultra-expanded text-sm text-black underline-offset-1"
                  )}
                >
                  <u>{selectedIngredient.name}</u>
                </div>
                <div className="flex flex-row">
                  {selectedIngredient.canBeRemoved && (
                    <button
                      type="button"
                      onClick={() => {
                        setIngredientsToRemove([...ingredientsToRemove, selectedIngredient]);
                        setSelectedIngredient(null);
                      }}
                      className={clsx(
                        "rounded-lg p-2 me-2 mb-2",
                        "font-medium text-sm text-white bg-red-700 hover:bg-red-800",
                        "focus:outline-none focus:ring-4 focus:ring-red-300",
                        "dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      )}
                    >
                      Remove
                    </button>
                  )}
                  {selectedIngredient.canBeDoubled && (
                    <button
                      type="button"
                      onClick={() => {
                        setIngredientsToDouble([...ingredientsToDouble, selectedIngredient]);
                        setSelectedIngredient(null);
                      }}
                      className={clsx(
                        "rounded-lg p-2 me-2 mb-2",
                        "font-medium text-sm text-white bg-red-700 hover:bg-red-800",
                        "focus:outline-none focus:ring-4 focus:ring-red-300",
                        "dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
                      )}
                    >
                      Double
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row min-w-[30vw] max-w-md h-full justify-between p-5 border-r-2 border-l-2 border-b-2">
          poop
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
