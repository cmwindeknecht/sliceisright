import { Ingredient, IngredientOption, IngredientSize } from "@/types/Ingredient";
import { MenuItem, MenuItemSize } from "@/types/MenuItem";
import { OrderItem } from "@/types/Order";

export const STORAGE_CURRENT_ORDER = "NO_USER_CURRENT_ORDER";
export const STORAGE_CURRENT_USER_ORDER = "USER_CURRENT_ORDER";

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

export const sortOrderItemsByCategory = (orderItems: OrderItem[]) => {
  const order = ["PIZZA", "ITEMS", "BEVERAGES", "DESSERTS", "DEALS"];
  return [...orderItems].sort((a, b) => order.indexOf(a.category) - order.indexOf(b.category));
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

export const getIngredientOptionPreface = (ingredientOption: IngredientOption) => {
  if (ingredientOption.isDoubled) {
    return "2x";
  }
  if (ingredientOption.isRegular) {
    return "1x";
  }
  if (ingredientOption.isLight) {
    return "Light";
  }
  if (ingredientOption.isRemoved) {
    return "(X)";
  }
};

export const isTimestampExpired = (timestamp: number, hours: number): boolean => {
  return Date.now() - timestamp > hours * 60 * 60 * 1000;
};

export const PIZZA_LEFT = "LEFT";
export const PIZZA_RIGHT = "RIGHT";
export const PIZZA_WHOLE = "WHOLE";
export const getPizzaPortion = (orderItem: OrderItem) => {
  return orderItem.ingredientOptions.reduce(
    (memo: Map<string, IngredientOption[]>, ingredientOption: IngredientOption) => {
      if (ingredientOption.isLeftHalf) {
        if (!memo.has(PIZZA_LEFT)) {
          memo.set(PIZZA_LEFT, []);
        }
        memo.get(PIZZA_LEFT)!.push(ingredientOption);
      } else if (ingredientOption.isRightHalf) {
        if (!memo.has(PIZZA_RIGHT)) {
          memo.set(PIZZA_RIGHT, []);
        }
        memo.get(PIZZA_RIGHT)!.push(ingredientOption);
      } else {
        if (!memo.has(PIZZA_WHOLE)) {
          memo.set(PIZZA_WHOLE, []);
        }
        memo.get(PIZZA_WHOLE)!.push(ingredientOption);
      }

      return memo;
    },
    new Map<string, IngredientOption[]>()
  );
};

export const getDefaultIngredientOptions = (menuItem: MenuItem, selectedSize: MenuItemSize) => {
  return menuItem.ingredients.map((ingredient) => {
    const ingredientSelectedSize = ingredient.sizes.find(
      (ingredientSize) => ingredientSize.size != selectedSize.size
    );
    if (!ingredientSelectedSize) {
      console.warn(
        `Ingredient ${ingredient.name} does not have the selected size and will not be listed`
      );
    }
    if (ingredient.id == null) {
      console.error(`Ingredient ${ingredient.name} does not have an id!`);
    }

    return {
      ingredientId: ingredient.id,
      name: ingredient.name,
      basePrice: ingredientSelectedSize?.price || 0,
      isRemoved: false,
      isLight: false,
      isRegular: ingredient.canBeLight,
      isDoubled: false,
      isLeftHalf: false,
      isRightHalf: false,
      isWholeItem: ingredient.canBeHalved,
      isIncluded: true,
    };
  });
};

export const doesMenuItemHaveIngredient = (menuItem: MenuItem, ingredient: Ingredient) => {
  return (
    menuItem.ingredients.find((menuItemIngredient) => menuItemIngredient.name == ingredient.name) !=
    null
  );
};

export const createNewOrderItem = (menuItem: MenuItem, selectedSize?: MenuItemSize) => {
  return {
    ...menuItem,
    orderItemId: Math.random(),
    ingredientOptions: [],
    chosenSize: selectedSize ?? menuItem.sizes[0],
    quantity: 0,
    notes: "",
    price: selectedSize?.price ?? menuItem.sizes[0].price,
  };
};

export const convertLocalTimeToUTC = (timeString: string): string => {
  if (!timeString) return "";

  const today = new Date();
  const [hours, minutes] = timeString.split(":");
  today.setHours(parseInt(hours), parseInt(minutes), 0, 0);

  return today.toISOString();
};

export const convertUTCToLocalTime = (utcString: string): string => {
  if (!utcString) return "";

  const date = new Date(utcString);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const getInputTimeFromUTC = (utcString: string): string => {
  if (!utcString) return "";

  const date = new Date(utcString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};
