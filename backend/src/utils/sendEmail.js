const { Resend } = require("resend");

let resendClient;

const getResendClient = () => {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY is missing from environment variables.");
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
};

const sendEmail = async ({ to, subject, text, html }) => {
  const from = process.env.RESEND_FROM;

  if (!from) {
    throw new Error("RESEND_FROM is missing from environment variables.");
  }

  if (!to || !subject || (!text && !html)) {
    throw new Error(
      "Email recipient, subject, and message content are required."
    );
  }

  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from,
    to: Array.isArray(to) ? to : [to],
    subject,
    ...(text ? { text } : {}),
    ...(html ? { html } : {}),
  });

  if (error) {
    console.error("Resend email delivery failed:", {
      name: error.name,
      message: error.message,
      statusCode: error.statusCode,
    });

    throw new Error("Unable to send email through Resend.");
  }

  return data;
};

module.exports = sendEmail;