import { IngredientOption } from "@/components/MenuItemIngredient";
import { Ingredient } from "./Ingredient";

export interface MenuItem {
  id: number | null;
  name: string;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  isCustomizable: boolean;
  ingredients: Ingredient[];
  sizes: MenuItemSize[];
  category: "PIZZAS" | "SUBS" | "APPETIZERS" | "DESSERTS" | "BEVERAGES" | "DEALS";
}

export interface MenuItemSize {
  size: "NONE" | "S" | "M" | "L" | "XL";
  price: number;
}

export interface OrderItem extends MenuItem {
  orderItemId: number | null;
  ingredientOptions: IngredientOption[];
  chosenSize: MenuItemSize;
  quantity: number;
  notes: string | null;
  price: number;
}

export interface Order {
  orderId: number | null;
  orderItems: OrderItem[];
  price: number;
}
