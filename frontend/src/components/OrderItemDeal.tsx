import { OrderItem as OrderItemType } from "@/types/MenuItem";

export interface OrderItemProps {
  orderItem: OrderItemType;
}

export default function OrderItemDeal({ orderItem }: OrderItemProps) {
  return <span />;
}
