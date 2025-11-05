import { Ingredient } from "@/types/Ingredient";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import { useState } from "react";
import { CircleArrowLeft, CircleArrowRight, CircleDot, PlusCircle, XCircle } from "lucide-react";
import clsx from "clsx";
import { MenuItemSize } from "@/types/MenuItem";

export interface MenuItemIngredientProps {
  ingredient: Ingredient;
  selectedSize: MenuItemSize;
  canBeRemoved: boolean;
  updateIngredientOptions: (ingredientOption: IngredientOption) => void;
}

export interface IngredientOption {
  ingredientId: number;
  basePrice: number;
  isRemoved: boolean;
  isDoubled: boolean;
  isLeftHalf: boolean;
  isRightHalf: boolean;
  isWholePizza: boolean;
}

export default function MenuItemIngredient({
  ingredient,
  selectedSize,
  canBeRemoved,
  updateIngredientOptions,
}: MenuItemIngredientProps) {
  const defaultIngedientOption: IngredientOption = {
    ingredientId:
      ingredient.id ??
      (() => {
        throw new Error(`No matching size found for ${selectedSize.size}`);
      })(), // TODO do a check when listing ingredients whether they have an id
    // before instantiating the MenuItemIngredient - should never happen
    basePrice:
      ingredient.sizes.find((s) => s.size === selectedSize.size)?.price ??
      (() => {
        throw new Error(`No matching size found for ${selectedSize.size}`);
      })(), // TODO do a check when listing ingredients whether they have the size in MenuItem
    // before instantiating the MenuItemIngredient - should never happen
    isRemoved: false,
    isDoubled: false,
    isLeftHalf: false,
    isRightHalf: false,
    isWholePizza: true,
  };

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [ingredientOption, setIngredientOption] =
    useState<IngredientOption>(defaultIngedientOption);

  const handleAddedIngredient = () => {
    updateIngredientOptions(ingredientOption);
    setShowOptions((prev) => !prev);
  };

  const handleIngredientOptionUpdate = (params: Partial<IngredientOption>) => {
    const updated = {
      ...ingredientOption,
      ...params,
    };
    setIngredientOption(updated);
    updateIngredientOptions(updated);
  };

  return (
    <div className="flex flex-row items-center gap-2 mt-2 w-full">
      <div className="flex flex-row items-center w-1/5 gap-2 z-1 bg-orange-600">
        <OverlayImageWithFadeIn
          imageUrl=""
          itemName={ingredient.name}
          useOverlay={false}
          wrapperClass="w-[5vw] relative bg-gray-300"
        />
        <span className="flex-1">{ingredient.name}</span>

        <button
          type="button"
          onClick={() => handleAddedIngredient()}
          className={clsx(
            showOptions
              ? "bg-red-600 hover:bg-red-700 ring-4 ring-red-800"
              : "bg-orange-600 hover:bg-orange-700 ring-orange-800",
            "text-white rounded focus:outline-none mr-2"
          )}
        >
          {showOptions ? <XCircle className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
        </button>
      </div>

      {showOptions && (
        <div className="flex flex-row gap-3 px-3 items-center slide-in-left bg-red-600">
          <button
            onClick={() =>
              handleIngredientOptionUpdate({
                isLeftHalf: true,
                isRightHalf: false,
                isWholePizza: false,
              })
            }
            className={clsx(
              ingredientOption.isRemoved
                ? "bg-gray-600 text-black"
                : ingredientOption.isLeftHalf
                  ? "ring-2 ring-black ring-inset bg-orange-700 hover:bg-orange-800"
                  : "bg-orange-600 hover:bg-orange-700",
              "m-w-20 w-20 flex flex-col items-center text-white rounded-lg p-1"
            )}
          >
            <CircleArrowLeft /> <span className="text-xs">Left Half</span>
          </button>
          <button
            onClick={() =>
              handleIngredientOptionUpdate({
                isLeftHalf: false,
                isRightHalf: false,
                isWholePizza: true,
              })
            }
            className={clsx(
              ingredientOption.isRemoved
                ? "bg-gray-600 text-black"
                : ingredientOption.isWholePizza
                  ? "ring-2 ring-black ring-inset bg-orange-700 hover:bg-orange-800"
                  : "bg-orange-600 hover:bg-orange-700",
              "m-w-20 w-20 flex flex-col items-center text-white rounded-lg p-1"
            )}
          >
            <CircleDot /> <span className="text-xs">Whole</span>
          </button>
          <button
            onClick={() =>
              handleIngredientOptionUpdate({
                isLeftHalf: false,
                isRightHalf: true,
                isWholePizza: false,
              })
            }
            className={clsx(
              ingredientOption.isRemoved
                ? "bg-gray-600 text-black"
                : ingredientOption.isRightHalf
                  ? "ring-2 ring-black ring-inset bg-orange-700 hover:bg-orange-800"
                  : "bg-orange-600 hover:bg-orange-700",
              "m-w-20 w-20 flex flex-col items-center text-white rounded-lg p-1"
            )}
          >
            <CircleArrowRight /> <span className="text-xs">Right Half</span>
          </button>
          <div className="flex flex-col items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ingredientOption.isDoubled}
                onChange={(e) =>
                  handleIngredientOptionUpdate({ isRemoved: false, isDoubled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-400 rounded-full transition-colors peer-checked:bg-orange-600 peer-checked:border-2 peer-checked:border-orange-700" />
              <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5" />
            </label>
            <span className="text-xs text-white">Double</span>
          </div>
          <div className="flex flex-col items-center">
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={ingredientOption.isRemoved}
                onChange={(e) =>
                  handleIngredientOptionUpdate({ isRemoved: e.target.checked, isDoubled: false })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-400 rounded-full transition-colors peer-checked:bg-orange-600 peer-checked:border-2 peer-checked:border-orange-700" />
              <div className="absolute top-0.5 left-0.5 bg-white w-5 h-5 rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5" />
            </label>
            <span className="text-xs text-white">Remove</span>
          </div>
        </div>
      )}
    </div>
  );
}
