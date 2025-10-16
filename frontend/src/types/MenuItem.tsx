import { Ingredient } from "./Ingredient";

export interface MenuItem {
  id: number | null;
  name: string;
  description: string;
  imageUrl: string;
  isAvailable: boolean;
  isCustomizable: boolean;
  defaultIngredients: Ingredient[];
  availableSizes: MenuItemSize[];
}

export interface MenuItemSize {
  size: "None" | "S" | "M" | "L" | "XL";
  price: number;
}


export interface OrderItem extends MenuItem {
  orderItemId: string;
  modifiedIngredients: Ingredient[];
  chosenSize: MenuItem
}