"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { formatRupiah } from "@/lib/format";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) setUserId(data.user.id);
    };
    init();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetch = async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId);

      setOrders(data || []);
    };

    fetch();
  }, [userId]);

  return (
    <div className="p-6">
      {orders.map((o) => (
        <div key={o.id}>
          <p>{o.id}</p>
          <p>Rp {formatRupiah(o.total)}</p>
          <p>{o.redeem_code}</p>
        </div>
      ))}
    </div>
  );
}