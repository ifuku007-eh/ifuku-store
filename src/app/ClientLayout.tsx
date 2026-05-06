"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import Script from "next/script";
import { useUserStore } from "@/store/useUser";
import { supabase } from "@/lib/supabase";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState("dark");

  const fetchUser = useUserStore((s) => s.fetchUser);

  // 🔥 INIT USER
  useEffect(() => {
    fetchUser();
  }, []);

  // 🔥 LISTEN AUTH CHANGE
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_, session) => {
      useUserStore.getState().setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 🔥 LOAD THEME
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  // 🔥 APPLY THEME
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="relative transition-colors duration-300 bg-white dark:bg-[#0f172a] text-black dark:text-white">
      
      {/* MIDTRANS */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      <Navbar theme={theme} setTheme={setTheme} />

      <main>{children}</main>

      <FloatingCart />
    </div>
  );
}