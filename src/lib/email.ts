export async function sendEmail({ to, subject, html }: { to: string; subject: string; html: string }) {
  if (process.env.RESEND_API_KEY) {
    const { Resend } = await import("resend");
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({ from: "AnalogueShifts LMS <no-reply@analogueshifts.com>", to, subject, html });
  } else {
    console.log(`[dev] Email "${subject}" would be sent to ${to}`);
  }
}
