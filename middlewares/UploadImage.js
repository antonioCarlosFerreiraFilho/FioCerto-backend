const multer = require("multer");
const multerS3 = require("multer-s3");
const crypto = require("crypto");
const aws = require("aws-sdk");

const storageTypes = {
  local: multer.diskStorage({
    destination: function (req, res, cb) {
      let folder = "";

      if (req.baseUrl.includes("Users")) {
        folder = "Users";
      } else if (req.baseUrl.includes("Article")) {
        folder = "Article";
      }
      cb(null, `uploads/${folder}`);
    },
    filename(req, file, cb) {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        file.key = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, file.key);
      });
    },
  }),
  awsS3: multerS3({
    s3: new aws.S3(),
    bucket: process.env.BUCKET_AWS,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);

        const fileName = `${hash.toString("hex")}-${file.originalname}`;

        cb(null, fileName);
      });
    },
  }),
};

const UploadImage = multer({
  storage: storageTypes["awsS3"],
  //fileFilter(req, file, cb) {
  //  const allowedMimes = ["image/jpeg", "image/png", "image/jpg"];
  //
  //  if (allowedMimes.includes(file.mimetype)) {
  //    cb(null, true);
  //  } else {
  //    cb(new Error("So aceitamos imagems no formato: (.png) (.jpeg) (.jpg)"));
  //  }
  //},
  limits: {
    fileSize: 50 * 1024 * 1024, 
  },
});

module.exports = {
  UploadImage,
};
