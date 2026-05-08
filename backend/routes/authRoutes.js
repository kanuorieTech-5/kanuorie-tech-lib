const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { loginUser, registerUser } = require("../../frontend/src/api/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);
module.exports = router;