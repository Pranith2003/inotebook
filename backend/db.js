const mongoose = require("mongoose");
require("dotenv").config();

const mongoURL =
  process.env.MONGO_DB_URL || "mongodb://localhost:27017/inotebook";

const mongodb_conn = () => {
  mongoose
    .connect(mongoURL)
    .then(console.log("Connected to Mongoose DB"))
    .catch((error) => {
      console.log(error);
    });
};

module.exports = mongodb_conn;
