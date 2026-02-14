import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function POST(req) {
  try {
    const { suggestion } = await req.json();

    if (!suggestion || suggestion.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: "Suggestion cannot be empty" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Send email
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: "New Lyra Suggestion",
      html: `
        <h2>New Suggestion</h2>
        <p>${suggestion.split("\n").join("<br>")}</p>
        <p style="color: #666; font-size: 12px;">Sent at ${new Date().toLocaleString()}</p>
      `,
    });

    console.log("[Lyra] Suggestion sent via email:", suggestion);

    return new Response(
      JSON.stringify({ success: true, message: "Suggestion sent" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[Lyra] Error processing suggestion:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process suggestion" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
