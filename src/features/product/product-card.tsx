"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/cart-store";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUser";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { formatRupiah } from "@/lib/format";

export default function ProductCard({ product, role }: any) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);
  const user = useUserStore((s) => s.user);
  const userId = user?.id || "";

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Yakin ingin menghapus item?")) return;

    const { error } = await supabase.from("products").delete().eq("id", product.id);

    if (error) {
      toast.error("Gagal hapus produk");
      return;
    }

    toast.success("Produk dihapus");
    window.location.reload();
  };

  const handleAddCart = (e: React.MouseEvent) => {
    e.stopPropagation();

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

  return (
    <motion.div
      onClick={() => router.push(`/shop/${product.id}`)}
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-slate-900/80 p-4 shadow-xl shadow-black/20 transition hover:border-blue-400/50"
    >
      <div className="relative mb-4 flex h-44 items-center justify-center overflow-hidden rounded-2xl bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-contain p-5 transition duration-300 group-hover:scale-110"
        />

        {product.stock === 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
            Habis
          </span>
        )}
      </div>

      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="line-clamp-2 text-base font-bold text-white">
            {product.name}
          </h3>
          <p className="mt-1 text-xs text-slate-400">Stok: {product.stock}</p>
        </div>

        {role === "admin" && (
          <button
            onClick={handleDelete}
            className="rounded-full bg-red-500/15 px-3 py-1 text-xs font-semibold text-red-300 hover:bg-red-500 hover:text-white"
          >
            Hapus
          </button>
        )}
      </div>

      <p className="mt-4 text-xl font-black text-orange-400">
        Rp {formatRupiah(product.price)}
      </p>

      <button
        onClick={handleAddCart}
        disabled={product.stock === 0}
        className="mt-4 w-full rounded-2xl bg-blue-600 py-3 text-sm font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
      >
        {product.stock === 0 ? "Stok Habis" : "+ Keranjang"}
      </button>
    </motion.div>
  );
}