"use client";

import { useMenu } from "@/components/context/Menu";
import OrderItem from "@/app/order/OrderItem";
import { sortOrderItemsByCategory } from "@/misc/helper";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function OrderPage() {
  const { currentOrder } = useMenu();
  const [orderTotal, setOrderTotal] = useState<number>(0);

  useEffect(() => {
    setOrderTotal(getOrderTotal());
  }, [currentOrder]);

  const getOrderTotal = () => {
    return currentOrder.reduce((memo, orderItem) => {
      return memo + orderItem.price * orderItem.quantity;
    }, 0);
  };

  return (
    <>
      <h1 className="text-3xl font-bold">Current Order</h1>
      {currentOrder.length == 0 ? (
        <div>Your Cart Is Empty</div>
      ) : (
        <div>
          <div className="flex flex-col gap-3 items-center">
            {sortOrderItemsByCategory(currentOrder).map((orderItem) => (
              <OrderItem key={orderItem.orderItemId} orderItem={orderItem} />
            ))}
          </div>
        </div>
      )}
      <div className="flex w-full border-2 border-black my-2" />
      <div className="flex flex-row items-center justify-end w-full p-4 gap-4">
        <button
          type="button"
          disabled={currentOrder.length === 0}
          className={clsx(
            "p-2 bg-red-600 text-white py-2 rounded disabled:opacity-50",
            currentOrder.length > 0 && "hover:bg-red-700 "
          )}
        >
          Clear Cart
        </button>
        <button
          type="button"
          disabled={currentOrder.length === 0}
          className={clsx(
            "p-2 bg-red-600 text-white py-2 rounded disabled:opacity-50",
            currentOrder.length > 0 && "hover:bg-red-700 "
          )}
        >
          Checkout
        </button>
        <div className="text-lg">
          <span className="font-bold">Total:</span>
          <span>&nbsp;${orderTotal.toFixed(2)}</span>
        </div>
      </div>
    </>
  );
}
