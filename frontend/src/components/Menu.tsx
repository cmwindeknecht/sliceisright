"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { User, UserResponse } from '@/types/User';
import { useRouter } from "next/navigation";
import { MenuItem, OrderItem } from '@/types/MenuItem';
import { Ingredient } from '@/types/Ingredient';
import { get } from 'http';

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface MenuContext {
  menuItems: MenuItem[] | null;
  ingredients: Ingredient[] | null;
  currentOrder: OrderItem[] | null;
  getMenuItems: () => Promise<{ menuItems?: MenuItem[]; error?: string }>;
  getIngredients: () => Promise<{ ingredients?: Ingredient[]; error?: string }>;
  createMenuItem: (menuItem: MenuItem) => Promise<{ success: boolean ; error?: string }>;
  createIngredient: (ingredient: Ingredient) => Promise<{ success: boolean ; error?: string }>;
  createMenuItemIngredient: (menuItem: MenuItem, ingredient: Ingredient) => Promise<{ success: boolean ; error?: string }>;
}

const MenuContext = createContext<MenuContext | null>(null);

interface MenuProviderProps {
  children: ReactNode;
}

export const MenuProvider = ({ children }: MenuProviderProps) => {
  const [menuItems, setMenuItems] = useState<MenuItem[] | null>(null);
  const [ingredients, setIngredients] = useState<Ingredient[] | null>(null);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[] | null>(null);

  // On page renders, check the status of the token 
  useEffect(() => {
    (async () => {
      await getMenuItems();
      await getIngredients();
    })();
  }, []);

  const getMenuItems = async () => {
    try {
      const res = await fetch(`${apiUrl}/menu/menuItems`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to retrieve menu items');
      }

      const data = await res.json();
      setMenuItems(data);
      return { menuItems: data};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const createMenuItem = async (menuItem: MenuItem) => {
    try {
      const res = await fetch(`${apiUrl}/admin/menu/menuItem`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(menuItem),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create menu item');
      }

      const data = await res.json();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const getIngredients = async () => {
    try {
      const res = await fetch(`${apiUrl}/menu/ingredients`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to retrieve ingredients');
      }

      const data = await res.json();
      setIngredients(data);
      return { ingredients: data};
    } catch (err: any) {
      return { error: err.message };
    }
  };

  const createIngredient = async (ingredient: Ingredient) => {
    try {
      const res = await fetch(`${apiUrl}/admin/menu/ingredient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ingredient),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create ingredient');
      }

      const data = await res.json();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const createMenuItemIngredient = async (menuItem: MenuItem, ingredient: Ingredient) => {
    try {
      const res = await fetch(`${apiUrl}/admin/menu/menuItemIngredient`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({menuItemId: menuItem.id, ingredientId: ingredient.id}),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || 'Failed to create menu item ingredient');
      }

      const data = await res.json();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }

  const addOrderItem = (menuItem: MenuItem) => {
    const orderItem = { ...menuItem, orderItemId: crypto.randomUUID() };
    setCurrentOrder((prev) => prev ? [...prev, orderItem] : [orderItem]);
  };

  const updateOrderItem = (orderItem: OrderItem) => {
    setCurrentOrder((prev) => 
      prev ? prev.map(item => item.orderItemId === orderItem.orderItemId ? { ...orderItem } : item ) : null
    );
  };

  const removeMenuItem = (orderItem: OrderItem) => {
    setCurrentOrder((prev) => prev ? prev.filter(item => item.orderItemId !== orderItem.orderItemId) : null);
  };

  return (
    <MenuContext.Provider value={{ menuItems, ingredients, currentOrder, getMenuItems, getIngredients, createMenuItem, createIngredient, createMenuItemIngredient }}>
      {children}
    </MenuContext.Provider>
  );
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
