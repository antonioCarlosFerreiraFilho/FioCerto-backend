// Mongoose Config
const mongoose = require("mongoose");
const { Schema } = mongoose;
// AWS config
const aws = require("aws-sdk");
const s3 = new aws.S3();
// DOC statics
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

// Model
const ArticleSchema = new Schema(
  {
    // Images
    imgNAME: Array,
    imgKEY: Array,
    imgURL: Array,
    // Text
    data: String,
    articleTitle: String,
    miniDescri: String,
    firstTitle: String,
    firstDescri: String,
    lastTitle: String,
    lastDescri: String,
    // Actions
    comments: Array,
    likes: Array,
    views: Array,
    // Data ADM
    admName: String,
    admID: String,
    admPermissions: String,
    admPass: String,
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
