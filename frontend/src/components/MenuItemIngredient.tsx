import { Ingredient } from "@/types/Ingredient";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import { useState } from "react";
import {
  CircleArrowLeft,
  CircleArrowRight,
  CircleCheck,
  CircleDot,
  CircleFadingPlus,
  PlusCircle,
  SignalHigh,
  SignalLow,
  SignalMedium,
  XCircle,
} from "lucide-react";
import clsx from "clsx";
import { MenuItemSize } from "@/types/MenuItem";
import { getPriceOfIngredientOption, showPriceOfIngredient } from "@/misc/helper";

export interface MenuItemIngredientProps {
  ingredient: Ingredient;
  selectedSize: MenuItemSize;
  canBeRemoved: boolean;
  updateIngredientOptions: (ingredientOption: IngredientOption) => boolean;
  removeIngredientOption: (ingredientOption: IngredientOption) => void;
}

export interface IngredientOption {
  ingredientId: number;
  basePrice: number;
  isRemoved: boolean;
  isLight: boolean;
  isRegular: boolean;
  isDoubled: boolean;
  isLeftHalf: boolean;
  isRightHalf: boolean;
  isWholeItem: boolean;
  isIncluded: boolean;
}

export default function MenuItemIngredient({
  ingredient,
  selectedSize,
  canBeRemoved,
  updateIngredientOptions,
  removeIngredientOption,
}: MenuItemIngredientProps) {
  const defaultIngedientOption: IngredientOption = {
    ingredientId:
      ingredient.id ??
      (() => {
        throw new Error(`No matching size found for ${selectedSize.size}`);
      })(),
    basePrice:
      ingredient.sizes.find((s) => s.size === selectedSize.size)?.price ??
      (() => {
        throw new Error(`No matching size found for ${selectedSize.size}`);
      })(),
    isRemoved: false,
    isLight: false,
    isRegular: ingredient.canBeLight,
    isDoubled: false,
    isLeftHalf: false,
    isRightHalf: false,
    isWholeItem: ingredient.canBeHalved,
    isIncluded: canBeRemoved,
  };

  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [ingredientOption, setIngredientOption] =
    useState<IngredientOption>(defaultIngedientOption);

  const toggleIngredient = () => {
    if (showOptions) {
      removeIngredientOption(ingredientOption);
      setShowOptions(false);
    } else {
      const success = updateIngredientOptions(ingredientOption);
      if (success) {
        setShowOptions(true);
      }
    }
  };

  const handleIngredientOptionUpdate = (params: Partial<IngredientOption>) => {
    const updated = {
      ...ingredientOption,
      ...params,
    };
    if (updateIngredientOptions(updated)) {
      setIngredientOption(updated);
    }
  };

  return (
    <div className="flex flex-row mt-2 w-full h-15">
      <div className="h-full flex flex-row justify-between items-center w-1/5 gap-2 z-1 bg-orange-600">
        <OverlayImageWithFadeIn
          imageUrl={ingredient.imageUrl || ""}
          itemName={ingredient.name}
          useOverlay={false}
          wrapperClass="w-[5vw] relative bg-gray-300"
        />
        <div className="flex flex-col items-start w-3/4">
          <span className="">{ingredient.name}</span>
          <span
            className={clsx(
              "text-sm text-white",
              !showPriceOfIngredient(ingredientOption) && "invisible"
            )}
          >
            ${getPriceOfIngredientOption(ingredientOption).toFixed(2)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => toggleIngredient()}
          className={clsx(
            showOptions
              ? "bg-green-600 hover:bg-green-700 ring-4 ring-green-800"
              : "bg-orange-600 hover:bg-orange-700 ring-orange-800",
            "text-white rounded focus:outline-none mr-2"
          )}
        >
          {showOptions ? <CircleCheck className="w-6 h-6" /> : <PlusCircle className="w-6 h-6" />}
        </button>
      </div>

      {showOptions && (
        <div className="flex flex-row gap-3 h-full px-3 items-center slide-in-left bg-red-600">
          {ingredient.canBeHalved && (
            <>
              <button
                onClick={() =>
                  handleIngredientOptionUpdate({
                    isLeftHalf: true,
                    isRightHalf: false,
                    isWholeItem: false,
                  })
                }
                className={clsx(
                  ingredientOption.isRemoved
                    ? "bg-gray-600 text-black cursor-default"
                    : ingredientOption.isLeftHalf
                      ? "ring-2 ring-black ring-inset bg-orange-700 hover:bg-orange-800 cursor-pointer"
                      : "bg-orange-600 hover:bg-orange-700 cursor-pointer",
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
                    isWholeItem: true,
                  })
                }
                className={clsx(
                  ingredientOption.isRemoved
                    ? "bg-gray-600 text-black  cursor-default"
                    : ingredientOption.isWholeItem
                      ? "ring-2 ring-black ring-inset bg-orange-700 hover:bg-orange-800 cursor-pointer"
                      : "bg-orange-600 hover:bg-orange-700 cursor-pointer",
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
                    isWholeItem: false,
                  })
                }
                className={clsx(
                  ingredientOption.isRemoved
                    ? "bg-gray-600 text-black cursor-default"
                    : ingredientOption.isRightHalf
                      ? "ring-2 ring-black ring-inset bg-orange-700 hover:bg-orange-800 cursor-pointer"
                      : "bg-orange-600 hover:bg-orange-700 cursor-pointer",
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
                      handleIngredientOptionUpdate({
                        isRemoved: false,
                        isDoubled: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-400 border-2 border-gray-600 rounded-full transition-colors peer-checked:bg-orange-600 peer-checked:border-2 peer-checked:border-orange-700" />
                  <div className="absolute top-0.5 left-0.5 bg-white  w-5 h-5 rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5" />
                </label>
                <span className="text-xs text-white">Double</span>
              </div>
            </>
          )}
          {ingredient.canBeLight && (
            <>
              <button
                onClick={() =>
                  handleIngredientOptionUpdate({
                    isLight: true,
                    isRegular: false,
                    isRemoved: false,
                    isDoubled: false,
                  })
                }
                className={clsx(
                  ingredientOption.isRemoved
                    ? "bg-gray-600 text-black cursor-default"
                    : ingredientOption.isLight
                      ? "ring-2 ring-black ring-inset bg-orange-700 hover:bg-orange-800 cursor-pointer"
                      : "bg-orange-600 hover:bg-orange-700 cursor-pointer",
                  "m-w-20 w-20 flex flex-col items-center text-white rounded-lg p-1"
                )}
              >
                <SignalLow /> <span className="text-xs">Light</span>
              </button>
              <button
                onClick={() =>
                  handleIngredientOptionUpdate({
                    isLight: false,
                    isRegular: true,
                    isRemoved: false,
                    isDoubled: false,
                  })
                }
                className={clsx(
                  ingredientOption.isRemoved
                    ? "bg-gray-600 text-black cursor-default"
                    : ingredientOption.isRegular
                      ? "ring-2 ring-black ring-inset bg-orange-700 hover:bg-orange-800 cursor-pointer"
                      : "bg-orange-600 hover:bg-orange-700 cursor-pointer",
                  "m-w-20 w-20 flex flex-col items-center text-white rounded-lg p-1"
                )}
              >
                <SignalMedium /> <span className="text-xs">Regular</span>
              </button>
              <button
                onClick={() =>
                  handleIngredientOptionUpdate({
                    isLight: false,
                    isRegular: false,
                    isRemoved: false,
                    isDoubled: true,
                  })
                }
                className={clsx(
                  ingredientOption.isRemoved
                    ? "bg-gray-600 text-black cursor-default"
                    : ingredientOption.isDoubled
                      ? "ring-2 ring-black ring-inset bg-orange-700 hover:bg-orange-800 cursor-pointer"
                      : "bg-orange-600 hover:bg-orange-700 cursor-pointer",
                  "m-w-20 w-20 flex flex-col items-center text-white rounded-lg p-1"
                )}
              >
                <SignalHigh /> <span className="text-xs">Double</span>
              </button>
            </>
          )}
          {canBeRemoved && (
            <div className="flex flex-col items-center">
              <label
                className={clsx(
                  !canBeRemoved ? "cursor-default" : "cursor-pointer",
                  "relative inline-flex items-center"
                )}
              >
                <input
                  type="checkbox"
                  checked={ingredientOption.isRemoved}
                  disabled={!canBeRemoved}
                  onChange={(e) => {
                    if (e.target.checked) {
                      handleIngredientOptionUpdate({
                        isWholeItem: false,
                        isLeftHalf: false,
                        isRightHalf: false,
                        isLight: false,
                        isRegular: false,
                        isRemoved: e.target.checked,
                        isDoubled: false,
                      });
                    } else {
                      handleIngredientOptionUpdate({ ...defaultIngedientOption });
                    }
                  }}
                  className="sr-only peer"
                />
                <div
                  className={clsx(
                    !canBeRemoved ? "bg-gray-600 border-black" : "bg-gray-400 border-gray-600",
                    "w-11 h-6 rounded-full transition-colors border-2",
                    "peer-checked:bg-orange-600 peer-checked: peer-checked:border-orange-700"
                  )}
                />
                <div
                  className={clsx(
                    !canBeRemoved ? "bg-black" : "bg-white",
                    "absolute top-0.5 left-0.5 w-5 h-5 rounded-full shadow transition-transform duration-300",
                    "peer-checked:translate-x-5"
                  )}
                />
              </label>
              <span
                className={clsx(
                  !canBeRemoved ? "text-black line-through" : "text-white",
                  "text-xs"
                )}
              >
                Remove
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
