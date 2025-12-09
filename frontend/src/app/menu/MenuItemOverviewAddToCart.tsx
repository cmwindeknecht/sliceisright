"use client";

import { useEffect, useState } from "react";
import { MenuItemSize, MenuItem as MenuItemType, OrderItem } from "@/types/MenuItem";
import clsx from "clsx";
import { useMenu } from "../../components/context/Menu";
import PlusMinus from "../../components/PlusMinus";
import { createNewOrderItem } from "@/misc/helper";

export interface MenuItemOverviewAddToCartProps {
  menuItem: MenuItemType;
  selectedSize: MenuItemSize | null;
}

export default function MenuItemOverviewAddToCart({
  menuItem,
  selectedSize,
}: MenuItemOverviewAddToCartProps) {
  const { addOrderItem, updateOrderItem, deleteOrderItem, currentOrder } = useMenu();
  const [currentOrderItem, setCurrentOrderItem] = useState<OrderItem | null>(null);

  useEffect(() => {
    const foundOrderItem = currentOrder.find(
      (orderItem) =>
        orderItem.id === menuItem.id && orderItem.chosenSize.size === selectedSize?.size
    );
    setCurrentOrderItem(foundOrderItem ?? createNewOrderItem(menuItem, selectedSize ?? undefined));
  }, [currentOrder, selectedSize]);

  const increaseOrderItemQuantity = () => {
    if (currentOrderItem == null) {
      throw new Error("currentOrderItem is not set!");
    }

    const orderItem = { ...currentOrderItem };
    orderItem.quantity++;
    orderItem.quantity == 1 ? addOrderItem(orderItem) : updateOrderItem(orderItem);
    setCurrentOrderItem(orderItem);
  };

  const decreaseOrderItemQuantity = () => {
    if (currentOrderItem == null) {
      throw new Error("Tried updating order item when it was never set!");
    }

    const orderItem = { ...currentOrderItem };
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
