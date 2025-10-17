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
  category: "Signature Pizza" | "Specialty Item" | "Dessert" | "Drink";
}

export interface MenuItemSize {
  size: "None" | "S" | "M" | "L" | "XL";
  price: number;
}

export interface OrderItem extends MenuItem {
  orderItemId: string | null;
  modifiedIngredients: Ingredient[];
  chosenSize: MenuItem
}