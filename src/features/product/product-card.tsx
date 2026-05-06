"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/cart-store";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUser";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

export default function ProductCard({ product, role }: any) {
  const router = useRouter();
  const addToCart = useCartStore((s) => s.addToCart);

  const user = useUserStore((s) => s.user);
  const userId = user?.id || "";

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm("Yakin ingin menghapus item?")) return;

    try {
      const { error } = await supabase
        .from("products")
        .delete()
        .eq("id", product.id);

      if (error) throw error;

      toast.success("Produk dihapus");
      window.location.reload();
    } catch {
      toast.error("Gagal hapus produk");
    }
  };

  return (
    <motion.div
      onClick={() => router.push(`/shop/${product.id}`)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.97 }}
      className="bg-white dark:bg-[#1e293b] rounded-xl p-4 shadow hover:shadow-xl transition cursor-pointer border border-gray-200 dark:border-gray-800"
    >
      <img
        src={product.image}
        className="w-full h-32 object-contain mb-3 rounded"
      />

      <div className="flex justify-between items-start gap-2">
        <h2 className="text-sm font-semibold line-clamp-2">
          {product.name}
        </h2>

        {role === "admin" && (
          <button
            onClick={handleDelete}
            className="text-xs bg-red-500 text-white px-2 py-1 rounded"
          >
            Hapus
          </button>
        )}
      </div>

      <p className="text-orange-500 font-bold mt-2">
        Rp {product.price.toLocaleString()}
      </p>

      <p className="text-xs text-gray-500">
        Stok: {product.stock}
      </p>

      <button
        onClick={(e) => {
          e.stopPropagation(); // 🔥 FIX redirect bug

          if (!userId) {
            toast.error("Login dulu");
            return;
          }

          addToCart(product, userId);

          toast.success("Masuk ke keranjang 🛒", {
            style: {
              borderRadius: "10px",
              background: "#333",
              color: "#fff",
            },
          });
        }}
        className="mt-3 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-lg transition"
      >
        + Keranjang
      </button>
    </motion.div>
  );
}