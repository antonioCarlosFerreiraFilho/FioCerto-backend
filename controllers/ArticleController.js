// Models
const User = require("../models/User");
const Article = require("../models/Article");
// Lib crypto
const bcrypt = require("bcrypt");
// ADM config
const ADM_phone = process.env.ADM_PHONE;
const ADM_email = process.env.ADM_EMAIL;
const ADM_id = process.env.ADM_ID;
// AWS config
const aws = require("aws-sdk");
const s3 = new aws.S3();
// DOC statics
const fs = require("fs");
const path = require("path");
const { promisify } = require("util");

//   Create
const CreateArticle = async (req, res) => {
  const reqUser = await req.user;
  const UserCurrent = await User.findById(reqUser._id);

  // ADM user validation
  if (
    UserCurrent.phone == ADM_phone &&
    UserCurrent.email == ADM_email &&
    UserCurrent.id == ADM_id
  ) {
    // Article Text data
    const {
      articleTitle,
      miniDescri,
      firstTitle,
      firstDescri,
      lastTitle,
      lastDescri,
    } = req.body;

    const data = new Date();
    const dataDay = String(data.getDate()).padStart(2, "0");
    const dataMonth = String(data.getMonth() + 1).padStart(2, "0");
    const dataYear = data.getFullYear();
    const fullData = `${dataDay} /  ${dataMonth} / ${dataYear}`;

    // Encryption of ADM data in the article
    const idADMCrypto = await UserCurrent._id.toString();
    const salt = await bcrypt.genSalt();
    const admIdHash = await bcrypt.hash(idADMCrypto, salt);

    // Create New Article
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
      admID: admIdHash,
      admPermissions: UserCurrent.permissions,
      admPass: UserCurrent.password,
    });

    // Image validation and upload
    if (!req.files || req.files.length < 3) {
      return res.status(422).json({
        errors: ["É necessário enviar no minimo 3 imagens."],
      });
    }
    if (req.files.length > 3) {
      return res.status(422).json({
        errors: ["Você pode enviar no máximo 3 imagens."],
      });
    }
    const allowedMimeTypes = ["image/jpeg", "image/jpg", "image/png"];
    req.files.forEach((file) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(422).json({
          errors: [
            `O arquivo "${file.originalname}" não é um JPG, JPEG ou PNG válido.`,
          ],
        });
      } else {
        newArticle.imgNAME.push(file.originalname);
        newArticle.imgKEY.push(file.key);
        newArticle.imgURL.push(file.location);
      }
    });
    if (!newArticle) {
      return res.status(422).json({
        errors: ["erro ao postar, favor tente novamente mais tarde."],
      });
    }

    // Save DB
    const saveDB = await newArticle.save();

    // Response and creation
    return res.status(201).json({
      msg: newArticle,
    });
  } else {
    return res.status(422).json({ errors: ["Usuario não Autorizado."] });
  }
};

//   Read
const ReadArticle = async (req, res) => {
  const allArticles = await Article.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(allArticles);
};

//   Update
const UpdateArticle = async (req, res) => {
  const { id } = req.params;
  const reqUser = await req.user;
  const UserCurrent = await User.findById(reqUser._id);

  // ADM user validation
  if (
    UserCurrent.phone == ADM_phone &&
    UserCurrent.email == ADM_email &&
    UserCurrent.id == ADM_id
  ) {
    // Article Text data
    const {
      articleTitle,
      miniDescri,
      firstTitle,
      firstDescri,
      lastTitle,
      lastDescri,
    } = req.body;

    // Article DB
    const ArticleDB = await Article.findById(id);
    if (!ArticleDB) {
      return res.status(404).json({ errors: ["Artigo não encontrado."] });
    }

    // Transform IDadm and IdArticle .toString
    const ArticleADMid = await ArticleDB.admID.toString();
    const AdmID = await UserCurrent._id.toString();
    //
    const ArticleADMpass = await ArticleDB.admPass.toString();
    const AdmPass = await UserCurrent.password.toString();
    if (
      (await bcrypt.compare(AdmID, ArticleADMid)) &&
      bcrypt.compare(ArticleADMpass, AdmPass)
    ) {
      if (articleTitle) {
        ArticleDB.articleTitle = articleTitle;
      }

      if (miniDescri) {
        ArticleDB.miniDescri = miniDescri;
      }

      if (firstTitle) {
        ArticleDB.firstTitle = firstTitle;
      }

      if (firstDescri) {
        ArticleDB.firstDescri = firstDescri;
      }

      if (lastTitle) {
        ArticleDB.lastTitle = lastTitle;
      }

      if (lastDescri) {
        ArticleDB.lastDescri = lastDescri;
      }

      await ArticleDB.save();

      res.status(200).json({
        ArticleDB,
        message: "Artigo atualizado",
      });
    } else {
      return res.status(422).json({ errors: ["Usuario não Autorizado."] });
    }
  } else {
    return res.status(422).json({ errors: ["Usuario não Autorizado."] });
  }
};

//   Delete
const DeleteArticle = async (req, res) => {
  const { id } = req.params;
  const reqUser = await req.user;
  const UserCurrent = await User.findById(reqUser._id);

  // ADM user validation
  if (
    UserCurrent.phone == ADM_phone &&
    UserCurrent.email == ADM_email &&
    UserCurrent.id == ADM_id
  ) {
    // Article DB
    const ArticleDB = await Article.findById(id);
    if (!ArticleDB) {
      return res.status(404).json({ errors: ["Artigo não encontrado."] });
    }

    // Transform IDadm and IdArticle .toString
    const ArticleADMid = await ArticleDB.admID.toString();
    const AdmID = await UserCurrent._id.toString();
    //
    const ArticleADMpass = await ArticleDB.admPass.toString();
    const AdmPass = await UserCurrent.password.toString();
    if (
      (await bcrypt.compare(AdmID, ArticleADMid)) &&
      bcrypt.compare(ArticleADMpass, AdmPass)
    ) {
      let keys = [];

      const pushImagesDB = await ArticleDB.imgKEY.forEach((key) => {
        keys.push(key);
      });

      const DellImages = {
        Bucket: process.env.BUCKET_AWS,
        Delete: {
          Objects: keys.map((key) => ({ Key: key })),
        },
      };

      try {
        await Article.findByIdAndDelete(ArticleDB._id);

        await s3.deleteObjects(DellImages).promise();
        res
          .status(200)
          .json({
            message: "Artigo é Imagens excluídas com sucesso",
            deleted: keys,
          });
      } catch (error) {
        console.error("Erro ao excluir imagens:", error);
        res.status(500).json({ errors: "Erro ao excluir as imagens" });
      }
    } else {
      return res.status(422).json({ errors: ["Usuario não Autorizado.00"] });
    }
  } else {
    return res.status(422).json({ errors: ["Usuario não Autorizado."] });
  }
};

//   Comments
const CommentsArticle = async (req, res) => {
  res.send("Comments");
};

//   Likes
const LikesArticle = async (req, res) => {
  res.send("Likes");
};

//   Views
const ViewsArticle = async (req, res) => {
  res.send("Views");
};

//   Recently
const RecentlyPostedArticle = async (req, res) => {
  res.send("recentlyPosted");
};

//   About
const AboutArticle = async (req, res) => {
  res.send("About");
};

//   Pagination
const PaginationArticle = async (req, res) => {
  res.send("Pagination");
};

module.exports = {
  CreateArticle,
  ReadArticle,
  UpdateArticle,
  DeleteArticle,
  CommentsArticle,
};
