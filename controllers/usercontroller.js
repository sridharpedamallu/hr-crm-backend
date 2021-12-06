const db = require("../models");
const { User } = db;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require("uuid");
const emailApi = require("../middleware/email");
const validator = require("validator");
const OTP = require("../models/otp");

exports.register = async (req, res) => {
  const { firstName, lastName, email, phone, userType } = { ...req.body };

  if (!firstName || !lastName || !email || !phone) {
    return res.sendStatus(400);
  }

  if (!validator.isEmail(email)) {
    return res.status(412).send("Invalid email address");
  }

  if (!validator.isMobilePhone(phone)) {
    return res.status(412).send("Invalid phone number");
  }

  if (!userType) {
    let userType = "user";
  }

  const checkDuplicate = await User.findOne({
    where: { [Op.or]: { email, phone } },
  });

  if (checkDuplicate) {
    return res.status(409).send("Email or phone number already used");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const newUser = await User.create({
    uuid: uuidv4(),
    firstName,
    lastName,
    email,
    phone,
    userType,
  });
  const d = new Date();
  d.setDate(d.getDate() + 2);

  const otpEntry = new OTP({
    userId: newUser.uuid,
    otp,
    expire: d,
  });

  await otpEntry.save();

  emailApi.sendEmail({
    to: email,
    body: { otp, user: newUser.uuid },
    template: "NewRegistration",
  });

  return res.send(newUser);
};

exports.confirmEmail = async (req, res) => {
  const { user, otp } = { ...req.body };
  if (!user || !otp) {
    return res.sendStatus(400);
  }

  const userDetails = await User.findOne({ where: { uuid: user } });
  if (!userDetails) {
    return res.sendStatus(404);
  }

  if (userDetails.emailConfirmed) {
    return res.status(412).send("Email already confirmed");
  }

  const otpData = await OTP.findOne({ userId: user, otp });

  if (!otpData || otpData.expire < new Date()) {
    return res.status(400).send("Invalid OTP or Invalid request");
  }

  userDetails.emailConfirmed = true;
  userDetails.isActive = true;
  await userDetails.save();

  emailApi.sendEmail({
    to: userDetails.email,
    body: { message: "email activated" },
    template: EmailConfirmed,
  });

  return res.send(otpData);
};

exports.editProfile = async (req, res) => {
  const { firstName, lastName, email, phone, userType } = { ...req.body };
  return res.send(req.user);
};
