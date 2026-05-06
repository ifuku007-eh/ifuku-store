"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/features/cart/cart-store";
import { useUserStore } from "@/store/useUser";

export default function FloatingCart() {
  const router = useRouter();

  const cart = useCartStore((s) => s.cart);
  const user = useUserStore((s) => s.user);

  // 🔥 kalau belum login → jangan tampilkan
  if (!user) return null;

  const totalItems = cart.reduce(
    (sum: number, i: any) => sum + i.quantity,
    0
  );

  if (totalItems === 0) return null;

  return (
    <div
      onClick={() => router.push("/cart")}
      className="fixed bottom-6 right-6 z-50 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow cursor-pointer transition transform hover:scale-110 active:scale-95"
    >
      🛒
      <span className="absolute -top-2 -right-2 bg-red-500 text-xs px-2 py-0.5 rounded-full">
        {totalItems}
      </span>
    </div>
  );
}