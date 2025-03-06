require("dotenv").config();
require("./config/db.js");

const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");

//config send json()
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//url Front-end
app.use(cors());

//imagens Static
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

//route API
const router = require("./routes/Route.js");
app.use(router);

app.listen(process.env.PORT || 3001);