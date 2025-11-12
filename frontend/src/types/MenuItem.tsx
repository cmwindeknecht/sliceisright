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
