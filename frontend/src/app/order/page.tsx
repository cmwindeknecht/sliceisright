"use client";

import { useAuth } from "@/components/Auth";

export default function OrderPage() {
  const { user, jwtToken } = useAuth();
  
  return (
    <div>
      <h1 className="text-3xl font-bold">Order Page</h1>
      {user != null && jwtToken != null && <h2>User {user?.email} Logged In</h2>}
    </div>
  );
}