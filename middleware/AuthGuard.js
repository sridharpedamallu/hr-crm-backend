const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const db = require("../models");
const Logins = require("../models/login");

dotenv.config();
const { User } = db;

exports.verify = function (req, res, next) {
  if (!req.headers.authorization) {
    return res.sendStatus(401);
  }

  let accessToken = req.headers.authorization.split(" ", 2)[1];

  if (!accessToken) {
    return res.sendStatus(403);
  }

  let payload;
  try {
    payload = jwt.verify(
      accessToken,
      process.env.ACCESS_TOKEN_SECRET,
      async (err, user) => {
        if (err) return res.sendStatus(403);
        const loggedInUser = await User.findOne({
          where: { uuid: user.data.id },
        });
        if (!loggedInUser) {
          res.sendStatus(401);
        }
        const checkLogin = await Logins.findOne({
          userId: loggedInUser.id,
          accessToken,
        });
        if (!checkLogin) {
          res.status(401).send("User logged out");
        }
        req.user = loggedInUser;
        next();
      }
    );
  } catch (e) {
    res.sendStatus(401);
  }
};
