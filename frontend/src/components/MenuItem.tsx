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
  ingredients: Ingredient[];
}

export default function MenuItem({ menuItem, ingredients }: MenuItemProps) {
  const router = useRouter();
  const [showImageOverlay, setShowImageOverlay] = useState<boolean>(false);

  const [size, setSize] = useState<MenuItemSize | null>(null);
  const [selectedIngredient, setSelectedIngredient] = useState<Ingredient | null>(null);
  const [showAddButton, setShowAddButton] = useState<boolean>(false);
  const [showDoubleButton, setShowDoubleButton] = useState<boolean>(false);
  const [showRemoveButton, setShowRemoveButton] = useState<boolean>(false);
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

  useEffect(() => {
    // TODO this is oddly confusing so really need to work this out

    if (selectedIngredient == null) {
      setShowAddButton(false);
      setShowDoubleButton(false);
      setShowRemoveButton(false);
      return;
    }

    const addedIngredientCount = ingredientsToAdd.length + ingredientsToDouble.length;
    const alreadyRemoved =
      ingredientsToRemove.find(
        (ingredientToRemove) => ingredientToRemove.name == selectedIngredient.name
      ) != null;
    const menuItemContainsSelected =
      menuItem.ingredients.find(
        (menuItemIngredient) => menuItemIngredient.name == selectedIngredient.name
      ) != null;

    if (addedIngredientCount > 3) {
      setShowAddButton(false);
      setShowDoubleButton(false);
    }

    if (!alreadyRemoved && menuItemContainsSelected) {
      setShowRemoveButton(true);
    }

    setShowAddButton(
      ingredientsToAdd.find((ingredientToAdd) => ingredientToAdd.name == selectedIngredient.name) !=
        null
    );
    setShowDoubleButton(
      ingredientsToDouble.find(
        (ingredientToDouble) => ingredientToDouble.name == selectedIngredient.name
      ) != null
    );
    setShowRemoveButton(
      ingredientsToRemove.find(
        (ingredientToRemove) => ingredientToRemove.name == selectedIngredient.name
      ) != null
    );
  }, [selectedIngredient]);

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

  function shouldShowAddButton(selectedIngredient: Ingredient) {
    if (
      menuItem.ingredients.find(
        (menuItemIngredient) => menuItemIngredient.name == selectedIngredient.name
      )
    ) {
      return false;
    }
  }

  function shouldShowRemoveButton(selectedIngredient: Ingredient) {
    return menuItem.ingredients.find(
      (menuItemIngredient) => menuItemIngredient.name == selectedIngredient.name
    );
  }

  function shouldShowDoubleButton(selectedIngredient: Ingredient) {
    return;
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
        {/* Image / Name & Description */}
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

        <div className="flex flex-row">
          {/* Size & Toppings / Ingredient Modification */}
          <div className="flex flex-col w-[45vw] h-full justify-between p-5">
            {/* Size & Toppings*/}
            <div>
              <div className={clsx("flex flex-row h-full")}>
                {[...menuItem.sizes]
                  .sort((a, b) => sizeOrder.indexOf(a.size) - sizeOrder.indexOf(b.size))
                  .map((thisSize) => (
                    <button
                      type="button"
                      key={menuItem.name + thisSize.price + thisSize.size}
                      onClick={() => setSize(thisSize)}
                      className={clsx(
                        "text-sm text-white font-medium",
                        size == thisSize
                          ? "bg-red-600 hover:bg-red-700  focus:ring-red-800"
                          : "bg-orange-600 hover:bg-orange-700  focus:ring-orange-800",
                        "rounded-lg px-5 py-2.5 me-2 mb-2 w-[25%]",
                        "focus:outline-none focus:ring-4"
                      )}
                    >
                      {thisSize.size}
                    </button>
                  ))}
              </div>

              <div className="flex flex-row">
                <div className={clsx("flex flex-row items-center h-[10vh]")}>
                  <IngredientDropdown
                    ingredients={ingredients}
                    setSelectedIngredient={setSelectedIngredient}
                  />
                  {selectedIngredient && (
                    <div className="flex flex-col items-center justify-center pl-5">
                      <div
                        className={clsx(
                          "rounded-lg p-2 m-1",
                          "font-semibold font-stretch-ultra-expanded text-sm text-black underline-offset-1"
                        )}
                      >
                        <u>{selectedIngredient.name}</u>
                      </div>
                      <div className="flex flex-row">
                        {selectedIngredient && (
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
                            Add
                          </button>
                        )}
                        {selectedIngredient.canBeRemoved &&
                          menuItem.ingredients.find(
                            (menuItemIngredient) =>
                              menuItemIngredient.name == selectedIngredient.name
                          ) && (
                            <button
                              type="button"
                              onClick={() => {
                                setIngredientsToRemove([
                                  ...ingredientsToRemove,
                                  selectedIngredient,
                                ]);
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
            </div>
          </div>
          <div>
            {/* Ingredient Modifications */}
            <div className="flex flex-row w-[45vw] h-full justify-between border-r-2 border-l-2 border-b-2">
              <div className="flex flex-col w-full h-full p-2">
                <h1>Added</h1>
                {ingredientsToAdd.length > 0 &&
                  ingredientsToAdd.map((ingredientToAdd) => (
                    <div
                      className="flex flex-row justify-between w-full px-2"
                      key={ingredientToAdd.id}
                    >
                      <div>{ingredientToAdd.name}</div>
                      <div>
                        {
                          ingredientToAdd.sizes.find(
                            (ingredientSize) => ingredientSize.size == size?.size
                          )?.price
                        }
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col w-full h-full border-l-2 p-2">
                <h1>Doubled</h1>
                {ingredientsToDouble.length > 0 &&
                  ingredientsToDouble.map((ingredientToDouble) => (
                    <div
                      className="flex flex-row justify-between w-full px-2"
                      key={ingredientToDouble.id}
                    >
                      <div>{ingredientToDouble.name}</div>
                      <div>
                        {
                          ingredientToDouble.sizes.find(
                            (ingredientSize) => ingredientSize.size == size?.size
                          )?.price
                        }
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col w-full h-full border-l-2 p-2">
                <h1>Removed</h1>
                {ingredientsToRemove.length > 0 &&
                  ingredientsToRemove.map((ingredientToRemove) => (
                    <div
                      className="flex flex-row justify-center w-full px-2"
                      key={ingredientToRemove.id}
                    >
                      <div>{ingredientToRemove.name}</div>
                    </div>
                  ))}
              </div>
            </div>
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
    </>
  );
}
