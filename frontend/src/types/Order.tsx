import { User } from "next-auth";
import { IngredientOption } from "./Ingredient";
import { MenuItem, MenuItemSize } from "./MenuItem";

export interface OrderItem extends MenuItem {
  orderItemId: number | null;
  ingredientOptions: IngredientOption[];
  chosenSize: MenuItemSize;
  quantity: number;
  notes: string | null;
  price: number;
}

export interface Order {
  user: User;
  orderId: number | null;
  orderItems: OrderItem[];
  price: number;
  requestedPickupTime: string;
}

export enum OrderIntervalCategory {
  PIZZAS,
  SUBS,
  APPETIZERS,
  DESSERTS,
  BEVERAGES,
  MAX_PER_INTERVAL,
}
