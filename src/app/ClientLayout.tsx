"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import FloatingCart from "@/components/FloatingCart";
import Script from "next/script";
import { useUserStore } from "@/store/useUser";
import { supabase } from "@/lib/supabase";
import { usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  const fetchUser = useUserStore((s) => s.fetchUser);

  // 🔥 INIT USER
  useEffect(() => {
    fetchUser();
    setMounted(true);
  }, []);

  // 🔥 AUTH LISTENER
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

    if (saved) {
      setTheme(saved);
    }
  }, []);

  // 🔥 APPLY THEME
  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);

    localStorage.setItem("theme", theme);
  }, [theme]);

  // 🔥 HIDE NAVBAR ON AUTH PAGES
  const hideNavbar =
    pathname === "/login" || pathname === "/register";

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020617] text-white transition-colors duration-300">
      {/* MIDTRANS */}
      <Script
        src="https://app.sandbox.midtrans.com/snap/snap.js"
        data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
        strategy="afterInteractive"
      />

      {!hideNavbar && (
        <Navbar theme={theme} setTheme={setTheme} />
      )}

      <main>{children}</main>

      {!hideNavbar && <FloatingCart />}
    </div>
  );
}