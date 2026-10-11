const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_FROM,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !SMTP_FROM) {
    throw new Error(
      "Email service is not configured. Check your SMTP environment variables."
    );
  }

  const port = Number(SMTP_PORT || 587);

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });

  return transporter.sendMail({
    from: SMTP_FROM,
    to,
    subject,
    text,
    html,
  });
};

module.exports = sendEmail;