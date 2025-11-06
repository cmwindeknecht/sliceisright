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
}

export interface IngredientSize {
  size: "NONE" | "S" | "M" | "L" | "XL";
  price: number;
}

export interface OrderIngredient extends Ingredient {
  isRemoved: boolean;
  isDoubled: boolean;
}
