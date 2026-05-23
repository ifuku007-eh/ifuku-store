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

    if (!email || !password) {
      alert("Email dan password wajib diisi");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        setLoading(false);
        return;
      }

      if (!data.session) {
        alert("Login gagal, session tidak ditemukan");
        setLoading(false);
        return;
      }

      window.location.replace("/shop");
    } catch (err) {
      console.error(err);
      alert("Terjadi error saat login");
      setLoading(false);
    }
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
            id="email"
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-blue-500 disabled:opacity-70"
          />

          <input
            id="password"
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-blue-500 disabled:opacity-70"
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