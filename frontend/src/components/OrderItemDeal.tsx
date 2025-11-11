import { OrderItem as OrderItemType } from "@/types/MenuItem";
import OverlayImageWithFadeIn from "./OverlayImageWithFadeIn";
import clsx from "clsx";
import OrderItemPizza from "./OrderItemPizza";

export interface OrderItemProps {
  orderItem: OrderItemType;
}

export default function OrderItemComplex({ orderItem }: OrderItemProps) {
  const getOrderItemSubComponent = () => {
    if (orderItem.category == "PIZZAS") {
      return <OrderItemPizza orderItem={orderItem} />;
    }

    return <div>Test</div>;
  };

  return (
    <div className="flex flex-col m-h-20 w-[95vw]">
      <div className={clsx("flex flex-row")}>
        <OverlayImageWithFadeIn
          itemName={orderItem.name}
          wrapperClass="w-[10vw] relative bg-gray-300 cursor-pointer"
        />

        <div className="flex flex-col w-full bg-red-600">
          <div className="flex flex-row justify-between font-bold bg-orange-600">
            <div>
              {orderItem.name}{" "}
              {orderItem.chosenSize.size != "NONE" && <span>({orderItem.chosenSize.size})</span>}
            </div>
            <div>${orderItem.price.toFixed(2)}</div>
          </div>

          {getOrderItemSubComponent()}
        </div>
      </div>
    </div>
  );
}
