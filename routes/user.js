const express = require("express");
const { register } = require("../controllers/usercontroller");
const router = express.Router();

// router.use(function timeLog(req, res, next) {
//   console.log("Time: ", Date.now());
//   next();
// });

router.get("/", function (req, res) {
  return res.send(`User service v1.0<p>End points</p>`);
});

router.post("/register", register);

module.exports = router;
