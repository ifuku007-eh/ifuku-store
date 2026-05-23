"use client";

import { useCartStore } from "@/features/cart/cart-store";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatRupiah } from "@/lib/format";
import { useRouter } from "next/navigation";

export default function CartSidebar() {
  const router = useRouter();
  const { cart } = useCartStore();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) setUserId(data.user.id);
    };

    getUser();
  }, []);

  const userCart = cart.filter((i) => i.userId === userId);
  const total = userCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = userCart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <aside className="rounded-3xl border border-white/10 bg-white/[0.05] p-5 shadow-2xl shadow-black/20 backdrop-blur">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Ringkasan</h2>
          <p className="text-sm text-slate-400">{totalQty} item di keranjang</p>
        </div>

        <span className="rounded-2xl bg-blue-500/20 px-3 py-2 text-lg">🛒</span>
      </div>

      {userCart.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-sm text-slate-400">
          Keranjang masih kosong
        </div>
      ) : (
        <div className="space-y-3">
          {userCart.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 rounded-2xl bg-slate-950/40 p-3"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-12 w-12 rounded-xl bg-white object-contain p-1"
              />

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="text-xs text-slate-400">x{item.quantity}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 border-t border-white/10 pt-4">
        <p className="text-sm text-slate-400">Total</p>
        <p className="text-2xl font-black text-orange-400">
          Rp {formatRupiah(total)}
        </p>

        <button
          onClick={() => router.push("/cart")}
          disabled={userCart.length === 0}
          className="mt-4 w-full rounded-2xl bg-orange-500 py-3 text-sm font-bold text-white transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          Lanjut Checkout
        </button>
      </div>
    </aside>
  );
}