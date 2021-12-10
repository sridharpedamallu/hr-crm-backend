const db = require("../models");
const { Employee } = db;
const Op = db.Sequelize.Op;
const { v4: uuidv4 } = require("uuid");
const emailApi = require("../middleware/email");
const validator = require("validator");
const OTP = require("../models/otp");

exports.register = async (req, res) => {
  const { firstName, lastName, email, phone } = { ...req.body };

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

  const checkDuplicate = await Employee.findOne({
    where: { [Op.or]: { email, phone } },
  });

  if (checkDuplicate) {
    return res.status(409).send("Email or phone number already used");
  }

  const otp = Math.floor(100000 + Math.random() * 900000);

  const newEmployee = await Employee.create({
    uuid: uuidv4(),
    firstName,
    lastName,
    email,
    phone,
    createdBy: req.user.id,
    updatedBy: req.user.id,
  });

  emailApi.sendEmail({
    to: req.user.email,
    body: { message: "new employee created" },
    template: "NewEmployeeRegistration",
  });

  return res.send(newEmployee);
};

exports.editProfile = async (req, res) => {
  const { firstName, lastName, email, phone, isActive } = {
    ...req.body,
  };

  if (firstName || lastName || email || phone || isActive != undefined) {
    const userDetails = await User.findOne({ where: { id: req.user.id } });

    userDetails.firstName = firstName ? firstName : userDetails.firstName;
    userDetails.lastName = lastName ? lastName : userDetails.lastName;
    userDetails.email = email ? email : userDetails.email;
    userDetails.phone = phone ? phone : userDetails.phone;
    userDetails.isActive =
      isActive != undefined ? isActive : userDetails.isActive;

    await userDetails.save();

    return res.send(userDetails);
  } else {
    return res.send("Nothing to update");
  }
};
