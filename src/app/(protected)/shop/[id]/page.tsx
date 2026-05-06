"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCartStore } from "@/features/cart/cart-store";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useUserStore } from "@/store/useUser";
import { formatRupiah } from "@/lib/format";

export default function Page() {
  const { addToCart } = useCartStore();
  const params = useParams();
  const router = useRouter();
  const { user } = useUserStore();

  const [product, setProduct] = useState<any>(null);
  const [userId, setUserId] = useState("");
  const [activeImage, setActiveImage] = useState("");

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

      setActiveImage(data?.image);
    };

    init();
  }, [params]);

  if (!product) return <p className="p-6">Loading...</p>;

  const handleDelete = async () => {
    if (!confirm("Yakin ingin menghapus produk ini?")) return;

    await supabase.from("products").delete().eq("id", product.id);

    toast.success("Produk dihapus");
    router.push("/shop");
  };

  return (
    <div className="p-6">
      <img src={activeImage} className="w-full h-64 object-contain" />

      <h1 className="text-2xl font-bold mt-4">{product.name}</h1>

      <p className="text-orange-500">Rp {formatRupiah(product.price)}</p>

      <p>Stock: {product.stock}</p>

      <div className="flex gap-3 mt-6">
        <button
          disabled={product.stock === 0}
          onClick={() => {
            addToCart(product, userId);

            const el = document.createElement("div");
            el.innerText = "🛒 +1";
            el.className =
              "fixed bottom-10 right-10 text-white bg-blue-500 px-3 py-1 rounded animate-bounce z-50";

            document.body.appendChild(el);

            setTimeout(() => {
              document.body.removeChild(el);
            }, 800);
          }}
          className={`flex-1 py-3 rounded ${
            product.stock === 0
              ? "bg-gray-400"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {product.stock === 0 ? "Habis" : "+ Keranjang"}
        </button>

        {user?.role === "admin" && (
          <button onClick={handleDelete} className="bg-red-500 px-4 rounded">
            Hapus
          </button>
        )}
      </div>
    </div>
  );
}
