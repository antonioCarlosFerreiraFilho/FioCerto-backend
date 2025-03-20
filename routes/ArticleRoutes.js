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
} = require("../controllers/ArticleController");

//  Create
router.post(
  "/newarticle",
  AuthGuard,
  UploadImage.array("file"),
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
router.get("/get/:id", ErrorsValidate, GetArticle);
//  Comments
router.put(
  "/comment/:id",
  AuthGuard,
  commentsValidate(),
  ErrorsValidate,
  CommentsArticle
);
//  DelComments
router.delete(
  "/get/:postId/commentID/:commentId",
  AuthGuard,
  ErrorsValidate,
  DelCommentsArticle
);
//  Likes
router.put("/:id", AuthGuard, ErrorsValidate, LikesArticle);
//  View
router.put("/view/:id", AuthGuard, ErrorsValidate, ViewsArticle);
//  Recently Posted Article
router.get("/Recently", ErrorsValidate, RecentlyPostedArticle);
//  About Article
router.get("/About", ErrorsValidate, AboutArticle);
//  Pagination
router.get("/gallery", ErrorsValidate, PaginationArticle);

module.exports = router;
