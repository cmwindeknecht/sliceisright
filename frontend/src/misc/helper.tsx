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

  // Convert to array of [key, value] pairs
  const sortedEntries = [...ingredientMap.entries()].sort(
    ([keyA], [keyB]) => order.indexOf(keyA) - order.indexOf(keyB)
  );

  // Return a new Map with the sorted order
  return new Map(sortedEntries);
};
