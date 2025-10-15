import { Ingredient } from "./Ingredient";

export interface MenuItem {
  id: number;
  price: number;
  name: string;
  description: string;
  imageUrl: string;
  available: boolean;
  defaultIngredients: Ingredient[];
  ingredients: Ingredient[];
}

export interface OrderItem extends MenuItem {
  orderItemId: string;
}