"use client";

import { useState } from "react";
import { register } from "@/services/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await register(name, email, password);

    if (error) {
      alert(error.message);
      return;
    }

    alert("Register berhasil, silakan login");
    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] px-4">
      <form
        onSubmit={handleRegister}
        className="bg-[#1e293b] p-8 rounded-2xl w-full max-w-[380px] shadow-xl"
      >
        <h1 className="text-2xl font-bold text-white mb-6 text-center">
          Register
        </h1>

        <div className="space-y-4">
          <input
            name="name"
            placeholder="Nama"
            value={name}
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-green-500"
            onChange={(e) => setName(e.target.value)}
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={email}
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-green-500"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={password}
            className="w-full p-3 rounded bg-[#334155] text-white outline-none focus:ring-2 ring-green-500"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full mt-5 bg-green-600 py-3 rounded-lg font-semibold text-white hover:bg-green-700 transition"
        >
          Register
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Sudah punya akun?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Login disini
          </Link>
        </p>
      </form>
    </div>
  );
}