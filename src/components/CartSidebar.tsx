"use client";

import { useCartStore } from "@/features/cart/cart-store";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function CartSidebar() {
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

  const total = userCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return (
    <div className="bg-gray-100 dark:bg-[#1e293b] p-4 rounded-xl h-fit sticky top-6">
      <h2 className="font-semibold mb-3">Ringkasan</h2>

      {userCart.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <img src={item.image} className="w-10 h-10 rounded" />

          <div className="flex-1">
            <p className="text-sm">{item.name}</p>
            <p className="text-xs text-gray-400">x{item.quantity}</p>
          </div>
        </div>
      ))}

      <div className="mt-4 border-t pt-2">
        <p>Total: Rp {total.toLocaleString()}</p>
      </div>
    </div>
  );
}
