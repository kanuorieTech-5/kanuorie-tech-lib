const express = require("express");

const {
  getPublicOpportunities,
  getPublicOpportunity,
} = require("../controllers/opportunityController");

const router = express.Router();

router.get("/", getPublicOpportunities);
router.get("/:id", getPublicOpportunity);

module.exports = router;