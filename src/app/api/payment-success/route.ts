import { NextResponse } from "next/server";
import { supabaseAdmin as supabase } from "@/lib/supabase-server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

function generateCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, items, total, userId, orderId } = body;

    if (!email || !userId || !items || !orderId) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    // 🔍 CARI order by order_id (text) → dapatkan id (uuid) untuk FK
    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("id, status, redeem_code")
      .eq("order_id", orderId)
      .single();

    if (orderError || !orderData) {
      return NextResponse.json(
        { error: "Order tidak ditemukan" },
        { status: 404 }
      );
    }

    // ✅ IDEMPOTENCY — sudah diproses sebelumnya
    if (orderData.status === "success") {
      return NextResponse.json({ code: orderData.redeem_code || "OK" });
    }

    const orderUuid = orderData.id; // ← ini yang dipakai sebagai FK di order_items

    // 🔒 LOCK — cegah race condition
    const { error: lockError } = await supabase
      .from("orders")
      .update({ status: "processing" })
      .eq("order_id", orderId)
      .eq("status", "pending");

    if (lockError) {
      return NextResponse.json(
        { error: "Order sedang diproses, coba lagi" },
        { status: 409 }
      );
    }

    let codes: string[] = [];

    for (const item of items) {
      // 📉 ATOMIC STOCK
      const { data: success, error: rpcError } = await supabase.rpc(
        "decrement_stock",
        {
          product_id: item.id,
          qty: item.quantity,
        }
      );

      if (rpcError || !success) {
        await supabase
          .from("orders")
          .update({ status: "pending" })
          .eq("order_id", orderId);

        return NextResponse.json(
          { error: `Stock ${item.name} habis` },
          { status: 400 }
        );
      }

      const code = generateCode();
      codes.push(code);

      // 💾 INSERT dengan orderUuid (uuid), bukan orderId (text)
      const { error: insertError } = await supabase
        .from("order_items")
        .insert({
          order_id: orderUuid,   // ✅ uuid — sesuai FK ke orders.id
          product_id: item.id,
          quantity: item.quantity,
          price: item.price,
          redeem_code: code,
        });

      if (insertError) {
        console.error("INSERT ERROR:", insertError);
        await supabase
          .from("orders")
          .update({ status: "pending" })
          .eq("order_id", orderId);

        return NextResponse.json(
          { error: insertError.message },
          { status: 500 }
        );
      }
    }

    // ✅ UPDATE STATUS + simpan kode
    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "success",
        redeem_code: codes.join(", "),
      })
      .eq("order_id", orderId);

    if (updateError) {
      return NextResponse.json(
        { error: updateError.message },
        { status: 500 }
      );
    }

    // 📧 EMAIL
    try {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: email,
        subject: "Redeem Code Kamu 🎮",
        html: `
          <h2>Terima kasih sudah membeli 🎉</h2>
          <p>Jangan bagikan kode ini!</p>
          <h3>${codes.join("<br/>")}</h3>
        `,
      });
    } catch (err) {
      console.error("EMAIL ERROR:", err);
    }

    return NextResponse.json({ code: codes.join(", ") });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}