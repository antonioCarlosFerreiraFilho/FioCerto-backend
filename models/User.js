const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    imageProfileNAME: String,
    imageProfileSIZE: String,
    imageProfileKEY: String,
    imageProfileURL: String,
    firstName: String,
    lastName: String,
    phone: { type: Number, default: 0 },
    email: String,
    password: String,
    permissions: { type: String, default: "user" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", UserSchema);

module.exports = User;
