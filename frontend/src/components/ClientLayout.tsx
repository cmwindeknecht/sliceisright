// src/components/ClientLayout.tsx (CLIENT COMPONENT)
"use client";

import { useState } from "react";
import { AuthProvider } from "@/components/context/Auth";
import { MenuProvider } from "@/components/context/Menu";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Toast from "@/components/Toast";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <AuthProvider>
      <MenuProvider setToastMessage={setToastMessage}>
        <Header />
        <main className="flex-1 overflow-y-auto mt-[10vh]">{children}</main>
        <Footer />
        {toastMessage != null && (
          <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
        )}
      </MenuProvider>
    </AuthProvider>
  );
}
