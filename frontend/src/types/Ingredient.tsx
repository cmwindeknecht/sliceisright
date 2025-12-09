export interface Ingredient {
  id: number | null;
  name: string;
  imageUrl: string;
  sizes: IngredientSize[];
  canBeRemoved: boolean;
  canBeDoubled: boolean;
  canBeHalved: boolean;
  canBeLight: boolean;
  category: "MEAT" | "VEGETABLE" | "FRUIT" | "OTHER";
  menuItemCategory: "PIZZAS" | "SUBS" | "APPETIZERS" | "DESSERTS" | "BEVERAGES" | "DEALS";
}

export interface IngredientSize {
  size: "NONE" | "S" | "M" | "L" | "XL";
  price: number;
}

export interface IngredientOption {
  name: string;
  ingredientId: number;
  basePrice: number;
  isRemoved: boolean;
  isLight: boolean;
  isRegular: boolean;
  isDoubled: boolean;
  isLeftHalf: boolean;
  isRightHalf: boolean;
  isWholeItem: boolean;
  isIncluded: boolean;
}
