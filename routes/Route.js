const express = require("express");
const router = express.Router();

//User Routes..
router.use("/api/Users", require("./UserRoutes"));
//Article Routes..
router.use("/api/Article", require("./ArticleRoutes"));

//Route primary
router.get("/", (req, res)=> {

  res.send("Carlos Eletricista");
});

module.exports = router;
