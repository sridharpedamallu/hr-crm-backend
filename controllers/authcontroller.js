const db = require("../models");
const { User } = db;
const Op = db.Sequelize.Op;
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const OTP = require("../models/otp");
const Logins = require("../models/login");

const emailApi = require("../middleware/email");

exports.generateOtp = async (req, res) => {
  const { loginName } = { ...req.body };
  const otpExpiryMinutes = 5;

  if (!loginName) {
    return res.sendStatus(400);
  }

  const user = await User.findOne({
    where: { [Op.or]: { email: loginName, phone: loginName } },
  });

  if (!user) {
    return res.sendStatus(404);
  }

  if (!user.emailConfirmed) {
    return res.status(500).send("Account not activated yet");
  }

  if (!user.isActive) {
    return res.status(500).send("Account is blocked / not active");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const d = new Date();
  d.setMinutes(d.getMinutes() + otpExpiryMinutes);

  const otpEntry = new OTP({
    userId: user.uuid,
    otp,
    expire: d,
  });

  await otpEntry.save();

  emailApi.sendEmail({
    to: user.email,
    body: otp,
    template: "LoginOtpTemplate",
  });

  return res.json({ otpExpiryMinutes, user: user.uuid });
};

exports.login = async (req, res) => {
  const { user, otp } = { ...req.body };
  if (!user || !otp) {
    return res.sendStatus(400);
  }

  const loginData = await OTP.findOne({ userId: user, otp });

  if (!loginData || loginData.expire < new Date()) {
    return res.status(400).send("Invalid OTP or Invalid request");
  }

  const userData = await User.findOne({ where: { uuid: user } });

  let payload = {
    id: userData.uuid,
    email: userData.email,
    phone: userData.phone,
  };
  let accessToken = jwt.sign(
    {
      data: payload,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  await Logins.deleteMany({
    where: {
      userId: userData.id,
    },
  });
  const loginDetails = new Logins({
    userId: userData.id,
    userUuid: userData.uuid,
    accessToken,
  });
  await loginDetails.save();

  return res.send({
    message: "success",
    user: {
      firstName: userData.firstName,
      lastName: userData.lastName,
    },
    accessToken,
  });
};

exports.logout = async (req, res) => {
  await Logins.deleteMany({ userId: req.user.id });
  return res.send("logged out");
};
