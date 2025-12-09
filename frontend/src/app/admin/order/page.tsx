"use client";

import { useAuth } from "@/components/context/Auth";
import { useEffect } from "react";

export default function AdminOrdersPage() {
  const { user, validateAdminPriveleges } = useAuth();

  useEffect(() => {
    validateAdminPriveleges();
  }, []);

  return (
    <div>
      {user == null || !user.isAdmin ? (
        <h1> Forbidden</h1>
      ) : (
        <div className="text-3xl font-bold">Admin Orders</div>
      )}
    </div>
  );
}
