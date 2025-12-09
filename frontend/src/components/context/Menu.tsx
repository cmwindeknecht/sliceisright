"use client";

import { createContext, useContext, useState, ReactNode, useEffect, useMemo } from "react";
import { MenuItem } from "@/types/MenuItem";
import { Ingredient } from "@/types/Ingredient";
import { OrderItem } from "@/types/Order";
import { useAuth } from "./Auth";
import { User } from "@/types/User";
import {
  isTimestampExpired,
  STORAGE_CURRENT_ORDER as STORAGE_GUEST_CURRENT_ORDER,
  STORAGE_CURRENT_USER_ORDER as STORAGE_USER_CURRENT_ORDER,
} from "@/misc/helper";
import { logger } from "@/misc/logger";

export const apiUrl = process.env.NEXT_PUBLIC_API_URL;

interface MenuContext {
  menuItems: MenuItem[];
  ingredients: Ingredient[];
  currentOrder: OrderItem[];
  getMenuItems: () => Promise<{ menuItems: MenuItem[]; error?: string }>;
  getIngredients: () => Promise<{ ingredients: Ingredient[]; error?: string }>;
  createMenuItem: (menuItem: MenuItem) => Promise<{ success: boolean; error?: string }>;
  createIngredient: (ingredient: Ingredient) => Promise<{ success: boolean; error?: string }>;
  updateMenuItem: (menuItem: MenuItem) => Promise<{ success: boolean; error?: string }>;
  updateIngredient: (ingredient: Ingredient) => Promise<{ success: boolean; error?: string }>;
  deleteMenuItem: (menuItem: MenuItem) => Promise<{ success: boolean; error?: string }>;
  deleteIngredient: (ingredient: Ingredient) => Promise<{ success: boolean; error?: string }>;
  addOrderItem: (orderItem: OrderItem) => { success: boolean; error?: string };
  updateOrderItem: (orderItem: OrderItem) => { success: boolean; error?: string };
  deleteOrderItem: (orderItem: OrderItem) => { success: boolean; error?: string };
}

const MenuContext = createContext<MenuContext | null>(null);

interface StoredOrder {
  currentOrder: OrderItem[];
  user: User | null;
  createdAt: number;
}

interface MenuProviderProps {
  children: ReactNode;
  setToastMessage: (message: string | null) => void;
}

export const MenuProvider = ({ children, setToastMessage }: MenuProviderProps) => {
  const { user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [currentOrder, setCurrentOrder] = useState<OrderItem[]>([]);

  const ORDER_STORAGE_HOURS = 12;

  /**
   * Current Order Management
   */
  useEffect(() => {
    const storageKey = user ? STORAGE_USER_CURRENT_ORDER : STORAGE_GUEST_CURRENT_ORDER;
    if (currentOrder.length === 0) {
      logger.debug(`Order removed from storage because it is empty for storage ${storageKey}`, {
        user,
      });
      localStorage.removeItem(storageKey);
      return;
    }

    const existing = localStorage.getItem(storageKey);
    let storedOrder: StoredOrder;
    if (existing) {
      const parsed: StoredOrder = JSON.parse(existing);
      if (parsed.user?.email == user?.email) {
        storedOrder = { ...parsed, currentOrder };
      } else {
        storedOrder = { currentOrder, user, createdAt: Date.now() };
      }
    } else {
      storedOrder = { currentOrder, user, createdAt: Date.now() };
    }

    logger.debug(`Order saved to local storage ${storageKey}`, {
      user,
      storedOrder,
    });
    localStorage.setItem(storageKey, JSON.stringify(storedOrder));
    // }, [user, currentOrder]);
  }, []);

  useEffect(() => {
    let useGuestOrder = false;
    const guestStored = localStorage.getItem(STORAGE_GUEST_CURRENT_ORDER);
    if (user) {
      const loggedInStored = localStorage.getItem(STORAGE_USER_CURRENT_ORDER);
      if (loggedInStored) {
        const parsed: StoredOrder = JSON.parse(loggedInStored);
        if (user.email != parsed.user?.email) {
          logger.debug(
            `Menu.tsx setCurrentOrderFromStorage useEffect --- Stored order does not match the email of the current user`,
            {
              user,
              parsedStorage: parsed,
            }
          );
          useGuestOrder = guestStored != null;
        } else {
          if (!isTimestampExpired(parsed.createdAt, ORDER_STORAGE_HOURS)) {
            logger.debug(
              `Menu.tsx setCurrentOrderFromStorage useEffect --- Setting unexpired order of logged in user as the current order`,
              {
                user,
                parsedStorage: parsed,
              }
            );
            setCurrentOrder(parsed.currentOrder);
          } else {
            logger.debug(
              `Menu.tsx setCurrentOrderFromStorage useEffect --- Removed expired order of logged in user in storage at ${STORAGE_USER_CURRENT_ORDER}`,
              {
                user,
                parsedStorage: parsed,
              }
            );
            localStorage.removeItem(STORAGE_USER_CURRENT_ORDER);
          }
        }
      } else if (guestStored) {
        const parsed: StoredOrder = JSON.parse(guestStored);
        if (!isTimestampExpired(parsed.createdAt, ORDER_STORAGE_HOURS)) {
          logger.debug(
            `Menu.tsx setCurrentOrderFromStorage useEffect --- Setting unexpired order of guest user to the logged in order as the current order`,
            {
              user,
              parsedStorage: parsed,
            }
          );
          setCurrentOrder(parsed.currentOrder);
          localStorage.setItem(STORAGE_USER_CURRENT_ORDER, guestStored);
        }
        localStorage.removeItem(STORAGE_GUEST_CURRENT_ORDER);
      }
    } else {
      useGuestOrder = guestStored != null;
    }

    if (useGuestOrder && guestStored) {
      const parsed: StoredOrder = JSON.parse(guestStored);
      if (!isTimestampExpired(parsed.createdAt, ORDER_STORAGE_HOURS)) {
        logger.debug(
          `Menu.tsx setCurrentOrderFromStorage useEffect --- Setting unexpired order of guest user as the current order`,
          {
            user,
            parsedStorage: parsed,
          }
        );
        setCurrentOrder(parsed.currentOrder);
      } else {
        logger.debug(
          `Menu.tsx setCurrentOrderFromStorage useEffect --- RRemoved expired order of guest user in storage at ${STORAGE_USER_CURRENT_ORDER}`,
          {
            user,
            parsedStorage: parsed,
          }
        );
        localStorage.removeItem(STORAGE_GUEST_CURRENT_ORDER);
      }
    }
  }, [user]);

  /**
   * Menu/Order related SSEs
   */
  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8080/menu/updates");

    eventSource.onmessage = (event) => {
      console.log(`Received event data ${event.data}`);
      if (event.data === "refreshMenuItems") {
        getMenuItems();
      }
      if (event.data === "refreshIngredients") {
        getIngredients();
      }
    };

    eventSource.onerror = (error) => {
      console.warn("SSE error:", error);
    };

    return () => eventSource.close();
  }, []);

  const getMenuItems = async () => {
    logTrace("getMenuItems");

    try {
      const res = await fetch(`${apiUrl}/menu/menuItems`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to retrieve menu items");
      }

      const data = await res.json();
      setMenuItems(data.entity);
      return { menuItems: data.entity };
    } catch (err: any) {
      return { menuItems: [], error: err.message };
    }
  };

  const getIngredients = async () => {
    logTrace("getIngredients");

    try {
      const res = await fetch(`${apiUrl}/menu/ingredients`);

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to retrieve ingredients");
      }

      const data = await res.json();
      setIngredients(data.entity);
      return { ingredients: data.entity };
    } catch (err: any) {
      return { ingredients: [], error: err.message };
    }
  };

  const createMenuItem = async (menuItem: MenuItem) => {
    try {
      const jwt = validateJWT();

      const res = await fetch(`${apiUrl}/admin/menu/menuItem`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify(menuItem),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create menu item");
      }

      await res.json();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const createIngredient = async (ingredient: Ingredient) => {
    try {
      const jwt = validateJWT();

      const res = await fetch(`${apiUrl}/admin/menu/ingredient`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify(ingredient),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create ingredient");
      }

      await res.json();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateMenuItem = async (menuItem: MenuItem) => {
    try {
      const jwt = validateJWT();

      const res = await fetch(`${apiUrl}/admin/menu/menuItem`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify(menuItem),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update menu item");
      }

      await res.json();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateIngredient = async (ingredient: Ingredient) => {
    try {
      const jwt = validateJWT();

      const res = await fetch(`${apiUrl}/admin/menu/ingredient`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify(ingredient),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to update ingredient");
      }

      await res.json();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteMenuItem = async (menuItem: MenuItem) => {
    try {
      const jwt = validateJWT();

      const res = await fetch(`${apiUrl}/admin/menu/menuItem/${menuItem.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete menu item");
      }

      await res.json();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteIngredient = async (ingredient: Ingredient) => {
    try {
      const jwt = validateJWT();

      const res = await fetch(`${apiUrl}/admin/menu/ingredient/${ingredient.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to delete ingredient");
      }

      await res.json();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const addOrderItem = (orderItem: OrderItem) => {
    try {
      const nextId =
        currentOrder.length === 0
          ? 1
          : Math.max(...currentOrder.map((item) => item.orderItemId ?? 0)) + 1;

      setCurrentOrder((prevOrderItems) => [
        ...prevOrderItems,
        { ...orderItem, orderItemId: nextId },
      ]);
      setToastMessage(
        `Added ${orderItem.name} ${orderItem.chosenSize.size == "NONE" ? "" : `(${orderItem.chosenSize.size})`} to cart`
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const updateOrderItem = (orderItem: OrderItem) => {
    try {
      setCurrentOrder((prev) =>
        prev.map((prevOrderItem) =>
          prevOrderItem.orderItemId === orderItem.orderItemId ? { ...orderItem } : prevOrderItem
        )
      );
      setToastMessage(
        `Updated ${orderItem.name} ${orderItem.chosenSize.size == "NONE" ? "" : `(${orderItem.chosenSize.size})`} in cart`
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const deleteOrderItem = (orderItem: OrderItem) => {
    try {
      setCurrentOrder((prevOrderItems) =>
        prevOrderItems.filter(
          (prevOrderItem) => prevOrderItem.orderItemId !== orderItem.orderItemId
        )
      );
      setToastMessage(
        `Removed ${orderItem.name} ${orderItem.chosenSize.size == "NONE" ? "" : `(${orderItem.chosenSize.size})`} from cart`
      );
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  };

  const logTrace = (prefix: string) => {
    const stack = new Error().stack
      ?.split("\n")
      .slice(2, 5)
      .map((s) => s.trim());

    console.log(`${prefix} called from:\n`, stack?.join("\n"));
  };

  const validateJWT = () => {
    const jwt = localStorage.getItem("token");
    if (jwt == null) {
      throw new Error("No JWT is stored locally!");
    }
    return jwt;
  };

  const value = useMemo(
    () => ({
      menuItems,
      ingredients,
      currentOrder,
      getMenuItems,
      getIngredients,
      createMenuItem,
      createIngredient,
      updateMenuItem,
      updateIngredient,
      deleteMenuItem,
      deleteIngredient,
      addOrderItem,
      updateOrderItem,
      deleteOrderItem,
    }),
    [menuItems, ingredients, currentOrder]
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
};

export const useMenu = () => {
  const context = useContext(MenuContext);
  if (!context) throw new Error("useMenu must be used within MenuProvider");
  return context;
};
