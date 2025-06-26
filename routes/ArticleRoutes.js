//Route Config
const express = require("express");
const router = express.Router();
//Middlewares
const ErrorsValidate = require("../middlewares/ErrorsValidate");
const AuthGuard = require("../middlewares/AuthGuard");
const { UploadImage } = require("../middlewares/UploadImage");
const {
  articleValidate,
  updateValidate,
  commentsValidate,
} = require("../middlewares/ArticleValidate");

//Controllers
const {
  CreateArticle,
  ReadArticle,
  UpdateArticle,
  DeleteArticle,
  GetArticle,
  CommentsArticle,
  DelCommentsArticle,
  LikesArticle,
  ViewsArticle,
  RecentlyPostedArticle,
  AboutArticle,
  PaginationArticle,
  SearchArticle,
} = require("../controllers/ArticleController");

//  Create
router.post(
  "/newarticle",
  AuthGuard,
  UploadImage.array("files"),
  articleValidate(),
  ErrorsValidate,
  CreateArticle
);
//  Read
router.get("/allArticles", ReadArticle);
//  Update
router.put(
  "/Update/:id",
  AuthGuard,
  updateValidate(),
  ErrorsValidate,
  UpdateArticle
);
//  Delete
router.delete("/del/:id", AuthGuard, ErrorsValidate, DeleteArticle);
//  GetArticle
router.get("/get/:id", GetArticle);
//  Comments
router.put(
  "/comment/:id",
  AuthGuard,
  commentsValidate(),
  ErrorsValidate,
  CommentsArticle
);
//  DelComments
router.put("/delComment", AuthGuard, ErrorsValidate, DelCommentsArticle);
//  Likes
router.put("/:id", AuthGuard, ErrorsValidate, LikesArticle);
//  View
router.put("/view/:id", ViewsArticle);
//  Recently Posted Article
router.get("/recently", RecentlyPostedArticle);
//  About Article
router.get("/about", AboutArticle);
//  Pagination
router.get("/gallery/:page", PaginationArticle);
//  Search Article
router.get("/search", SearchArticle);

module.exports = router;
