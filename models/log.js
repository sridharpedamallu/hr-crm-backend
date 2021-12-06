const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: true,
  },
  method: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
});

const Log = mongoose.model("Log", LogSchema);

module.exports = Log;
