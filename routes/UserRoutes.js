const express = require("express");
const router = express.Router();

//Middlewares
const ErrorsValidate = require("../middlewares/ErrorsValidate");
const AuthGuard = require("../middlewares/AuthGuard");
const { UploadImage } = require("../middlewares/UploadImage");
const {
  registerValidate,
  loginValidate,
  UpdateValidate,
} = require("../middlewares/UserValidate");

//Controllers
const {
  registerUser,
  loginUser,
  profileUser,
  UpdateUSer,
  permissionsUSer,
  deletUser,
  allUsers,
  searchUsers,
} = require("../controllers/UserController");

//  register
router.post("/register", registerValidate(), ErrorsValidate, registerUser);
//  login
router.post("/login", loginValidate(), ErrorsValidate, loginUser);
//  profile
router.get("/profile", AuthGuard, profileUser);
//  update
router.put(
  "/Update",
  AuthGuard,
  UploadImage.single("file"),
  UpdateValidate(),
  ErrorsValidate,
  UpdateUSer
);
//  permissions
router.put("/permissions", AuthGuard, permissionsUSer);
//  Delete
router.delete("/delete/:id", AuthGuard, deletUser);
//  Show
router.get("/showUsers", allUsers);
//  Search Users
router.get("/search", AuthGuard, searchUsers);

module.exports = router;
