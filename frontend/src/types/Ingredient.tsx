import { MenuItemSize } from "./MenuItem";

export interface Ingredient {
  id: number | null;
  name: string;
  availableSizes: MenuItemSize[];
  canBeRemoved: boolean;
  canBeDoubled: boolean;
}

export interface OrderIngredient extends Ingredient {
  isRemoved: boolean;
  isDoubled: boolean;
}

