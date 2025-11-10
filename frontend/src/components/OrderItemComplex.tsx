import { OrderItem as OrderItemType } from "@/types/MenuItem";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import { IngredientOption } from "./MenuItemIngredient";
import { useEffect, useState } from "react";
import { CircleArrowDown, CircleArrowLeft, CircleArrowRight, CircleDot } from "lucide-react";
import {
  getIngredientOptionPreface,
  getPizzaPortion,
  getPriceOfIngredientOption,
  showPriceOfIngredient,
} from "@/misc/helper";
import clsx from "clsx";
import { useMenu } from "./context/Menu";

export interface OrderItemProps {
  orderItem: OrderItemType;
}

export default function OrderItemComplex({ orderItem }: OrderItemProps) {
  const [pizzaPortions, setPizzaPortions] = useState<Map<String, IngredientOption[]>>(new Map());

  useEffect(() => {
    if (orderItem.category == "PIZZAS" && orderItem.isCustomizable) {
      setPizzaPortions(getPizzaPortion(orderItem));
    }
  }, [orderItem]);

  return (
    <div className="flex flex-col">
      <div className={clsx("flex flex-row items-stretch w-[95vw]")}>
        <OverlayImageWithFadeIn
          itemName={orderItem.name}
          wrapperClass="w-[15vw] relative bg-gray-300 cursor-pointer"
        />

        <div className="flex flex-col w-full m-h-30 bg-red-600">
          <div className="font-bold bg-orange-600">
            {orderItem.name} {orderItem.chosenSize.size != "NONE" && orderItem.chosenSize.size} - $
            {orderItem.price.toFixed(2)}
          </div>
          {orderItem.category == "PIZZAS" && (
            <div className="flex flex-row w-full h-full border-black ">
              <div className="flex flex-col w-1/3 border-r-2 border-black">
                <div className="flex flex-row border-b-2 border-black justify-center">
                  <CircleArrowLeft /> Left
                </div>
                <div className="flex flex-col h-full items-center text-white">
                  {pizzaPortions.has("left") &&
                    pizzaPortions.get("left")!.map((ingredientOption) => (
                      <div key={ingredientOption.ingredientId}>
                        {getIngredientOptionPreface(ingredientOption)} - {ingredientOption.name}{" "}
                        {showPriceOfIngredient(ingredientOption) && (
                          <span>- ${getPriceOfIngredientOption(ingredientOption)}</span>
                        )}{" "}
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col w-1/3 border-r-2 border-black">
                <div className="flex flex-row border-b-2 border-black justify-center">
                  <CircleDot /> Whole
                </div>
                <div className="flex flex-col h-full items-center text-white">
                  {pizzaPortions.has("whole") &&
                    pizzaPortions.get("whole")!.map((ingredientOption) => (
                      <div key={ingredientOption.ingredientId}>
                        {getIngredientOptionPreface(ingredientOption)} - {ingredientOption.name}{" "}
                        {showPriceOfIngredient(ingredientOption) && (
                          <span>- ${getPriceOfIngredientOption(ingredientOption)}</span>
                        )}{" "}
                      </div>
                    ))}
                </div>
              </div>
              <div className="flex flex-col w-1/3">
                <div className="flex flex-row border-b-2 border-black justify-center">
                  <CircleArrowRight /> Right
                </div>
                <div className="flex flex-col h-full items-center text-white">
                  {pizzaPortions.has("right") &&
                    pizzaPortions.get("right")!.map((ingredientOption) => (
                      <div key={ingredientOption.ingredientId}>
                        {getIngredientOptionPreface(ingredientOption)} - {ingredientOption.name}{" "}
                        {showPriceOfIngredient(ingredientOption) && (
                          <span>- ${getPriceOfIngredientOption(ingredientOption)}</span>
                        )}
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
