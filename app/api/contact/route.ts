import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const TO_EMAIL = process.env.CONTACT_EMAIL!;
    const RESEND_KEY = process.env.RESEND_API_KEY!;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${RESEND_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Free tier: from must be onboarding@resend.dev, to must be YOUR email
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [TO_EMAIL],
        reply_to: email,  // visitor reply karanna easy
        subject: subject
          ? `[Portfolio] ${subject}`
          : `[Portfolio] Message from ${name}`,
        html: `
          <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px">
            <h2 style="color:#6366f1;margin-bottom:4px">📬 New message from your portfolio</h2>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ""}
            <p><strong>Message:</strong></p>
            <div style="background:#f9fafb;border-left:4px solid #6366f1;padding:16px;border-radius:4px;white-space:pre-wrap">${message}</div>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:16px 0"/>
            <p style="color:#6b7280;font-size:12px">
              Reply to this email to respond to ${name} at ${email}
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      console.error("Resend error:", err);
      return NextResponse.json({ error: "Failed to send" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}