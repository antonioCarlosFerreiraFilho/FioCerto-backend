//Route Config
const express = require("express");
const router = express.Router();
//Middlewares
const ErrorsValidate = require("../middlewares/ErrorsValidate");
const AuthGuard = require("../middlewares/AuthGuard");
const { UploadImage } = require("../middlewares/UploadImage");
const { articleValidate } = require("../middlewares/ArticleValidate");

//Controllers
const { CreateArticle, ReadArticle } = require("../controllers/ArticleController");

//  Create
router.post("/newarticle", AuthGuard, UploadImage.array("file"),  articleValidate(), ErrorsValidate, CreateArticle);
//  Read
router.get("/allArticles", ReadArticle);

module.exports = router;
