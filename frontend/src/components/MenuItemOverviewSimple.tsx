"use client";

import { useEffect, useState } from "react";
import { MenuItem as MenuItemType, OrderItem } from "@/types/MenuItem";
import clsx from "clsx";
import { useMenu } from "./context/Menu";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import PlusMinus from "./PlusMinus";

export interface MenuItemOverviewSimpleProps {
  menuItem: MenuItemType;
}

// TODO this only works with non customizable menu items.  So rethink these components.
//    Basically I need to either have a single component that handles sizes/customizations/etc
//    OR I need multiple components - customizable, sized, customizable & sized, or simple (like this one)
export default function MenuItemOverviewSimple({ menuItem }: MenuItemOverviewSimpleProps) {
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
    <div
      className={clsx(
        "h-60 flex flex-col items-center justify-center rounded outline-4 outline-black"
      )}
    >
      <div className="h-full w-full flex flex-col items-center">
        <OverlayImageWithFadeIn
          imageUrl={menuItem.imageUrl}
          itemName={menuItem.name}
          wrapperClass="flex-shrink-0 cursor-pointer h-1/2 w-full"
        />
        <div className="h-1/8 w-full bg-orange-600 p-1 font-bold">{menuItem.name}</div>
        <div className="h-1/4 w-full bg-orange-400 p-1 text-sm">{menuItem.description}</div>
        <div className="h-1/2 w-full bg-orange-600 flex flex-col items-center justify-between gap-2">
          <div
            className={clsx(
              "text-black px-1 rounded flex flex-row items-center justify-between gap-2"
            )}
          >
            ${menuItem.sizes[0].price.toFixed(2)}
          </div>
          <div className={clsx("flex flex-row w-full justify-center items-center gap-2")}>
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
        </div>
      </div>
    </div>
  );
}
