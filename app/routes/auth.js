const express = require("express");
const authController = require("../controllers/authController.js");

const router = express.Router()

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/admin/login", authController.adminLogin);

const authRoute = router;

module.exports = authRoute;