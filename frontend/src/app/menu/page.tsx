"use client";

import { useMenu } from "@/components/context/Menu";
import MenuItem from "@/components/MenuItem";
import MenuItemOverview from "@/components/MenuItemOverview";
import MenuItemOverviewSimple from "@/components/MenuItemOverviewSimple";
import { MenuItem as MenuItemType } from "@/types/MenuItem";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function MenuPage() {
  const { menuItems, ingredients, getMenuItems, getIngredients } = useMenu();
  const [categorizedMenu, setCategorizedMenu] = useState<
    Map<MenuItemType["category"], MenuItemType[]>
  >(new Map());
  const [menuItemToCustomize, setMenuItemToCustomize] = useState<MenuItemType | null>(null);

  const categories = new Map<MenuItemType["category"], string>([
    ["PIZZA", "Signature Pizzas"],
    ["ITEMS", "Specialty Items"],
    ["DESSERTS", "Sweet Treats"],
    ["BEVERAGES", "Cool Drinks"],
    ["DEALS", "Current Deals"],
  ]);

  useEffect(() => {
    getMenuItems();
    getIngredients();
  }, []);

  useEffect(() => {
    categorizeMenuItems();
  }, [menuItems]);
  useEffect(() => {
    categorizeMenuItems();
  }, [ingredients]);

  const categorizeMenuItems = () => {
    const categorized = new Map<MenuItemType["category"], MenuItemType[]>();

    menuItems.forEach((menuItem) => {
      if (!categorized.has(menuItem.category)) {
        categorized.set(menuItem.category, []);
      }

      // Get the array and push the item into it
      categorized.get(menuItem.category)!.push(menuItem);
    });
    setCategorizedMenu(categorized);
  };

  // TODO get the current order and populate the quantities in the overview cards
  return (
    <div className="m-3">
      {menuItemToCustomize ? (
        <div>
          <button
            onClick={() => setMenuItemToCustomize(null)}
            className=" bg-orange-600 text-white p-2 mb-3 rounded hover:bg-orange-700 disabled:opacity-50"
          >
            Return to Menu
          </button>
          <MenuItem menuItem={menuItemToCustomize} ingredients={ingredients} />
        </div>
      ) : (
        <div>
          {[...categorizedMenu.entries()].map(([category, menuItems]) => (
            <div key={category}>
              <div className="text-center text-3xl m-3">{categories.get(category)}</div>
              <div
                className={clsx(
                  category == "BEVERAGES"
                    ? "grid-cols-8 sm:grid-cols-4 md:grid-cols-5 xl:grid-cols-6"
                    : "grid-cols-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4",
                  "grid gap-4 "
                )}
              >
                {menuItems
                  .filter((menuItem) => menuItem.isAvailable)
                  .map((menuItem) =>
                    category == "BEVERAGES" ? (
                      <MenuItemOverviewSimple menuItem={menuItem} />
                    ) : (
                      <MenuItemOverview
                        key={menuItem.name + menuItem.id}
                        menuItem={menuItem}
                        setMenuItemToCustomize={setMenuItemToCustomize}
                      />
                    )
                  )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
