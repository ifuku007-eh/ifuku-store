"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/features/cart/cart-store";
import { supabase } from "@/lib/supabase";
import PaymentModal from "@/components/PaymentModal";
import { formatRupiah } from "@/lib/format";

export default function CartPage() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCartStore();
  const hydrated = useCartStore((s) => s.hydrated);

  const [showPayment, setShowPayment] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [animateId, setAnimateId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 HYDRATION GUARD
  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading cart...
      </div>
    );
  }

  // 🔥 GET USER
  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUserId(data?.user?.id || null);
    };
    getUser();
  }, []);

  // 🔥 USER GUARD
  if (!userId) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading user...
      </div>
    );
  }

  const userCart = cart.filter((i) => i.userId === userId);
  const total = userCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const totalQty = userCart.reduce((sum, i) => sum + i.quantity, 0);

  const handlePayment = async (email: string) => {
    if (!email) return alert("Email wajib");
    if (userCart.length === 0) return alert("Keranjang kosong");

    setLoading(true);

    try {
      // 🔥 VALIDASI STOCK REALTIME
      for (const item of userCart) {
        const { data } = await supabase
          .from("products")
          .select("stock")
          .eq("id", item.id)
          .single();

        if (!data || data.stock < item.quantity) {
          alert(`Stock ${item.name} sudah habis`);
          setLoading(false);
          return;
        }
      }

      // 🔥 BUAT TRANSAKSI MIDTRANS + DAPATKAN orderId
      const midtransRes = await fetch("/api/midtrans", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          total,
          items: userCart,
          userId,
        }),
      });

      const midtransData = await midtransRes.json();

      if (!midtransData.token || !midtransData.orderId) {
        alert("Gagal membuat transaksi");
        setLoading(false);
        return;
      }

      const orderId = midtransData.orderId;

      // 🔥 SNAP PAY
      window.snap.pay(midtransData.token, {
        onSuccess: async function () {
          try {
            const successRes = await fetch("/api/payment-success", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                email,
                items: userCart,
                total,
                userId,
                orderId,
              }),
            });

            const result = await successRes.json();

            if (!result.code) {
              alert("Gagal mendapatkan kode ❌");
              setLoading(false);
              return;
            }

            useCartStore.getState().setCart([]);
            window.location.href = `/payment-success?code=${result.code}`;
          } catch {
            alert("Terjadi error setelah pembayaran");
            setLoading(false);
          }
        },

        onError: function () {
          alert("Pembayaran gagal");
          setLoading(false);
        },

        onClose: function () {
          setLoading(false);
        },
      });
    } catch {
      alert("Terjadi error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-[#020617] to-[#0f172a] text-white">
      <h1 className="text-3xl font-bold mb-6">🛒 Keranjang</h1>

      {userCart.length === 0 && (
        <p className="text-gray-400">Keranjang kosong</p>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-4">
          {userCart.map((item) => (
            <div
              key={item.id}
              className={`p-4 rounded-xl bg-white/5 border border-white/10 transition ${
                animateId === item.id ? "scale-110" : ""
              }`}
            >
              <div className="flex justify-between">
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-gray-400 text-sm">
                    Rp {formatRupiah(item.price)}
                  </p>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => decreaseQty(item.id, userId)}
                      className="bg-red-500 w-8 h-8 rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => {
                        setAnimateId(item.id);
                        increaseQty(item.id, userId);
                        setTimeout(() => setAnimateId(null), 200);
                      }}
                      className="bg-green-500 w-8 h-8 rounded"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (!confirm("Hapus item ini?")) return;
                    removeFromCart(item.id, userId);
                  }}
                  className="text-red-400"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        <div>
          <div className="p-5 rounded-xl bg-white/5 border border-white/10">
            <p>Total Item: {totalQty}</p>
            <p className="text-xl font-bold">Rp {formatRupiah(total)}</p>

            <button
              disabled={loading || userCart.length === 0}
              onClick={() => setShowPayment(true)}
              className="w-full mt-4 bg-blue-500 py-3 rounded"
            >
              {loading ? "Memproses..." : "Checkout 🚀"}
            </button>
          </div>
        </div>
      </div>

      {showPayment && (
        <PaymentModal
          onClose={() => setShowPayment(false)}
          onPay={handlePayment}
        />
      )}
    </div>
  );
}