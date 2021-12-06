const express = require("express");
const router = express.Router();

const { login, generateOtp } = require("../controllers/authcontroller");

router.get("/", function (req, res) {
  return res.send(`User service v1.0<p>End points</p>`);
});

router.post("/get-login-otp", generateOtp);

router.post("/login", login);

router.get("/logout", function (req, res) {
  return res.send(`User service v1.0<p>End points</p>`);
});

router.get("/*", function (req, res) {
  return res.sendStatus(404);
});

module.exports = router;
