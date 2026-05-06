"use client";

import { useState, useEffect } from "react";
import { login } from "@/services/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase"; // 🔥 tambahkan

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 AUTO REDIRECT JIKA SUDAH LOGIN
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();

      if (data.user) {
        router.replace("/shop");
      }
    };

    checkUser();
  }, []);

  const handleLogin = async () => {
    const { error } = await login(email, password);

    if (error) {
      alert(error.message);
    } else {
      router.refresh();
      router.replace("/shop");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] to-[#0f172a]">
      <div className="bg-gray-100 dark:bg-[#1e293b] p-8 rounded-2xl w-[350px] shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <div className="space-y-4">
          <input
            placeholder="Email"
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleLogin}
          className="w-full mt-5 bg-blue-600 py-3 rounded-lg font-semibold hover:bg-blue-700 cursor-pointer hover:scale-105 transition"
        >
          Login
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}