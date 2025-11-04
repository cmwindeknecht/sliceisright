"use client";

import { useEffect, useState } from "react";
import { MenuItemSize, MenuItem as MenuItemType, OrderItem } from "@/types/MenuItem";
import clsx from "clsx";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import { useMenu } from "./context/Menu";
import { sortMenuSize } from "@/misc/helper";
import PlusMinus from "./PlusMinus";

export interface MenuItemOverviewSizeProps {
  menuItem: MenuItemType;
}

export default function MenuItemOverviewSize({ menuItem }: MenuItemOverviewSizeProps) {
  const { addOrderItem, updateOrderItem, deleteOrderItem, currentOrder } = useMenu();

  const [currentOrderItems, setCurrentOrderItems] = useState<Map<string, OrderItem>>(new Map());
  const [selectedSize, setSelectedSize] = useState<MenuItemSize | null>(null);

  useEffect(() => {
    const size: MenuItemSize | undefined = sortMenuSize(menuItem.sizes).shift();

    if (!size) {
      throw new Error("No sizes are avaialble in menu item passed to MenuItemOverviewSize");
    }

    setSelectedSize(size);
  }, []);

  useEffect(() => {
    const currentOrderItemsUpdated = new Map(currentOrderItems);
    for (const orderItem of currentOrder) {
      if (orderItem.name === menuItem.name) {
        currentOrderItemsUpdated.set(orderItem.chosenSize.size, orderItem);
      }
    }
    setCurrentOrderItems(currentOrderItemsUpdated);
  }, [currentOrder]);

  const increaseOrderItemQuantity = () => {
    if (selectedSize == null) {
      return currentOrderItems;
    }

    const currentOrderItemsUpdated = new Map(currentOrderItems);

    let orderItemToUpdate: OrderItem | undefined = currentOrderItemsUpdated.get(selectedSize.size);
    if (!orderItemToUpdate) {
      orderItemToUpdate = {
        ...menuItem,
        orderItemId: Math.random(),
        modifiedIngredients: [],
        chosenSize: menuItem.sizes[0],
        quantity: 1,
      };
      addOrderItem(orderItemToUpdate);
    } else {
      orderItemToUpdate.quantity++;
      updateOrderItem(orderItemToUpdate);
    }

    currentOrderItemsUpdated.set(selectedSize.size, orderItemToUpdate);

    setCurrentOrderItems(currentOrderItemsUpdated);
  };

  const decreaseOrderItemQuantity = () => {
    if (selectedSize == null) {
      return currentOrderItems;
    }

    const currentOrderItemsUpdated = new Map(currentOrderItems);

    let orderItemToUpdate: OrderItem | undefined = currentOrderItemsUpdated.get(selectedSize.size);
    if (!orderItemToUpdate) {
      return currentOrderItems;
    }

    orderItemToUpdate.quantity--;

    if (orderItemToUpdate.quantity <= 0) {
      deleteOrderItem(orderItemToUpdate);
      currentOrderItemsUpdated.delete(selectedSize.size);
    } else {
      updateOrderItem(orderItemToUpdate);
      currentOrderItemsUpdated.set(selectedSize.size, orderItemToUpdate);
    }

    setCurrentOrderItems(currentOrderItemsUpdated);
  };

  const getCurrentOrderItem = () => {
    if (selectedSize == null) {
      throw new Error("No selected size to get current order item!");
    }

    const currentOrderItem: OrderItem | undefined = currentOrderItems.get(selectedSize.size);
    if (!currentOrderItem) {
      throw new Error("Current order items does not have the selected size!");
    }

    return currentOrderItem;
  };

  return (
    <div
      className={clsx(
        "h-100 flex flex-col items-center justify-center rounded outline-4 outline-black"
      )}
    >
      <OverlayImageWithFadeIn
        menuItemName={menuItem.name}
        wrapperClass="flex-shrink-0 cursor-pointer h-1/2 w-full"
      />
      <div className="h-1/2 w-full flex flex-col items-center">
        <div className="h-1/8 w-full bg-orange-600 p-1 font-bold">{menuItem.name}</div>
        <div className="h-9/16 w-full bg-orange-400 p-1 text-sm">{menuItem.description || " "}</div>
        <div className="h-5/16 w-full bg-orange-600 flex flex-col items-end gap-2">
          <div className="flex flex-col w-full justify-between items-center h-full">
            <div className="flex flex-row w-full justify-center items-center gap-2">
              {sortMenuSize(menuItem.sizes).map((menuItemSize) => (
                <button
                  key={menuItem.id + menuItemSize.size}
                  onClick={() => setSelectedSize(menuItemSize)}
                  className={clsx(
                    selectedSize && selectedSize.size == menuItemSize.size
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-orange-600 hover:bg-orange-700",
                    "outline-1 outline-black text-white px-1 rounded"
                  )}
                >
                  {menuItemSize.size === "NONE"
                    ? `$${menuItemSize.price.toFixed(2)}`
                    : `${menuItemSize.size} - $${menuItemSize.price.toFixed(2)}`}
                </button>
              ))}
            </div>
            <div className={clsx("flex flex-row w-full justify-center items-center gap-2")}>
              {!selectedSize ||
              (selectedSize && (currentOrderItems.get(selectedSize.size)?.quantity || 0) <= 0) ? (
                <button
                  onClick={() => increaseOrderItemQuantity()}
                  disabled={selectedSize == null}
                  title={!selectedSize ? "Select a size first" : ""}
                  className={clsx(
                    selectedSize
                      ? "bg-red-600 hover:bg-orange-700 text-white"
                      : "bg-gray-200 text-black",
                    "flex items-center justify-center w-1/3 h-6 outline-1 outline-black rounded disabled:opacity-50 px-1"
                  )}
                >
                  Add to Cart
                </button>
              ) : (
                <PlusMinus
                  plusFunction={increaseOrderItemQuantity}
                  minusFunction={decreaseOrderItemQuantity}
                  orderItem={getCurrentOrderItem()}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
