const mongoose = require("mongoose");
const {Schema} = mongoose;

const TestSchema = new Schema(
  {
    title: String,
    description: String,
    url: String,
    size: String,
    key: String,
  },
  {
    timestamps: true
  }
);

const Test = mongoose.model("Test", TestSchema);

module.exports = Test;