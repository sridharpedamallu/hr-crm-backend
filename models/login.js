const mongoose = require("mongoose");

const LogInSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  userUuid: {
    type: String,
    required: true,
  },
  accessToken: {
    type: String,
    required: true,
  },
  loginDateTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const LogIn = mongoose.model("LogIn", LogInSchema);

module.exports = LogIn;
