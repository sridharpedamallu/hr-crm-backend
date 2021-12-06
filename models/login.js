const mongoose = require("mongoose");

const LogInSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  expire: {
    type: Date,
  },
});

const LogIn = mongoose.model("LogIn", LogInSchema);

module.exports = LogIn;
