export interface Ingredient {
  id: number | null;
  name: string;
  sizes: IngredientSize[];
  canBeRemoved: boolean;
  canBeDoubled: boolean;
  category: "MEAT" | "VEGETABLE" | "FRUIT" | "OTHER";
}

export interface IngredientSize {
  size: "None" | "S" | "M" | "L" | "XL";
  price: number;
}

export interface OrderIngredient extends Ingredient {
  isRemoved: boolean;
  isDoubled: boolean;
}
