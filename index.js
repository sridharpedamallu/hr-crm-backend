const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Log = require("./models/log");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect("mongodb://localhost:27017/hr_crm_db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  const log = new Log({
    originalUrl: req.originalUrl,
    method: req.method,
    body: JSON.stringify(req.body),
  });

  try {
    log.save();
  } catch (error) {
    return res.status(500).send(error);
  }

  next();
});

app.get("/", function (req, res) {
  return res.send(`HR CRM`);
});

app.use("/auth", require("./routes/AuthRouter"));
app.use("/user", require("./routes/UserRouter"));

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
