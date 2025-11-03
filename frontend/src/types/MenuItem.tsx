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
  category: "PIZZA" | "ITEMS" | "DESSERTS" | "BEVERAGES" | "DEALS";
}

export interface MenuItemSize {
  size: "NONE" | "S" | "M" | "L" | "XL";
  price: number;
}

export interface OrderItem extends MenuItem {
  orderItemId: string | null;
  modifiedIngredients: Ingredient[];
  chosenSize: MenuItem;
}
