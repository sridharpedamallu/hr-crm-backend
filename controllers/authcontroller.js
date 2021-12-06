const db = require("../models");
const { User } = db;
const Op = db.Sequelize.Op;

const Login = require("../models/login");

const email = require("../middleware/email");

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

  const loginEntry = new Login({
    userId: user.uuid,
    otp,
    expire: d,
  });

  await loginEntry.save();

  email.sendEmail({ to: user.email, body: otp, template: "LoginOtpTemplate" });

  return res.json({ otpExpiryMinutes, user: user.uuid });
};
exports.login = async (req, res) => {
  const { user, otp } = { ...req.body };
  if (!user || !otp) {
    return res.sendStatus(400);
  }

  const loginData = await Login.findOne({ userId: user, otp });

  if (!loginData || loginData.expire < new Date()) {
    return res.status(400).send("Invalid OTP or Invalid request");
  }

  return res.send(loginData);
};
