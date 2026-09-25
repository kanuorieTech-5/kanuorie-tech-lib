const crypto = require("crypto");

const Affiliate = require("../models/Affiliate");

/* ==========================================
   GENERATE UNIQUE REFERRAL CODE
========================================== */

const generateReferralCode = async (
  firstName = "USER"
) => {
  const base = String(firstName)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 8) || "USER";

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const randomPart = crypto
      .randomBytes(3)
      .toString("hex")
      .toUpperCase();

    const referralCode = `${base}${randomPart}`;

    const exists = await Affiliate.exists({
      referralCode,
    });

    if (!exists) {
      return referralCode;
    }
  }

  throw new Error(
    "Unable to generate a unique affiliate referral code."
  );
};

/* ==========================================
   MASK ACCOUNT NUMBER
========================================== */

const maskAccountNumber = (accountNumber = "") => {
  if (!accountNumber) return "";

  const value = String(accountNumber);

  if (value.length <= 4) {
    return value;
  }

  return `${"*".repeat(
    Math.max(value.length - 4, 0)
  )}${value.slice(-4)}`;
};

/* ==========================================
   FORMAT PAYOUT DETAILS
========================================== */

const formatPayoutDetails = (details = {}) => ({
  accountName: details.accountName || "",
  accountNumber: maskAccountNumber(
    details.accountNumber
  ),
  bankName: details.bankName || "",
  bankCode: details.bankCode || "",
  paypalEmail: details.paypalEmail || "",
});

module.exports = {
  generateReferralCode,
  maskAccountNumber,
  formatPayoutDetails,
};
