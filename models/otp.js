const mongoose = require("mongoose");

const OtpSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  dateTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  expire: {
    type: Date,
  },
});

const Otp = mongoose.model("Otp", OtpSchema);

module.exports = Otp;
