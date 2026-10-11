const nodemailer = require("nodemailer");

const createEmailTransporter = () => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
  } = process.env;

  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    throw new Error(
      "Email configuration is incomplete. Check SMTP_HOST, SMTP_USER, and SMTP_PASS."
    );
  }

  const port = Number(SMTP_PORT || 587);

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,

    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },

    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 60000,

    logger: false,
    debug: false,
  });
};

module.exports = createEmailTransporter;