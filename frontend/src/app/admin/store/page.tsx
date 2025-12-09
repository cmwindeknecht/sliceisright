"use client";

import { useAuth } from "@/components/context/Auth";
import AdminIntervals from "./AdminIntervals";
import AdminStoreHours from "./AdminStoreHours";
export default function AdminStorePage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      {user == null || !user.isAdmin ? (
        <h1 className="text-3xl font-bold">Forbidden</h1>
      ) : (
        <div className="space-y-6">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Admin Store Configuration</h1>
            <AdminIntervals />
            <AdminStoreHours />
          </div>
        </div>
      )}
    </div>
  );
}
