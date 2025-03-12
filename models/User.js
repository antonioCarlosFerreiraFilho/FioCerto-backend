const mongoose = require("mongoose");
const { Schema } = mongoose;
// AWS config
const aws = require("aws-sdk");
const s3 = new aws.S3();
// DOC statics
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

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

//Upload Local
//UserSchema.pre("save", function(){
//
//  if(!this.url) {
//
//    this.url = `${process.env.APP_URL}/files/${this.key}`;
//  }
//})

UserSchema.pre("remove", function () {
  if (process.env.STORAGE_TYPE == "awsS3") {
    return s3
      .deleteObject({
        Bucket: "fiocerto2025s3",
        key: this.key,
      })
      .promise();
  } else {
    return promisify(fs.unlink)(
      path.resolve(__dirname, "..", "..", "tmp", "uploads", this.key)
    );
  }
});

const User = mongoose.model("User", UserSchema);

module.exports = User;
