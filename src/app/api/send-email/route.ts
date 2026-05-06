import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, code } = await req.json();

  try {
    await resend.emails.send({
      from: "Ifuku Store <onboarding@resend.dev>",
      to: email,
      subject: "Kode Redeem Kamu 🎮",
      html: `
        <h2>Terima kasih telah membeli!</h2>
        <p><b>Kode kamu:</b></p>
        <h1>${code}</h1>
        <p>⚠️ Jangan bagikan kode ini ke siapapun</p>
        <p>Kode hanya bisa digunakan 1x</p>
      `,
    });

    return Response.json({ success: true });
  } catch (err) {
    return Response.json({ error: err });
  }
}