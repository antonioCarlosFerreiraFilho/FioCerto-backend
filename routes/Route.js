const express = require("express");
const router = express.Router();

//User Routes..
router.use("/api/Users", require("./UserRoutes"));

module.exports = router;
