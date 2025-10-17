"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/Auth";
import { useState } from "react";
import { useMenu } from "./Menu";
import MenuItemAdmin, { MenuItemAdminProps } from "./MenuItemAdmin";
import { Ingredient } from "@/types/Ingredient";
import { MenuItem as MenuItemType, OrderItem} from "@/types/MenuItem";

export interface MenuItemProps {
  ingredients: Ingredient[];
  menuItem: MenuItemType;
  addOrderItem: React.Dispatch<React.SetStateAction<OrderItem>>;
  updateOrderItem: React.Dispatch<React.SetStateAction<OrderItem>>;
  deleteOrderItem: React.Dispatch<React.SetStateAction<OrderItem>>;
}

// TODO extend AdminMenuItem - same shit, you just don't customize it / choose a size in admin
export default function MenuItem({ingredients, menuItem, addOrderItem, updateOrderItem, deleteOrderItem}: MenuItemProps) {
  return (
    <div>
        <MenuItemAdmin menuItem={menuItem}></MenuItemAdmin>
    </div>
  );
}