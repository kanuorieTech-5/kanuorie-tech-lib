const express = require("express");

const router = express.Router();

const {
  createProject,
  getProjects,
  getProject,
  updateProject,
  deleteProject,
} = require("../controllers/projectController");

const protect = require("../middleware/auth");
const admin = require("../middleware/admin");

/* ==========================================
   PUBLIC ROUTES
========================================== */

router
  .route("/")
  .get(getProjects)
  .post(
    protect,
    admin,
    createProject
  );

router
  .route("/:id")
  .get(getProject)
  .put(
    protect,
    admin,
    updateProject
  )
  .delete(
    protect,
    admin,
    deleteProject
  );

/* ==========================================
   EXPORT ROUTER
========================================== */

module.exports = router;