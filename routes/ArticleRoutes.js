//Route Config
const express = require("express");
const router = express.Router();
//Middlewares
const ErrorsValidate = require("../middlewares/ErrorsValidate");
const AuthGuard = require("../middlewares/AuthGuard");
const { UploadImage } = require("../middlewares/UploadImage");
//Controllers
const {CreateArticle} = require("../controllers/ArticleController");

//  Create
router.post("/newarticle", AuthGuard, UploadImage.array("file"), CreateArticle);

module.exports = router;