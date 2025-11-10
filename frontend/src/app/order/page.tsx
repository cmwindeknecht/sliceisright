"use client";

import { useMenu } from "@/components/context/Menu";
import OrderItem from "@/components/OrderItem";
import { sortOrderItemsByCategory } from "@/misc/helper";

export default function OrderPage() {
  const { currentOrder } = useMenu();

  const getOrderTotal = () => {
    return currentOrder.reduce((memo, orderItem) => {
      return memo + orderItem.price;
    }, 0);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Current Order</h1>
      <div className="flex flex-col gap-3 items-center">
        {sortOrderItemsByCategory(currentOrder).map((orderItem) => (
          <OrderItem key={orderItem.id} orderItem={orderItem} />
        ))}
      </div>
      <div className="flex w-full border-2 border-black my-2" />
      <div className="flex flex-row items-center justify-end w-full p-4 gap-4">
        <button
          type="button"
          className="p-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Clear Cart
        </button>
        <button
          type="button"
          className="p-2 bg-red-600 text-white py-2 rounded hover:bg-red-700 disabled:opacity-50"
        >
          Checkout
        </button>
        <div>
          <span className="font-bold">Total:</span>
          <span>{getOrderTotal()}</span>
        </div>
      </div>
    </div>
  );
}
