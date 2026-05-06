"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatRupiah } from "@/lib/format";
import { useUserStore } from "@/store/useUser";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const user = useUserStore((s) => s.user);
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [loadingRole, setLoadingRole] = useState(true);

  const [tab, setTab] = useState<"products" | "orders">("products");

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("diamond");

  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // 🔥 FETCH ROLE (FIX UTAMA)
  useEffect(() => {
    const fetchRole = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      setRole(data?.role || null);
      setLoadingRole(false);
    };

    fetchRole();
  }, [user]);

  // 🔥 PROTECT ADMIN (FIX LOOP)
  useEffect(() => {
    if (!user) return;

    if (!loadingRole && role !== "admin") {
      router.replace("/shop");
    }
  }, [user, role, loadingRole, router]);

  // 🔥 FETCH PRODUCTS
  const fetchProducts = async () => {
    const { data } = await supabase.from("products").select("*");
    setProducts(data || []);
  };

  // 🔥 FETCH ORDERS
  const fetchOrders = async () => {
    setLoadingOrders(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setOrders(data || []);
    setLoadingOrders(false);
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  // 🔥 ADD PRODUCT
  const addProduct = async () => {
    if (!name || !price || !stock) {
      alert("Semua field wajib diisi");
      return;
    }

    await supabase.from("products").insert([
      {
        name,
        price,
        stock,
        category,
        image:
          category === "diamond"
            ? "https://tqotaizeecarmwdtklex.supabase.co/storage/v1/object/public/product/Diamond.jpeg"
            : "https://tqotaizeecarmwdtklex.supabase.co/storage/v1/object/public/product/Weekly%20Diamond%20Pass.jpeg",
      },
    ]);

    alert("Produk berhasil ditambahkan ✅");

    setName("");
    setPrice(0);
    setStock(0);

    fetchProducts();
  };

  // 🔥 RESTOCK
  const restock = async (id: string) => {
    const { data } = await supabase
      .from("products")
      .select("stock")
      .eq("id", id)
      .single();

    if (!data) return;

    await supabase
      .from("products")
      .update({ stock: (data.stock || 0) + 10 })
      .eq("id", id);

    fetchProducts();
  };

  // 🔥 LOADING GUARD (WAJIB)
  if (!user || loadingRole) {
    return <p className="p-6">Loading...</p>;
  }

  return (
    <div className="p-6 bg-white dark:bg-[#0f172a] min-h-screen text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-6">⚙️ Admin Panel</h1>

      {/* 🔥 TAB */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded ${
            tab === "products"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-[#1e293b]"
          }`}
        >
          Products
        </button>

        <button
          onClick={() => setTab("orders")}
          className={`px-4 py-2 rounded ${
            tab === "orders"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 dark:bg-[#1e293b]"
          }`}
        >
          Orders
        </button>
      </div>

      {/* 🔥 PRODUCTS */}
      {tab === "products" && (
        <>
          <div className="bg-gray-100 dark:bg-[#1e293b] p-6 rounded-xl mb-6">
            <h2 className="text-lg font-bold mb-4">Tambah Produk</h2>

            <input
              type="text"
              placeholder="Nama Item"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mb-3 p-2 rounded bg-white dark:bg-[#0f172a]"
            />

            <input
              type="number"
              placeholder="Harga"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="w-full mb-3 p-2 rounded bg-white dark:bg-[#0f172a]"
            />

            <input
              type="number"
              placeholder="Stock"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              className="w-full mb-3 p-2 rounded bg-white dark:bg-[#0f172a]"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full mb-4 p-2 rounded bg-white dark:bg-[#0f172a]"
            >
              <option value="diamond">Diamond</option>
              <option value="weekly">Weekly</option>
            </select>

            <button
              onClick={addProduct}
              className="w-full bg-blue-500 py-2 rounded"
            >
              + Tambah Produk
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-gray-100 dark:bg-[#1e293b] p-4 rounded-xl"
              >
                <h2>{product.name}</h2>
                <p>Rp {formatRupiah(product.price)}</p>
                <p>Stock: {product.stock}</p>

                <button
                  onClick={() => restock(product.id)}
                  className="mt-2 bg-blue-500 px-3 py-1 rounded"
                >
                  Restock +10
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* 🔥 ORDERS */}
      {tab === "orders" && (
        <div className="overflow-x-auto">
          {loadingOrders ? (
            <p>Loading...</p>
          ) : (
            <table className="w-full text-sm border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden table-fixed">
              <thead className="bg-gray-200 dark:bg-[#1e293b] text-left">
                <tr>
                  <th className="p-3 w-[180px]">User</th>
                  <th className="p-3 w-[220px]">Email</th>
                  <th className="p-3 w-[140px]">Total</th>
                  <th className="p-3 w-[120px] text-center">Status</th>
                  <th className="p-3 w-[200px]">Tanggal</th>
                </tr>
              </thead>

              <tbody>
                {orders.map((o) => {
                  const isSuccess = !!o.redeem_code;

                  return (
                    <tr
                      key={o.id}
                      className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-[#1e293b]"
                    >
                      <td className="p-3 truncate">{o.user_id}</td>
                      <td className="p-3 truncate">{o.email || "-"}</td>
                      <td className="p-3 font-semibold text-orange-500">
                        Rp {formatRupiah(o.total)}
                      </td>
                      <td className="p-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            isSuccess
                              ? "bg-green-500 text-white"
                              : "bg-yellow-400 text-black"
                          }`}
                        >
                          {isSuccess ? "DONE" : "PENDING"}
                        </span>
                      </td>
                      <td className="p-3 text-sm text-gray-500">
                        {new Date(o.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}