"use client";

import { useAuth } from "@/components/Auth";
import { ProtectedRoute } from "@/components/ProtectedRoute";

const AccountPage = () => {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <div> Welcome, {user?.email}!</div>
    </ProtectedRoute>
  )
};

export default AccountPage;
