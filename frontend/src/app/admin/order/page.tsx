"use client"

import { useAuth } from "@/components/Auth";

export default function AdminOrdersPage() {
  const { user } = useAuth();
  
  return (
    <div>
      {user == null || !user.isAdmin ? 
      <h1> Forbidden</h1>
      :
      <h1 className="text-3xl font-bold">Admin Orders</h1>
      }
    </div>
  );
}