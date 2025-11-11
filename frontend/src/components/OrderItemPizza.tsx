import { OrderItem as OrderItemType } from "@/types/MenuItem";
import { IngredientOption } from "./MenuItemIngredient";
import { useEffect, useState } from "react";
import { getPizzaPortion, PIZZA_LEFT, PIZZA_RIGHT, PIZZA_WHOLE } from "@/misc/helper";
import OrderItemPizzaPortion from "./OrderItemPizzaPortion";

export interface OrderItemProps {
  orderItem: OrderItemType;
}

export default function OrderItemPizza({ orderItem }: OrderItemProps) {
  const [pizzaPortions, setPizzaPortions] = useState<Map<String, IngredientOption[]>>(new Map());

  useEffect(() => {
    orderItem.ingredientOptions.forEach((ingredientOption) => {
      console.log(
        `${orderItem.name} - ${ingredientOption.name} - ${ingredientOption.ingredientId}`
      );
    });
  }, []);

  useEffect(() => {
    setPizzaPortions(getPizzaPortion(orderItem));
  }, [orderItem]);

  return (
    <div className="flex flex-col w-full border-y border-black">
      <div className="flex flex-col w-full h-full ">
        {pizzaPortions.has(PIZZA_LEFT) && (
          <div className="flex flex-col flex-wrap  min-h-10">
            <OrderItemPizzaPortion
              ingredientOptions={pizzaPortions.get(PIZZA_LEFT) || []}
              portion={PIZZA_LEFT}
            />
          </div>
        )}
        {pizzaPortions.has(PIZZA_WHOLE) && (
          <div className="flex flex-col flex-wrap">
            <OrderItemPizzaPortion
              ingredientOptions={pizzaPortions.get(PIZZA_WHOLE) || []}
              portion={PIZZA_WHOLE}
            />
          </div>
        )}
        {pizzaPortions.has(PIZZA_RIGHT) && (
          <div className="flex flex-col flex-wrap">
            <OrderItemPizzaPortion
              ingredientOptions={pizzaPortions.get(PIZZA_RIGHT) || []}
              portion={PIZZA_RIGHT}
            />
          </div>
        )}
      </div>
    </div>
  );
}
