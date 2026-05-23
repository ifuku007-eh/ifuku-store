"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/features/cart/cart-store";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUser";
import { formatRupiah } from "@/lib/format";

export default function ProductDetailPage() {
  const { addToCart } = useCartStore();
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();

  const [product, setProduct] = useState<any>(null);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) setUserId(userData.user.id);

      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      setProduct(data);
    };

    init();
  }, [params.id]);

  if (!product) {
    return (
      <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center">
        Loading product...
      </div>
    );
  }

  const isDiamond = product.category === "diamond";

  const handleAddCart = () => {
    if (!userId) {
      toast.error("Login dulu");
      return;
    }

    if (product.stock === 0) {
      toast.error("Stok habis");
      return;
    }

    addToCart(product, userId);
    toast.success("Masuk ke keranjang 🛒");
  };

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    await supabase.from("products").delete().eq("id", product.id);

    toast.success("Produk dihapus");
    router.push("/shop");
  };

  return (
    <div className="min-h-screen bg-[#020617] px-4 py-8 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <button
          onClick={() => router.push("/shop")}
          className="mb-6 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 hover:bg-white/10"
        >
          ← Kembali ke Shop
        </button>

        <div className="grid gap-6 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-2xl shadow-blue-950/30 lg:grid-cols-[1fr_1.25fr]">
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-950/70 via-slate-950 to-purple-950/60 p-6">
            <div className="mb-4 flex justify-between">
              <span className="rounded-full border border-blue-400/40 bg-blue-500/20 px-3 py-1 text-xs font-bold text-blue-200">
                💎 {isDiamond ? "DIAMOND" : "WEEKLY PASS"}
              </span>

              <span className="rounded-full border border-orange-400/40 bg-orange-500/20 px-3 py-1 text-xs font-bold text-orange-200">
                🔥 BEST SELLER
              </span>
            </div>

            <div className="flex h-[340px] items-center justify-center rounded-3xl bg-white">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain p-10"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="text-4xl font-black tracking-tight">
              {product.name}
            </h1>

            <div className="mt-3 flex items-center gap-2 text-sm text-slate-400">
              <span className="text-orange-400">★★★★★</span>
              <span>(4.9)</span>
              <span>•</span>
              <span>2.1K+ terjual</span>
            </div>

            <div className="mt-6 flex items-end gap-3">
              <p className="text-4xl font-black text-orange-400">
                Rp {formatRupiah(product.price)}
              </p>
              <p className="text-slate-500 line-through">
                Rp {formatRupiah(product.price + 4000)}
              </p>
              <span className="rounded-lg bg-red-500 px-2 py-1 text-xs font-bold">
                -19%
              </span>
            </div>

            <p className="mt-6 max-w-2xl text-slate-300">
              Top up {product.name} Mobile Legends instan dan aman. Cocok untuk
              kebutuhan harian, event, push rank, dan beli skin favorit kamu.
            </p>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              <InfoCard icon="⚡" title="Instan" desc="1-5 menit" />
              <InfoCard icon="🛡️" title="Aman" desc="100% safe" />
              <InfoCard icon="✅" title="Legal" desc="Resmi & aman" />
              <InfoCard icon="🎧" title="Support" desc="24/7 online" />
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">Stok Tersedia</p>
                <p className="mt-1 text-xl font-bold text-emerald-400">
                  {product.stock} Item
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4">
                <p className="text-sm text-slate-400">Kategori</p>
                <p className="mt-1 text-xl font-bold">
                  {isDiamond ? "Diamond" : "Weekly Pass"}
                </p>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={handleAddCart}
                disabled={product.stock === 0}
                className="flex-1 rounded-2xl bg-blue-600 py-4 font-bold text-white hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-400"
              >
                🛒 {product.stock === 0 ? "Stok Habis" : "+ Keranjang"}
              </button>

              {user?.role === "admin" && (
                <button
                  onClick={handleDelete}
                  className="rounded-2xl bg-red-500 px-6 font-bold hover:bg-red-400"
                >
                  Hapus
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          <Panel title="📋 Informasi Produk">
            <InfoRow label="Produk" value={product.name} />
            <InfoRow label="Game" value="Mobile Legends: Bang Bang" />
            <InfoRow label="Tipe" value={isDiamond ? "Diamond" : "Weekly Diamond Pass"} />
            <InfoRow label="Proses" value="Instan 1-5 menit" />
            <InfoRow label="Metode" value="User ID & Server" />
          </Panel>

          <Panel title="🎁 Cara Pembelian">
            <Step no="1" text="Masukkan User ID & Server Mobile Legends" />
            <Step no="2" text="Pilih nominal produk yang ingin dibeli" />
            <Step no="3" text="Lakukan pembayaran dengan metode tersedia" />
            <Step no="4" text="Diamond otomatis masuk ke akun kamu" />
          </Panel>

          <Panel title="🏆 Kenapa Ifuku Store?">
            <Benefit text="Harga murah dan transparan" />
            <Benefit text="Proses cepat dan otomatis" />
            <Benefit text="Aman tanpa risiko banned" />
            <Benefit text="Support siap membantu" />
          </Panel>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, title, desc }: any) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-center">
      <div className="text-2xl">{icon}</div>
      <p className="mt-2 font-bold">{title}</p>
      <p className="text-xs text-slate-400">{desc}</p>
    </div>
  );
}

function Panel({ title, children }: any) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-xl shadow-black/20">
      <h2 className="mb-5 text-lg font-bold">{title}</h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function InfoRow({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-white/10 pb-3 text-sm">
      <span className="text-slate-400">{label}</span>
      <span className="text-right font-medium">{value}</span>
    </div>
  );
}

function Step({ no, text }: any) {
  return (
    <div className="flex gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 font-bold">
        {no}
      </span>
      <p className="text-sm text-slate-300">{text}</p>
    </div>
  );
}

function Benefit({ text }: any) {
  return (
    <div className="flex items-center gap-3 text-sm text-slate-300">
      <span className="text-emerald-400">✅</span>
      <span>{text}</span>
    </div>
  );
} 