const express = require("express");
const router = express.Router();

//Middlewares
const ErrorsValidate = require("../middlewares/ErrorsValidate");
const AuthGuard = require("../middlewares/AuthGuard");
const {UploadImage} = require("../middlewares/UploadImage");
const {registerValidate, loginValidate, UpdateValidate} = require("../middlewares/UserValidate");

//Controllers
const { registerUser, loginUser, profileUser, UpdateUSer} = require("../controllers/UserController");

//  register
router.post("/register", registerValidate(), ErrorsValidate, registerUser);
//  login
router.post("/login", loginValidate(), ErrorsValidate, loginUser);
//  profile
router.get("/profile", AuthGuard, profileUser);
//  update
router.put("/Update", AuthGuard, UploadImage.single("file"), UpdateValidate(), ErrorsValidate, UpdateUSer);


module.exports = router;
