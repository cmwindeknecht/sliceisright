import {
  getIngredientOptionPreface,
  getPriceOfIngredientOption,
  showPriceOfIngredient,
} from "@/misc/helper";
import { OrderItemProps } from "./OrderItem";

export default function OrderItemSub({ orderItem }: OrderItemProps) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row h-full items-center text-white text-sm pl-1">
        {orderItem.ingredientOptions.map((ingredientOption, index) => (
          <span key={ingredientOption.ingredientId}>
            ({getIngredientOptionPreface(ingredientOption)}) {ingredientOption.name}
            {showPriceOfIngredient(ingredientOption) && (
              <span>- ${getPriceOfIngredientOption(ingredientOption)}</span>
            )}
            {index < orderItem.ingredientOptions.length - 1 && (
              <span className="font-semibold">,&nbsp;</span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
