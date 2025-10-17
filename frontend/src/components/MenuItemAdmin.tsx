import { Ingredient } from "@/types/Ingredient";
import { MenuItem, OrderItem } from "@/types/MenuItem";

export interface MenuItemAdminProps {
  menuItem: MenuItem;
}

export default function MenuItemAdmin({menuItem}: MenuItemAdminProps)  {
  return (
    <div className="flex flex-col">
        <div>{menuItem.name}</div>
        <div>{menuItem.description}</div>
        {/* <image src={menuItem.imageUrl}/> */}
        <div>{menuItem.category}</div>
        <div>{menuItem.availableSizes.map(size => size.size + ": $" + size.price)}</div>
        <div>{menuItem.defaultIngredients.map(ingredient => ingredient.name + ingredient.availableSizes.map(size => size.size + ": $" + size.price))}</div>
    </div>
  );
}