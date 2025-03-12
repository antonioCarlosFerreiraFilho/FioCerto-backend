// Models
const User = require("../models/User");
const Article = require("../models/Article");
// ADM config
const ADM_phone = process.env.ADM_PHONE;
const ADM_email = process.env.ADM_EMAIL;
const ADM_id = process.env.ADM_ID;
const ADM_permissions = process.env.ADM_PERMISSIONS;
const ADM_pass = process.env.ADM_PASS;

//   Create
const CreateArticle = async (req, res) => {
  // Req body
  const {
    articleTitle,
    miniDescri,
    firstTitle,
    firstDescri,
    lastTitle,
    lastDescri,
  } = req.body;
  // Req Images
  const file = req.files;

  // User Auth
  const reqUser = await req.user;
  const UserCurrent = await User.findById(reqUser._id);

  try {
    // Data Article
    const data = new Date();
    const dataDay = String(data.getDate()).padStart(2, "0");
    const dataMonth = String(data.getMonth() + 1).padStart(2, "0");
    const dataYear = data.getFullYear();
    const fullData = `${dataDay} /  ${dataMonth} / ${dataYear}`;

    // Create article
    const newArticle = await Article.create({
      // Images Article
      imgNAME: [],
      imgKEY: [],
      imgURL: [],
      // Text
      data: fullData,
      articleTitle,
      miniDescri,
      firstTitle,
      firstDescri,
      lastTitle,
      lastDescri,
      // Data ADM
      admName: UserCurrent.firstName,
      admID: UserCurrent._id,
      admPermissions: UserCurrent.permissions,
      admPass: UserCurrent.password,
    });

    // Array File
    if (file.length < 3 || file.length > 3) {
      return res
        .status(422)
        .json({ errors: ["Erro ao Enviar, No maximo 3 Images."] });
    }

    if (file.length == 3) {
      file.map((img) => {
        newArticle.imgNAME.push(img.originalname);
        newArticle.imgKEY.push(img.filename);
        newArticle.imgURL.push(img.location);
      });
    }

    // verify if create article
    if (!newArticle) {
      return res.status(422).json({
        errors: ["erro ao postar, favor tente novamente mais tarde."],
      });
    }

    // Save DB
    const saveDB = await newArticle.save();

    // Return Status
    return res.status(201).json(newArticle);
  } catch (err) {
    // Return Error
    return res.status(422).json({
      errors: ["Erro ao postar, favor tente novamente mais tarde."],
    });
  }
};

module.exports = {
  CreateArticle,
};
