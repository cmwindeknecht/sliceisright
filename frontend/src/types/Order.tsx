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
  MAX_INTERVAL_POINTS = 0,
  APPETIZERS = 1,
  BEVERAGES = 2,
  DESSERTS = 3,
  PIZZAS = 4,
  SUBS = 5,
}

export enum OrderIntervalDay {
  ALL_DAYS = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6,
  SUNDAY = 7,
}
