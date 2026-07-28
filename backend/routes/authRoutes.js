const express = require("express");
const router = express.Router();
const verifyToken =
require("../middleware/authMiddleware");

const authController = require("../controllers/authController");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get(
    "/profile",
    verifyToken,
    authController.profile
);
module.exports = router;