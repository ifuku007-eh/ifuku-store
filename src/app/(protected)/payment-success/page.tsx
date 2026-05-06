"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const params = useSearchParams();
  const code = params.get("code");

  const copy = () => {
    if (!code) return alert("Code tidak ada");
    navigator.clipboard.writeText(code);
    alert("Code berhasil disalin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0f172a] text-black dark:text-white p-6">
      <div className="bg-gray-100 dark:bg-[#1e293b] p-6 rounded-xl max-w-md w-full text-center">

        <h1 className="text-2xl font-bold mb-3">✅ Pembayaran Berhasil</h1>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Berikut adalah kode redeem kamu:
        </p>

        <div className="bg-black text-green-400 font-mono p-3 rounded mb-3 break-all">
          {code || "Kode tidak ditemukan"}
        </div>

        <button
          onClick={copy}
          className="w-full bg-blue-500 py-2 rounded hover:bg-blue-600"
        >
          Salin Kode
        </button>

        <div className="mt-4 text-xs text-red-400">
          ⚠️ Jangan bagikan kode ke orang lain!
        </div>

      </div>
    </div>
  );
}