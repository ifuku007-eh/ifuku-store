"use client";

import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUser";
import { useCartStore } from "@/features/cart/cart-store";

export default function Navbar({ theme, setTheme }: any) {
  const router = useRouter();

  // ✅ ambil user dari global store (BUKAN useState lagi)
  const setUser = useUserStore((s) => s.setUser);
  const user = useUserStore((s) => s.user);

  const [role, setRole] = useState("");

  // 🔥 ambil role saja (tidak perlu getUser lagi)
  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(data?.role || "");
    };

    fetchRole();
  }, [user]);

  const logout = async () => {
  try {
    // 🔥 SIGN OUT SUPABASE
    await supabase.auth.signOut();

    // 🔥 RESET STATE
    setUser(null);
    useCartStore.getState().setCart([]);

    // 🔥 CLEAR STORAGE (IMPORTANT)
    localStorage.clear();
    sessionStorage.clear();

    // 🔥 HARD REDIRECT (ANTI NYANGKUT)
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout error:", err);
  }
};

  return (
    <div
      className="
      px-6 py-4 flex justify-between items-center
      bg-white dark:bg-[#020617]
      text-black dark:text-white
      border-b border-gray-200 dark:border-gray-800
      transition-colors duration-300
    "
    >
      {/* LOGO */}
      <Link
        href="/shop"
        className="font-bold text-lg cursor-pointer hover:opacity-80 transition"
      >
        Ifuku Store ⚡
      </Link>

      <div className="flex items-center gap-3">
        {!user ? (
          <>
            <Link href="/login" className="hover:underline">
              Login
            </Link>
            <Link href="/register" className="hover:underline">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/shop"
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
            >
              Shop
            </Link>

            {role === "admin" && (
              <Link
                href="/admin"
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
              >
                Admin
              </Link>
            )}

            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>

            <button
              onClick={logout}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
}
