"use client";

import { useAuth } from "@/components/context/Auth";
import { useMenu } from "@/components/context/Menu";

export default function OrderPage() {
  const { currentOrder } = useMenu();

  return (
    <div>
      <h1 className="text-3xl font-bold">Current Order</h1>
    </div>
  );
}
