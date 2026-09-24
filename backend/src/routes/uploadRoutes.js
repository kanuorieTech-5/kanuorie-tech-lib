const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const upload = require("../middleware/upload");
const assessmentUpload = require("../middleware/assessmentUpload");
const {
  uploadImage,
  uploadAssessmentFile,
  deleteImage,
} = require("../controllers/uploadController");

/* ==========================================
   IMAGE UPLOAD
   Admin only
========================================== */

router.post(
  "/image",
  protect,
  adminOnly,
  upload.single("image"),
  uploadImage
);

/* ==========================================
   ASSESSMENT FILE UPLOAD
   Authenticated learners
========================================== */

router.post(
  "/assessment",
  protect,
  assessmentUpload.single("file"),
  uploadAssessmentFile
);

/* ==========================================
   IMAGE / FILE DELETE
   Admin only
========================================== */

router.delete(
  "/:publicId",
  protect,
  adminOnly,
  deleteImage
);

module.exports = router;