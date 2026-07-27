const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");
const adminOnly = require("../middleware/admin");
const upload = require("../middleware/upload");

const {
  uploadImage,
  deleteImage,
} = require("../controllers/uploadController");

/* ==========================================
   IMAGE UPLOAD
========================================== */

router.post(
  "/image",
  protect,
  adminOnly,
  upload.single("image"),
  uploadImage
);

/* ==========================================
   IMAGE DELETE
========================================== */

router.delete(
  "/:publicId",
  protect,
  adminOnly,
  deleteImage
);

module.exports = router;