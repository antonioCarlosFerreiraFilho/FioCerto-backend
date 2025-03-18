//Route Config
const express = require("express");
const router = express.Router();
//Middlewares
const ErrorsValidate = require("../middlewares/ErrorsValidate");
const AuthGuard = require("../middlewares/AuthGuard");
const { UploadImage } = require("../middlewares/UploadImage");
const { articleValidate, updateValidate } = require("../middlewares/ArticleValidate");

//Controllers
const { CreateArticle, ReadArticle, UpdateArticle, DeleteArticle } = require("../controllers/ArticleController");

//  Create
router.post("/newarticle", AuthGuard, UploadImage.array("file"),  articleValidate(), ErrorsValidate, CreateArticle);
//  Read
router.get("/allArticles", ReadArticle);
//  Update
router.put("/Update/:id", AuthGuard, updateValidate(), ErrorsValidate, UpdateArticle);
//  Delete
router.delete("/del/:id", AuthGuard, ErrorsValidate, DeleteArticle);

module.exports = router;
