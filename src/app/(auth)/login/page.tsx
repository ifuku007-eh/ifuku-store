"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useUserStore } from "@/store/useUser";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const setUser = useUserStore((s) => s.setUser);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setUser(data.user);
    router.replace("/shop");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] to-[#0f172a] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#1e293b] p-8 rounded-2xl w-full max-w-[380px] shadow-xl"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <div className="space-y-4">
          <input
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-blue-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-blue-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 bg-blue-600 py-3 rounded-lg font-semibold text-white hover:bg-blue-700 transition disabled:opacity-60"
        >
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Daftar sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}