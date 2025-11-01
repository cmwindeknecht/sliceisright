import { IngredientSize } from "@/types/Ingredient";
import { MenuItemSize } from "@/types/MenuItem";

export const sortMenuSize = (sizes: MenuItemSize[]) => {
  const order = ["None", "S", "M", "L", "XL"];
  return [...sizes].sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size));
};

export const sortIngredientSize = (sizes: IngredientSize[]) => {
  const order = ["None", "S", "M", "L", "XL"];
  return [...sizes].sort((a, b) => order.indexOf(a.size) - order.indexOf(b.size));
};
