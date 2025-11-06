import { IngredientOption } from "@/components/MenuItemIngredient";
import { Ingredient, IngredientSize } from "@/types/Ingredient";
import { MenuItem, MenuItemSize } from "@/types/MenuItem";

export const sortMenuSize = (sizes: MenuItemSize[]) => {
  const order = ["None", "S", "M", "L", "XL"];
  return [...sizes].sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size));
};

export const sortIngredientSize = (sizes: IngredientSize[]) => {
  const order = ["None", "S", "M", "L", "XL"];
  return [...sizes].sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size));
};

export const sortMenuItemsByCategory = (menuItems: MenuItem[]) => {
  const order = ["PIZZA", "ITEMS", "BEVERAGES", "DESSERTS", "DEALS"];
  return [...menuItems].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
};

export const sortIngredientsByCategory = (
  ingredientMap: Map<string, Ingredient[]>
): Map<string, Ingredient[]> => {
  const order = ["INCLUDED", "MEAT", "VEGETABLE", "FRUIT", "OTHER"];

  const sortedEntries = [...ingredientMap.entries()].sort(
    ([keyA], [keyB]) => order.indexOf(keyA) - order.indexOf(keyB)
  );

  return new Map(sortedEntries);
};

export const getPriceOfIngredientOption = (ingredientOption: IngredientOption) => {
  if (ingredientOption.isIncluded) {
    if (
      ingredientOption.isDoubled &&
      (ingredientOption.isWholeItem || // its either for a whole item / pizza
        (!ingredientOption.isWholeItem && // or its not something that has a left/right/whole option (cheese, sauce)
          !ingredientOption.isLeftHalf &&
          !ingredientOption.isRightHalf))
    ) {
      return ingredientOption.basePrice;
    }
  }

  if (ingredientOption.isWholeItem) {
    return ingredientOption.basePrice * (ingredientOption.isDoubled ? 2 : 1);
  } else if (ingredientOption.isLeftHalf || ingredientOption.isRightHalf) {
    return ingredientOption.basePrice * (ingredientOption.isDoubled ? 1 : 0.5);
  } else if (!ingredientOption.isRemoved) {
    return ingredientOption.basePrice * (ingredientOption.isDoubled ? 2 : 1);
  }

  return 0;
};

export const showPriceOfIngredient = (ingredientOption: IngredientOption) => {
  if (ingredientOption.isIncluded) {
    return (
      ingredientOption.isDoubled &&
      (ingredientOption.isWholeItem || // its either for a whole item / pizza
        (!ingredientOption.isWholeItem && // or its not something that has a left/right/whole option (cheese, sauce)
          !ingredientOption.isLeftHalf &&
          !ingredientOption.isRightHalf))
    );
  }

  return true;
};
