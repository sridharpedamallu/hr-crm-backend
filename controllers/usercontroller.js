const db = require("../models");
const { User } = db;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require("uuid");

exports.register = async (req, res) => {
  const { firstName, lastName, email, phone, userType } = { ...req.body };

  if (!firstName || !lastName || !email || !phone) {
    return res.sendStatus(400);
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const newuser = await User.create({
    uuid: uuidv4(),
    firstName,
    lastName,
    email,
    phone,
    otp,
  });

  return res.send(newuser);
};
