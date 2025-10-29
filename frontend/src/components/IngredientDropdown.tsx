import { Ingredient } from "@/types/Ingredient";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import IngredientDropdownSelection from "./IngredientDropdownSelection";

export interface IngredientDropdownProps {
  ingredients: Ingredient[];
  setSelectedIngredient: (ingredient: Ingredient | null) => void;
}

export default function IngredientDropdown({
  ingredients,
  setSelectedIngredient,
}: IngredientDropdownProps) {
  const [categorizedIngredients, setCategorizedIngredient] = useState<Partial<
    Record<Ingredient["category"], Ingredient[]>
  > | null>(null);

  useEffect(() => {
    setCategorizedIngredient(getByCategory(ingredients));
  }, []);

  function getByCategory(ingredientsToCategorize: Ingredient[]) {
    return ingredientsToCategorize.reduce(
      (memo, ingredient) => {
        if (memo[ingredient.category]) {
          memo[ingredient.category].push(ingredient);
        } else {
          memo[ingredient.category] = [ingredient];
        }
        return memo;
      },
      {} as Record<Ingredient["category"], Ingredient[]>
    );
  }

  return (
    <Menu as="div" className="relative inline-block">
      <MenuButton className="inline-flex w-40 h-10 justify-center gap-x-1.5 rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-black inset-ring-1 inset-ring-white/5 hover:bg-red-700">
        Toppings
        <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-shadow-black" />
      </MenuButton>

      <MenuItems
        transition
        className="absolute w-40 origin-top-left divide-y divide-black rounded-md bg-orange-600 outline-1 -outline-offset-1 outline-white/10 transition data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        {categorizedIngredients?.MEAT && (
          <div className="py-1">
            {categorizedIngredients.MEAT.map((ingredient) => (
              <IngredientDropdownSelection
                key={ingredient.id}
                ingredient={ingredient}
                setSelectedIngredient={setSelectedIngredient}
              />
            ))}
          </div>
        )}
        {categorizedIngredients?.VEGETABLE && (
          <div className="py-1">
            {categorizedIngredients.VEGETABLE.map((ingredient) => (
              <IngredientDropdownSelection
                key={ingredient.id}
                ingredient={ingredient}
                setSelectedIngredient={setSelectedIngredient}
              />
            ))}
          </div>
        )}
        {categorizedIngredients?.FRUIT && (
          <div className="py-1">
            {categorizedIngredients.FRUIT.map((ingredient) => (
              <IngredientDropdownSelection
                key={ingredient.id}
                ingredient={ingredient}
                setSelectedIngredient={setSelectedIngredient}
              />
            ))}
          </div>
        )}
        {categorizedIngredients?.OTHER && (
          <div className="py-1">
            {categorizedIngredients.OTHER.map((ingredient) => (
              <IngredientDropdownSelection
                key={ingredient.id}
                ingredient={ingredient}
                setSelectedIngredient={setSelectedIngredient}
              />
            ))}
          </div>
        )}
      </MenuItems>
    </Menu>
  );
}
