import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." },
        { status: 400 }
      );
    }

    const toEmail = process.env.CONTACT_TO_EMAIL || "mohammedflow.dev@gmail.com";

    const data = await resend.emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: [toEmail],
      replyTo: email,
      subject: subject?.trim()
        ? `[Portfolio Contact] ${subject}`
        : `New Message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e7e5e4; border-radius: 12px; background-color: #fafaf9; color: #1c1917;">
          <h2 style="margin-top: 0; color: #1c1917; font-size: 22px; border-bottom: 2px solid #ea580c; padding-bottom: 12px;">New Contact Form Message</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
            <tr>
              <td style="padding: 8px 0; color: #78716c; font-weight: 600; width: 100px;">Name:</td>
              <td style="padding: 8px 0; color: #1c1917;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; color: #78716c; font-weight: 600;">Email:</td>
              <td style="padding: 8px 0; color: #1c1917;"><a href="mailto:${email}" style="color: #ea580c; text-decoration: none;">${email}</a></td>
            </tr>
            ${
              subject
                ? `<tr>
              <td style="padding: 8px 0; color: #78716c; font-weight: 600;">Subject:</td>
              <td style="padding: 8px 0; color: #1c1917;">${subject}</td>
            </tr>`
                : ""
            }
          </table>
          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px dashed #d6d3d1;">
            <div style="font-weight: 600; color: #78716c; margin-bottom: 8px;">Message:</div>
            <p style="white-space: pre-wrap; line-height: 1.6; color: #1c1917; background-color: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e7e5e4;">${message}</p>
          </div>
        </div>
      `,
    });

    if (data.error) {
      console.error("Resend API Error:", data.error);
      return NextResponse.json(
        { error: data.error.message || "Failed to send email." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, id: data.data?.id });
  } catch (error: unknown) {
    console.error("Contact API Server Error:", error);
    const message = error instanceof Error ? error.message : "Internal server error.";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}

