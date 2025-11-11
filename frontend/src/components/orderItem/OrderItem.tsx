import { OrderItem as OrderItemType } from "@/types/MenuItem";
import OverlayImageWithFadeIn from "../OverlayImageWithFadeIn";
import { CircleX, Pencil } from "lucide-react";
import clsx from "clsx";
import { useMenu } from "../context/Menu";
import OrderItemPizza from "./OrderItemPizza";
import OrderItemAppetizer from "./OrderItemAppetizer";
import PlusMinus from "../PlusMinus";
import OrderItemBeverage from "./OrderItemBeverage";
import OrderItemDessert from "./OrderItemDessert";
import OrderItemDeal from "./OrderItemDeal";
import OrderItemSub from "./OrderItemSub";

export interface OrderItemProps {
  orderItem: OrderItemType;
}

export default function OrderItemComplex({ orderItem }: OrderItemProps) {
  const { updateOrderItem, deleteOrderItem } = useMenu();

  const getOrderItemSubComponent = () => {
    if (orderItem.category == "PIZZAS") {
      return <OrderItemPizza orderItem={orderItem} />;
    }
    if (orderItem.category == "APPETIZERS") {
      return <OrderItemAppetizer orderItem={orderItem} />;
    }
    if (orderItem.category == "SUBS") {
      return <OrderItemSub orderItem={orderItem} />;
    }
    if (orderItem.category == "BEVERAGES") {
      return <OrderItemBeverage orderItem={orderItem} />;
    }
    if (orderItem.category == "DESSERTS") {
      return <OrderItemDessert orderItem={orderItem} />;
    }
    if (orderItem.category == "DEALS") {
      return <OrderItemDeal orderItem={orderItem} />;
    }

    return <div>Test</div>;
  };

  return (
    <div className="flex flex-col min-h-20 w-[95vw] border-2 border-black">
      <div className={clsx("flex flex-row")}>
        <OverlayImageWithFadeIn
          itemName={orderItem.name}
          wrapperClass="w-[10vw] relative bg-gray-300 cursor-pointer"
        />

        <div className="flex flex-col w-full bg-orange-600">
          <div className="flex flex-row justify-between font-bold bg-red-600">
            <div>
              {orderItem.name}{" "}
              {orderItem.chosenSize.size != "NONE" && <span>({orderItem.chosenSize.size})</span>}
            </div>
            <div>${orderItem.price.toFixed(2)}</div>
          </div>

          {getOrderItemSubComponent()}

          <div className="flex justify-end items-end h-full w-full gap-4 mt-1">
            {/* TODO go to customize component */}
            <button
              type="button"
              className={clsx(
                "border-1 border-black flex flex-row justify-center items-center text-sm gap-2 p-2 bg-red-600 text-white py-2 rounded disabled:opacity-50 hover:bg-red-700"
              )}
            >
              <Pencil size={16} />
              <span>Edit</span>
            </button>
            <button
              type="button"
              onClick={() => {
                if (confirm(`Are you sure you want to remove ${orderItem.name} from your order?`)) {
                  deleteOrderItem(orderItem);
                }
              }}
              className={clsx(
                "border-1 border-black flex flex-row justify-center items-center text-sm gap-2 p-2 bg-red-600 text-white py-2 rounded disabled:opacity-50 hover:bg-red-700"
              )}
            >
              <CircleX size={16} />
              <span>Remove</span>
            </button>

            <div className="flex flex-row text-white  pr-2">
              <span className="font-bold">Qty:</span>
              <PlusMinus
                plusFunction={() => {
                  orderItem.quantity++;
                  updateOrderItem(orderItem);
                }}
                minusFunction={() => {
                  const newQuantity = orderItem.quantity - 1;

                  if (newQuantity <= 0) {
                    if (
                      confirm(`Are you sure you want to remove ${orderItem.name} from your order?`)
                    ) {
                      deleteOrderItem(orderItem);
                    }
                  } else {
                    orderItem.quantity = newQuantity;
                    updateOrderItem(orderItem);
                  }
                }}
                orderItem={orderItem}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
