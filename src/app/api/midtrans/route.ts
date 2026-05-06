import { NextResponse } from "next/server";
import midtransClient from "midtrans-client";
import { supabase } from "@/lib/supabase";

export async function POST(req: Request) {
  try {
    const { total, email, items, userId } = await req.json();

    if (!email || !userId || !items) {
      return NextResponse.json(
        { error: "Data tidak lengkap" },
        { status: 400 }
      );
    }

    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY!,
    });

    const orderId = "ORDER-" + Date.now();

    // 🔥 SIMPAN PENDING DULU
    const { error: insertError } = await supabase.from("orders").insert({
      user_id: userId,
      order_id: orderId,
      email,
      total,
      status: "pending",
    });

    if (insertError) {
      return NextResponse.json(
        { error: insertError.message },
        { status: 500 }
      );
    }

    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: total,
      },
      customer_details: {
        email,
      },
    });

    return NextResponse.json({
      token: transaction.token,
      orderId : orderId,
    });
  } catch (err: any) {
    console.error("MIDTRANS ERROR:", err);

    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}