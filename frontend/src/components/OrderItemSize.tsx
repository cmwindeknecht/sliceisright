import { OrderItem as OrderItemType } from "@/types/MenuItem";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import { IngredientOption } from "./MenuItemIngredient";
import { useEffect, useState } from "react";
import { CircleArrowDown, CircleArrowLeft, CircleArrowRight, CircleDot } from "lucide-react";
import {
  getIngredientOptionPreface,
  getPriceOfIngredientOption,
  showPriceOfIngredient,
} from "@/misc/helper";
import clsx from "clsx";

export interface OrderItemProps {
  orderItem: OrderItemType;
}

export default function OrderItemSize({ orderItem }: OrderItemProps) {
  const [mappedIngredientOptions, setMappedIngredientOptions] = useState<
    Map<String, IngredientOption[]>
  >(new Map());

  useEffect(() => {
    if (!orderItem.isCustomizable) {
      return;
    }

    if (orderItem.category == "PIZZAS") {
      const mapped = orderItem.ingredientOptions.reduce((memo, ingredientOption) => {
        if (ingredientOption.isLeftHalf) {
          if (!memo.has("left")) {
            memo.set("left", []);
          }
          memo.get("left")!.push(ingredientOption);
        } else if (ingredientOption.isRightHalf) {
          if (!memo.has("right")) {
            memo.set("right", []);
          }
          memo.get("right")!.push(ingredientOption);
        } else {
          if (!memo.has("whole")) {
            memo.set("whole", []);
          }
          memo.get("whole")!.push(ingredientOption);
        }

        return memo;
      }, new Map<string, IngredientOption[]>());

      setMappedIngredientOptions(mapped);
    }
  }, [orderItem]);

  return (
    <div className="flex flex-col">
      <div
        className={clsx(
          orderItem.isCustomizable ? "w-[95vw]" : "w-[30vw]",
          "flex flex-row items-stretch"
        )}
      >
        <OverlayImageWithFadeIn
          itemName={orderItem.name}
          wrapperClass="w-[15vw] relative bg-gray-300 cursor-pointer"
        />

        <div className="flex flex-col w-full m-h-30 bg-red-600">
          <div className="font-bold bg-orange-600">
            {orderItem.name} - ${orderItem.price.toFixed(2)}
          </div>
          {orderItem.category == "PIZZAS" && (
            <div className="flex flex-row w-full h-full border-black ">
              <div className="flex flex-col w-1/3 border-r-2 border-black">
                <div className="flex flex-row border-b-2 border-black justify-center">
                  <CircleArrowLeft /> Left
                </div>
                <div className="flex flex-col h-full items-center text-white">
                  {mappedIngredientOptions.has("left") &&
                    mappedIngredientOptions.get("left")!.map((ingredientOption) => (
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
                  {mappedIngredientOptions.has("whole") &&
                    mappedIngredientOptions.get("whole")!.map((ingredientOption) => (
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
                  {mappedIngredientOptions.has("right") &&
                    mappedIngredientOptions.get("right")!.map((ingredientOption) => (
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
