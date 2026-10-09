const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");
const upload = require("../middleware/upload");

const validate = require("../validators/validate");

const {
  createTeamValidator,
  updateTeamValidator,
} = require("../validators/teamValidator");

const {
  createTeamMember,
  getTeamMembers,
  getTeamMember,
  deleteTeamMember,
  updateTeamMember,
  getFeaturedMembers,
  getTeamStats,
} = require("../controllers/teamController");

/* =========================
   PUBLIC ROUTES
========================= */

router.get("/", getTeamMembers);

router.get("/featured", getFeaturedMembers);

/* =========================
   ADMIN STATISTICS
========================= */

router.get(
  "/stats",
  protect,
  admin,
  getTeamStats
);

/* =========================
   PUBLIC SINGLE MEMBER
========================= */

router.get("/:id", getTeamMember);

/* =========================
   ADMIN CREATE
========================= */

router.post(
  "/",
  protect,
  admin,
  upload.single("image"),
  createTeamValidator,
  validate,
  createTeamMember
);

/* =========================
   ADMIN UPDATE
========================= */

router.put(
  "/:id",
  protect,
  admin,
  upload.single("image"),
  updateTeamValidator,
  validate,
  updateTeamMember
);

/* =========================
   ADMIN DELETE
========================= */

router.delete(
  "/:id",
  protect,
  admin,
  deleteTeamMember
);

module.exports = router;