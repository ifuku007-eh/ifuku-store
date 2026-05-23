"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import ProductCard from "@/features/product/product-card";
import CartSidebar from "@/components/CartSidebar";

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

      const { data } = await supabase
        .from("products")
        .select("*")
        .order("price", { ascending: true });

      setProducts(data || []);
    };

    init();
  }, []);

  const hotItems = useMemo(
    () =>
      products.filter((p) =>
        ["86 Diamonds", "172 Diamonds", "257 Diamonds"].includes(p.name)
      ),
    [products]
  );

  const weekly = products.filter((p) => p.category === "weekly");
  const diamonds = products.filter((p) => p.category === "diamond");

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <section className="relative overflow-hidden border-b border-white/10 px-4 py-10 sm:px-6 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,#2563eb55,transparent_35%),radial-gradient(circle_at_top_right,#f9731650,transparent_30%)]" />

        <div className="relative mx-auto max-w-7xl">
          <p className="mb-3 inline-flex rounded-full border border-blue-400/30 bg-blue-500/10 px-4 py-1 text-sm text-blue-200">
            Top Up MLBB Aman • Instan • Murah
          </p>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">
            Ifuku MLBB Store ⚡
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
            Beli diamond dan Weekly Diamond Pass dengan tampilan lebih modern,
            cepat, dan nyaman digunakan di HP.
          </p>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-10">
        <div className="space-y-8">
          <Section title="🔥 Produk Terlaris" subtitle="Pilihan paling sering dibeli">
            {hotItems.map((p) => (
              <ProductCard key={p.id} product={p} role={role} />
            ))}
          </Section>

          <Section title="⚡ Weekly Diamond Pass" subtitle="Cocok untuk hemat jangka panjang">
            {weekly.map((p) => (
              <ProductCard key={p.id} product={p} role={role} />
            ))}
          </Section>

          <Section title="💎 Daftar Diamond" subtitle="Pilih nominal sesuai kebutuhan">
            {diamonds.map((p) => (
              <ProductCard key={p.id} product={p} role={role} />
            ))}
          </Section>
        </div>

        <div className="lg:sticky lg:top-24 lg:h-fit">
          <CartSidebar />
        </div>
      </main>
    </div>
  );
}

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 backdrop-blur sm:p-6">
      <div className="mb-5 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <h2 className="text-xl font-bold">{title}</h2>
          <p className="text-sm text-slate-400">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {children}
      </div>
    </section>
  );
}