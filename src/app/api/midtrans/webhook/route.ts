import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabase } from "@/lib/supabase";
import { generateRedeemCode } from "@/lib/redeem";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const body = await req.json();

  // 🔒 VALIDASI MIDTRANS
  const signature = crypto
    .createHash("sha512")
    .update(
      body.order_id +
        body.status_code +
        body.gross_amount +
        process.env.MIDTRANS_SERVER_KEY
    )
    .digest("hex");

  if (signature !== body.signature_key) {
    return NextResponse.json({ message: "Invalid" }, { status: 403 });
  }

  // ✅ SUCCESS PAYMENT
  if (body.transaction_status === "settlement") {
    const metadata = body?.metadata || {};
const items = metadata?.items || [];

    let codes: string[] = [];

    for (const item of items) {
  const code = generateRedeemCode();
  codes.push(code);

      await supabase.from("orders").insert({
        user_id: metadata.userId,
        product_id: item.id,
        quantity: item.quantity,
        total: item.price * item.quantity,
        redeem_code: code,
        status: "success",
        payment_method: "midtrans",
      });
    }

    // 📧 KIRIM EMAIL
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: body.customer_details.email,
      subject: "Kode Redeem MLBB",
      html: `
        <h2>Terima kasih sudah membeli 🎉</h2>
        <p>Jangan bagikan kode ini ke siapapun!</p>
        <h3>${codes.join("<br/>")}</h3>
        <p>Kode hanya bisa digunakan 1x</p>
      `,
    });
  }

  return NextResponse.json({ message: "Webhook OK" });
}