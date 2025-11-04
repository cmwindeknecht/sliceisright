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

export const sortIngredientsByCategory = (ingredients: Ingredient[]) => {
  const order = ["MEAT", "VEGETABLE", "FRUIT", "OTHER"];
  return [...ingredients].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
};
