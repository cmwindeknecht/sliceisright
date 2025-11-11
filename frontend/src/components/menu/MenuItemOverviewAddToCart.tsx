"use client";

import { useEffect, useState } from "react";
import { MenuItem as MenuItemType, OrderItem } from "@/types/MenuItem";
import clsx from "clsx";
import { useMenu } from "../context/Menu";
import PlusMinus from "../PlusMinus";

export interface MenuItemOverviewSimpleProps {
  menuItem: MenuItemType;
}

export default function MenuItemOverviewAddToCart({ menuItem }: MenuItemOverviewSimpleProps) {
  const { addOrderItem, updateOrderItem, deleteOrderItem, currentOrder } = useMenu();
  const [currentOrderItem, setCurrentOrderItem] = useState<OrderItem | null>(null);

  useEffect(() => {
    for (const orderItem of currentOrder) {
      if (orderItem.id === menuItem.id) {
        setCurrentOrderItem(orderItem);
        break;
      }
    }
  }, [currentOrder]);

  const increaseOrderItemQuantity = () => {
    let orderItem: OrderItem;

    if (currentOrderItem == null) {
      orderItem = {
        ...menuItem,
        orderItemId: Math.random(),
        ingredientOptions: [],
        chosenSize: menuItem.sizes[0],
        quantity: 1,
        notes: "",
        price: menuItem.sizes[0].price,
      };
      addOrderItem(orderItem);
    } else {
      orderItem = currentOrderItem;
      orderItem.quantity++;
      updateOrderItem(orderItem);
    }

    setCurrentOrderItem(orderItem);
  };

  const decreaseOrderItemQuantity = () => {
    if (currentOrderItem == null) {
      throw new Error("Tried updating order item when it was never set!");
    }

    const orderItem = currentOrderItem;
    orderItem.quantity--;

    if (orderItem.quantity <= 0) {
      setCurrentOrderItem(null);
      deleteOrderItem(orderItem);
    } else {
      setCurrentOrderItem(orderItem);
      updateOrderItem(orderItem);
    }
  };

  return (
    <div className={clsx("flex flex-row w-full justify-center items-center gap-2 my-2")}>
      {currentOrderItem == null || currentOrderItem.quantity <= 0 ? (
        <button
          onClick={() => increaseOrderItemQuantity()}
          className={clsx(
            "bg-red-600 hover:bg-orange-700 text-white",
            "flex items-center justify-center w-1/2 h-6 outline-1 outline-black rounded disabled:opacity-50 px-1"
          )}
        >
          Add to Cart
        </button>
      ) : (
        <PlusMinus
          plusFunction={increaseOrderItemQuantity}
          minusFunction={decreaseOrderItemQuantity}
          orderItem={currentOrderItem}
        />
      )}
    </div>
  );
}
