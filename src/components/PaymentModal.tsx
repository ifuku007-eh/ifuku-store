"use client";

import { useState } from "react";

export default function PaymentModal({ onClose, onPay }: any) {
  const [email, setEmail] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      {/* MODAL */}
      <div className="relative z-50 bg-white text-black p-6 rounded-xl w-120 shadow-xl">
        <h2 className="font-bold mb-3">Checkout</h2>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Masukkan email aktif untuk menerima invoice"
          className="w-full border p-2 mb-3 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={() => onPay(email)}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 active:scale-95 transition"
        >
          Bayar Sekarang
        </button>

        <button
          onClick={onClose}
          className="mt-2 text-sm text-gray-500 hover:underline"
        >
          Batal
        </button>
      </div>
    </div>
  );
}