const mongoose = require("mongoose");
const DB = process.env.DB_PASS_USER;

const connectDB = async () => {
  try {
    const keyDB = mongoose.connect(DB);
    console.log("DB connected");
    return keyDB;
  } catch (err) {
    console.log("error when connecting MongoDB.... ");
  }
};

connectDB();

module.exports = connectDB;