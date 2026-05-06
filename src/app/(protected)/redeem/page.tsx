"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function RedeemPage() {
  const [code, setCode] = useState("");

  const handleRedeem = async () => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("redeem_code", code)
      .single();

    if (!data) {
      alert("Kode tidak valid");
      return;
    }

    if (data.is_used) {
      alert("Kode sudah digunakan ❌");
      return;
    }

    await supabase
      .from("orders")
      .update({
        is_used: true,
        used_at: new Date().toISOString(),
      })
      .eq("id", data.id);

    alert("Redeem berhasil ✅");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f172a] text-black dark:text-white">
      <div className="bg-gray-100 dark:bg-[#1e293b] p-6 rounded-xl w-80">
        <h1 className="text-xl font-bold mb-4">Redeem Code</h1>

        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Masukkan kode..."
          className="w-full p-2 rounded text-black"
        />

        <button
          onClick={handleRedeem}
          className="w-full mt-4 bg-blue-500 py-2 rounded"
        >
          Redeem
        </button>
      </div>
    </div>
  );
}