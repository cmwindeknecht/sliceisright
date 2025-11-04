import { OrderItem } from "@/types/MenuItem";
import { Minus, Plus } from "lucide-react";

export interface PlusMinusProps {
  plusFunction: () => void;
  minusFunction: () => void;
  orderItem: OrderItem;
}

export default function PlusMinus({ plusFunction, minusFunction, orderItem }: PlusMinusProps) {
  return (
    <div className="h-6 flex flex-row justify-between items-center w-1/2">
      <button
        onClick={() => minusFunction()}
        className="flex items-center justify-center w-6 h-full bg-red-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50"
      >
        <Minus className="w-6 h-full" />
      </button>
      <span className="text-white font-bold text-2xl">{orderItem && orderItem.quantity}</span>
      <button
        onClick={() => plusFunction()}
        className="flex items-center justify-center w-6 h-full bg-red-600 text-white rounded-full hover:bg-orange-700 disabled:opacity-50"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
}
