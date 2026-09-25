const express = require("express");

const {
  getAffiliateDashboard,
  activateAffiliate,
  trackReferralClick,
  getAffiliateReferrals,
  getAffiliateEarnings,
  getAffiliatePayouts,
  updatePayoutInformation,
  requestAffiliatePayout,
} = require("../controllers/affiliateController");

const protect = require("../middleware/auth");

const router = express.Router();

/* ==========================================
   PUBLIC REFERRAL TRACKING
========================================== */

router.post(
  "/referral",
  trackReferralClick
);

/* ==========================================
   AUTHENTICATED AFFILIATE
========================================== */

router.get(
  "/",
  protect,
  getAffiliateDashboard
);

router.post(
  "/activate",
  protect,
  activateAffiliate
);

router.get(
  "/referrals",
  protect,
  getAffiliateReferrals
);

router.get(
  "/earnings",
  protect,
  getAffiliateEarnings
);

router.get(
  "/payouts",
  protect,
  getAffiliatePayouts
);

router.put(
  "/payout",
  protect,
  updatePayoutInformation
);

router.post(
  "/payout",
  protect,
  requestAffiliatePayout
);

module.exports = router;
