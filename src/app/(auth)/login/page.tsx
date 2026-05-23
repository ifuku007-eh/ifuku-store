"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    console.log("LOGIN RESULT:", { data, error });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/shop";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <form
        onSubmit={handleLogin}
        className="bg-[#1e293b] p-8 rounded-2xl w-full max-w-[380px] shadow-xl"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Login
        </h1>

        <div className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[#334155] text-white outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-[#334155] text-white outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-5 bg-blue-600 py-3 rounded-lg font-semibold text-white"
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