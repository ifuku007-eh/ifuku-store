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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    window.location.assign("/shop");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <form onSubmit={handleLogin} className="bg-[#1e293b] p-8 rounded-2xl w-full max-w-[380px]">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Login</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-[#334155] text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 rounded bg-[#334155] text-white"
        />

        <button disabled={loading} className="w-full bg-blue-600 py-3 rounded text-white">
          {loading ? "Loading..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Belum punya akun?{" "}
          <Link href="/register" className="text-blue-400">
            Daftar sekarang
          </Link>
        </p>
      </form>
    </div>
  );
}