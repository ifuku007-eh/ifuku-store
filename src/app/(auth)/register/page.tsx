"use client";

import { useState, useEffect } from "react";
import { register } from "@/services/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // 🔥 tambahkan

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
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

  const handleRegister = async () => {
    const { error } = await register(name, email, password);

    if (error) {
      alert(error.message);
    } else {
      alert("Register berhasil, silakan login");
      router.replace("/login"); // 🔥 langsung arahkan ke login
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#020617] to-[#0f172a]">
      <div className="bg-gray-100 dark:bg-[#1e293b] p-8 rounded-2xl w-[350px] shadow-xl">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Register
        </h1>

        <div className="space-y-4">
          <input
            placeholder="Nama"
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-green-500"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            placeholder="Email"
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-green-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-green-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          onClick={handleRegister}
          className="w-full mt-5 bg-green-600 py-3 rounded-lg font-semibold hover:bg-green-700 cursor-pointer hover:scale-105 transition"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login disini
          </Link>
        </p>
      </div>
    </div>
  );
}