import { Ingredient } from "@/types/Ingredient";
import { MenuItem } from "@headlessui/react";

export interface IngredientDropdownSelectionProps {
  ingredient: Ingredient;
  setSelectedIngredient: (ingredient: Ingredient | null) => void;
}

export default function IngredientDropdownSelection({
  ingredient,
  setSelectedIngredient,
}: IngredientDropdownSelectionProps) {
  return (
    <MenuItem key={ingredient.name + ingredient.name}>
      <button
        onClick={() => setSelectedIngredient(ingredient)}
        className="block px-4 py-2 text-sm text-black data-focus:bg-orange-700 data-focus:text-white data-focus:outline-hidden"
      >
        {ingredient.name}
      </button>
    </MenuItem>
  );
}
