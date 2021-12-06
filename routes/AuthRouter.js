const express = require("express");
const router = express.Router();
const authGuard = require("../middleware/AuthGuard");

const { login, generateOtp, logout } = require("../controllers/AuthController");

router.get("/", function (req, res) {
  return res.send(`User service v1.0<p>End points</p>`);
});

router.post("/get-login-otp", generateOtp);

router.post("/login", login);

router.get("/logout", authGuard.verify, logout);

router.get("/*", function (req, res) {
  return res.sendStatus(404);
});

module.exports = router;
