const express = require("express");
const { register, editProfile } = require("../controllers/EmployeeController");
const router = express.Router();
const authGuard = require("../middleware/AuthGuard");

router.get("/", function (req, res) {
  return res.send(`User service v1.0<p>End points</p>`);
});

router.post("/register", authGuard.verify, register);
router.post("/edit-profile", authGuard.verify, editProfile);

module.exports = router;
