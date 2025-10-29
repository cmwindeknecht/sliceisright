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
  const [ingredientsToAdd, setIngredientsToAdd] = useState<Map<number, Ingredient>>(new Map());
  const [ingredientsToRemove, setIngredientsToRemove] = useState<Map<number, Ingredient>>(
    new Map()
  );
  const [ingredientsToDouble, setIngredientsToDouble] = useState<Map<number, Ingredient>>(
    new Map()
  );
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

  // useEffect(() => {
  //   if (selectedIngredient == null) {
  //     setShowAddButton(false);
  //     setShowDoubleButton(false);
  //     setShowRemoveButton(false);
  //     return;
  //   }

  //   // TODO this is oddly confusing so really need to work this out

  //   const addedIngredientCount = ingredientsToAdd.length + ingredientsToDouble.length;
  //   const alreadyRemoved =
  //     ingredientsToRemove.find(
  //       (ingredientToRemove) => ingredientToRemove.name == selectedIngredient.name
  //     ) != null;
  //   const menuItemContainsSelected =
  //     menuItem.ingredients.find(
  //       (menuItemIngredient) => menuItemIngredient.name == selectedIngredient.name
  //     ) != null;

  //   if (addedIngredientCount > 3) {
  //     setShowAddButton(false);
  //     setShowDoubleButton(false);
  //   }

  //   if (!alreadyRemoved && menuItemContainsSelected) {
  //     setShowRemoveButton(true);
  //   }

  //   setShowAddButton(
  //     ingredientsToAdd.find((ingredientToAdd) => ingredientToAdd.name == selectedIngredient.name) !=
  //       null
  //   );
  //   setShowDoubleButton(
  //     ingredientsToDouble.find(
  //       (ingredientToDouble) => ingredientToDouble.name == selectedIngredient.name
  //     ) != null
  //   );
  //   setShowRemoveButton(
  //     ingredientsToRemove.find(
  //       (ingredientToRemove) => ingredientToRemove.name == selectedIngredient.name
  //     ) != null
  //   );
  // }, [selectedIngredient]);

  function getIngredientsPrice(ingredients: Map<number, Ingredient>, currentSize: MenuItemSize) {
    let tempPrice = 0;
    ingredients.values().forEach((ingredient) => {
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

  function doesMenuItemHasIngredient() {
    if (selectedIngredient == null) return false;

    return menuItem.ingredients.find(
      (menuItemIngredient) => menuItemIngredient.name == selectedIngredient.name
    );
  }

  // TODO proper shit - add to a cart and what not
  function addToCart() {
    router.back();
  }

  function cancel() {
    router.back();
  }

  function addIngredient() {
    if (selectedIngredient == null) {
      return;
    }

    removeFromIngredientsToRemove(selectedIngredient);
    removeFromIngredientsToDouble(selectedIngredient);
    addToIngredientsToAdd(selectedIngredient);
  }

  function removeIngredient() {
    if (selectedIngredient == null) {
      return;
    }

    removeFromIngredientsToAdd(selectedIngredient);
    removeFromIngredientsToDouble(selectedIngredient);
    addToIngredientsToRemove(selectedIngredient);
  }

  function doubleIngredient() {
    if (selectedIngredient == null) {
      return;
    }

    removeFromIngredientsToAdd(selectedIngredient);
    removeFromIngredientsToRemove(selectedIngredient);
    addToIngredientsToDouble(selectedIngredient);
  }

  function removeFromIngredientsToAdd(toRemove: Ingredient) {
    setIngredientsToAdd((prev) => {
      if (toRemove.id != null && prev.has(toRemove.id)) {
        prev.delete(toRemove.id);
      }
      return prev;
    });
  }

  function addToIngredientsToAdd(toAdd: Ingredient) {
    setIngredientsToAdd((prev) => {
      if (toAdd.id != null && !prev.has(toAdd.id)) {
        prev.set(toAdd.id, toAdd);
      }
      return prev;
    });
  }

  function removeFromIngredientsToRemove(toRemove: Ingredient) {
    setIngredientsToRemove((prev) => {
      if (toRemove.id != null && prev.has(toRemove.id)) {
        prev.delete(toRemove.id);
      }
      return prev;
    });
  }

  function addToIngredientsToRemove(toAdd: Ingredient) {
    setIngredientsToRemove((prev) => {
      if (toAdd.id != null && !prev.has(toAdd.id)) {
        prev.set(toAdd.id, toAdd);
      }
      return prev;
    });
  }

  function removeFromIngredientsToDouble(toRemove: Ingredient) {
    setIngredientsToDouble((prev) => {
      if (toRemove.id != null && prev.has(toRemove.id)) {
        prev.delete(toRemove.id);
      }
      return prev;
    });
  }

  function addToIngredientsToDouble(toAdd: Ingredient) {
    setIngredientsToDouble((prev) => {
      if (toAdd.id != null && !prev.has(toAdd.id)) {
        prev.set(toAdd.id, toAdd);
      }
      return prev;
    });
  }

  return (
    <>
      <div
        className={clsx(
          "flex flex-col min-w-[95vw] justify-center items-center outline-1 outline-orange-600 bg-yellow-100"
        )}
      >
        {/* Image / Name & Description */}
        <div className="flex flex-row items-stretch w-[95vw]">
          <div className="flex-shrink-0 cursor-pointer" onClick={() => setShowImageOverlay(true)}>
            <Image
              src="/queens.jpg"
              className="w-[15vw] h-full object-cover"
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
          <div className="flex flex-col w-[40vw] h-full justify-between p-5">
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
                          ? "bg-red-600 hover:bg-red-700 ring-4 ring-red-800"
                          : "bg-orange-600 hover:bg-orange-700",
                        "rounded-lg px-5 py-2.5 me-2 mb-2 w-[25%]",
                        "focus:outline-none"
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
                        {!doesMenuItemHasIngredient() && (
                          <button
                            type="button"
                            onClick={() => {
                              addIngredient();
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
                        {doesMenuItemHasIngredient() &&
                          menuItem.ingredients.find(
                            (menuItemIngredient) =>
                              menuItemIngredient.name == selectedIngredient.name
                          ) && (
                            <button
                              type="button"
                              onClick={() => {
                                removeIngredient();
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
                        <button
                          type="button"
                          onClick={() => {
                            doubleIngredient();
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
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div>
            {/* Ingredient Modifications */}
            <div className="flex flex-row w-[55vw] h-full justify-between border-r-2 border-l-2 border-b-2">
              <div className="flex flex-col w-full h-full p-2">
                <div className="font-bold">Added</div>
                {ingredientsToAdd.size > 0 &&
                  ingredientsToAdd.values().map((ingredientToAdd) => (
                    <div
                      className="flex flex-row justify-between w-full px-2"
                      key={ingredientToAdd.id}
                    >
                      <div>{ingredientToAdd.name}</div>
                      <div>
                        $
                        {ingredientToAdd.sizes
                          .find((ingredientSize) => ingredientSize.size == size?.size)
                          ?.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col w-full h-full border-l-2 p-2">
                <div className="font-bold">Doubled</div>
                {ingredientsToDouble.size > 0 &&
                  ingredientsToDouble.values().map((ingredientToDouble) => (
                    <div
                      className="flex flex-row justify-between w-full px-2"
                      key={ingredientToDouble.id}
                    >
                      <div>{ingredientToDouble.name}</div>
                      <div>
                        $
                        {ingredientToDouble.sizes
                          .find((ingredientSize) => ingredientSize.size == size?.size)
                          ?.price.toFixed(2)}
                      </div>
                    </div>
                  ))}
              </div>
              <div className="flex flex-col w-full h-full border-l-2 p-2">
                <div className="font-bold">Removed</div>
                {ingredientsToRemove.size > 0 &&
                  ingredientsToRemove.values().map((ingredientToRemove) => (
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
