const express = require("express");

const {
  getMyCertificates,
  getMyCertificate,
  verifyCertificate,
} = require("../controllers/certificateController");

const protect = require("../middleware/auth");

const router = express.Router();

/* ==========================================
   PUBLIC CERTIFICATE VERIFICATION

   MUST COME BEFORE /:certificateId
========================================== */

router.get(
  "/verify/:certificateId",
  verifyCertificate
);

/* ==========================================
   AUTHENTICATED CERTIFICATES
========================================== */

router.get(
  "/",
  protect,
  getMyCertificates
);

router.get(
  "/:certificateId",
  protect,
  getMyCertificate
);

module.exports = router;
