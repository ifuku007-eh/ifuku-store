"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/features/product/product-card";
import CartSidebar from "@/components/CartSidebar";
import { redirect } from "next/navigation";

export default function ShopPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [role, setRole] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (userData.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", userData.user.id)
          .single();

        setRole(profile?.role || "");
      }

      const { data } = await supabase.from("products").select("*");
      setProducts(data || []);
    };

    init();
  }, []);

  // 🔥 GROUPING (BALIK NORMAL)
  const hotItems = products.filter((p) =>
    ["86 Diamonds", "172 Diamonds", "257 Diamonds"].includes(p.name),
  );

  const weekly = products.filter((p) => p.category === "weekly");

  const diamonds = products
    .filter((p) => p.category === "diamond")
    .sort((a, b) => a.price - b.price);

  return (
    <div className="min-h-screen p-4 bg-white dark:bg-[#0f172a] text-black dark:text-white">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ifuku MLBB Store ⚡</h1>
        <p className="text-gray-400 text-sm">Aman • Instan • Murah</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Section title="🔥 Produk Terlaris">
            {hotItems.map((p) => (
              <ProductCard key={p.id} product={p} role={role} />
            ))}
          </Section>

          <Section title="⚡ Weekly Diamond Pass">
            {weekly.map((p) => (
              <ProductCard key={p.id} product={p} role={role} />
            ))}
          </Section>

          <Section title="💎 Daftar Diamond">
            {diamonds.map((p) => (
              <ProductCard key={p.id} product={p} role={role} />
            ))}
          </Section>
        </div>

        <CartSidebar />
      </div>
    </div>
  );
}

function Section({ title, children }: any) {
  return (
    <div className="bg-gray-100 dark:bg-[#1e293b] p-4 rounded-xl">
      <h2 className="font-semibold mb-4">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{children}</div>
    </div>
  );
}
