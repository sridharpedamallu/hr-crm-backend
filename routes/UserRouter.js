const express = require("express");
const {
  register,
  confirmEmail,
  editProfile,
} = require("../controllers/UserController");
const router = express.Router();
const authGuard = require("../middleware/AuthGuard");

// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", function (req, res) {
  return res.send(`User service v1.0<p>End points</p>`);
});

router.post("/register", register);
router.post("/confirm-email", confirmEmail);
router.post("/edit-profile", authGuard.verify, editProfile);

module.exports = router;
