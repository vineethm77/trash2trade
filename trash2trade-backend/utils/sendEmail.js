import nodemailer from "nodemailer";

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📨 SMTP FUNCTION CALLED");
    console.log("➡️ TO:", to);
    console.log("➡️ SUBJECT:", subject);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    const info = await transporter.sendMail({
      from: `"Trash2Trade" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: subject,
      html,
    });

    console.log("✅ EMAIL SENT");
    console.log("📧 MESSAGE ID:", info.messageId);
  } catch (error) {
    console.error("❌ SMTP ERROR:", error.message);
    throw error;
  }
};

export default sendEmail;
