const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

const validate = require("../validators/validate");

const {
  createTeamValidator,
  updateTeamValidator,
} = require("../validators/teamValidator");

const {
  createTeamMember,
  getTeamMembers,
  getTeamMember,
  updateTeamMember,
  deleteTeamMember,
  getFeaturedMembers,
} = require("../controllers/teamController");

/* =========================
   PUBLIC ROUTES
========================= */

router.get("/", getTeamMembers);

router.get("/featured", getFeaturedMembers);

router.get("/:id", getTeamMember);

/* =========================
   ADMIN ROUTES
========================= */

router.post(
  "/",
  protect,
  admin,
  createTeamValidator,
  validate,
  createTeamMember
);

router.put(
  "/:id",
  protect,
  admin,
  updateTeamValidator,
  validate,
  updateTeamMember
);

router.delete(
  "/:id",
  protect,
  admin,
  deleteTeamMember
);

module.exports = router;