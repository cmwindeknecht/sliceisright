import { OrderItem as OrderItemType } from "@/types/MenuItem";
import OverlayImageWithFadeIn from "../../components/OverlayImageWithFadeIn";
import { IngredientOption } from "../menu/MenuItemIngredient";
import { useEffect, useState } from "react";
import { CircleArrowDown, CircleArrowLeft, CircleArrowRight, CircleDot } from "lucide-react";
import {
  getIngredientOptionPreface,
  getPizzaPortion,
  getPriceOfIngredientOption,
  PIZZA_LEFT,
  PIZZA_RIGHT,
  showPriceOfIngredient,
} from "@/misc/helper";
import clsx from "clsx";

export interface PizzaPortionProps {
  ingredientOptions: IngredientOption[];
  portion: "LEFT" | "RIGHT" | "WHOLE";
}

export default function OrderItemPizzaPortion({ ingredientOptions, portion }: PizzaPortionProps) {
  const getHeader = () => {
    if (portion == PIZZA_LEFT) {
      return (
        <div className="flex flex-row">
          <CircleArrowLeft /> Left
        </div>
      );
    }
    if (portion == PIZZA_RIGHT) {
      return (
        <div className="flex flex-row">
          <CircleArrowRight /> Right
        </div>
      );
    }

    return (
      <div className="flex flex-row">
        <CircleDot /> Whole
      </div>
    );
  };

  return (
    <div className="flex flex-row">
      <div className="flex flex-row border-b-2 border-black justify-center"></div>
      {getHeader()}
      <div className="flex flex-row h-full items-center text-white text-sm pl-1">
        {ingredientOptions.map((ingredientOption, index) => (
          <span key={ingredientOption.ingredientId}>
            ({getIngredientOptionPreface(ingredientOption)}) {ingredientOption.name}
            {showPriceOfIngredient(ingredientOption) && (
              <span>- ${getPriceOfIngredientOption(ingredientOption)}</span>
            )}
            {index < ingredientOptions.length - 1 && <span className="font-semibold">,&nbsp;</span>}
          </span>
        ))}
      </div>
    </div>
  );
}
