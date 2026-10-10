import API from "./axiosApi";

/* ==========================================
   AFFILIATE DASHBOARD
========================================== */

export const getAffiliateDashboard = async () => {
  const { data } = await API.get("/affiliate");
  return data;
};

export const activateAffiliate = async () => {
  const { data } = await API.post("/affiliate/activate");
  return data;
};

/* ==========================================
   REFERRALS
========================================== */

export const trackReferralClick = async (referralCode) => {
  const { data } = await API.post("/affiliate/referral", {
    referralCode,
  });

  return data;
};

export const getAffiliateReferrals = async (params = {}) => {
  const { data } = await API.get("/affiliate/referrals", {
    params,
  });

  return data;
};

/* ==========================================
   EARNINGS
========================================== */

export const getAffiliateEarnings = async () => {
  const { data } = await API.get("/affiliate/earnings");
  return data;
};

/* ==========================================
   PAYOUTS
========================================== */

export const getAffiliatePayouts = async () => {
  const { data } = await API.get("/affiliate/payouts");
  return data;
};

export const updateAffiliatePayout = async (
  payoutMethod,
  payoutDetails
) => {
  const { data } = await API.put("/affiliate/payout", {
    payoutMethod,
    payoutDetails,
  });

  return data;
};

export const requestAffiliatePayout = async () => {
  const { data } = await API.post("/affiliate/payout");
  return data;
};

export default {
  getAffiliateDashboard,
  activateAffiliate,
  trackReferralClick,
  getAffiliateReferrals,
  getAffiliateEarnings,
  getAffiliatePayouts,
  updateAffiliatePayout,
  requestAffiliatePayout,
};