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

//   Read ✓
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
    const { miniDescri, firstDescri, lastDescri } = req.body;

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
      if (miniDescri) {
        ArticleDB.miniDescri = miniDescri;
      }

      if (firstDescri) {
        ArticleDB.firstDescri = firstDescri;
      }

      if (lastDescri) {
        ArticleDB.lastDescri = lastDescri;
      }

      await ArticleDB.save();

      res.status(200).json({
        ArticleDB,
        message: " Artigo atualizado ",
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
        res.status(200).json({
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

// GetArticle ✓
const GetArticle = async (req, res) => {
  const { id } = req.params;

  try {
    const ArticleDB = await Article.findById(id);

    if (!ArticleDB) {
      return res.status(404).json({ errors: ["Artigo não encontrado."] });
    }

    return res.status(200).json(ArticleDB);
  } catch (err) {
    return res.status(404).json({ errors: ["Artigo não encontrado."] });
  }
};

// Comments ✓
const CommentsArticle = async (req, res) => {
  const { id } = req.params;
  const { comments } = req.body;
  const reqUser = req.user;

  // Data Comment
  const data = new Date();
  const dataDay = String(data.getDate()).padStart(2, "0");
  const dataMonth = String(data.getMonth() + 1).padStart(2, "0");
  const dataYear = data.getFullYear();
  const dataComment = `${dataDay} /  ${dataMonth} / ${dataYear}`;

  const UserCurrent = await User.findById(reqUser._id);
  const ArticleDB = await Article.findById(id);

  if (!ArticleDB) {
    return res.status(404).json({ errors: ["Artigo não encontrado."] });
  }

  // Generating ID comment
  let min = 10;
  let max = 300;
  let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  const commentsArticle = ArticleDB.comments.length;

  const newComment = {
    userName: UserCurrent.firstName + " " + UserCurrent.lastName,
    userId: UserCurrent._id,
    dataComment,
    idComment: commentsArticle + randomNumber,
    comments,
  };

  if (!newComment) {
    return res
      .status(422)
      .json({ errors: ["Erro ao commentar, Tente novamente mais tarde."] });
  }

  await ArticleDB.comments.push(newComment);

  await ArticleDB.save();

  return res.status(200).json({
    comments: newComment,
    message: "comentário Publicado",
  });
};

// Delete Comment
const DelCommentsArticle = async (req, res) => {
  const { id: postId, commentId } = req.body;
  const reqUser = req.user;

  //
  const UserCurrent = await User.findById(reqUser._id);
  const ArticleDB = await Article.findById(postId);
  // ADM user validation
  if (
    UserCurrent.phone == ADM_phone &&
    UserCurrent.email == ADM_email &&
    UserCurrent.id == ADM_id
  ) {
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
      try {
        if (!ArticleDB) {
          return res.status(404).json({ errors: ["Artigo não encontrado."] });
        }

        if (!commentId) {
          return res
            .status(404)
            .json({ errors: ["Id Commentario Nessesario."] });
        }

        const convArray = ArticleDB.comments.findIndex(
          (item) => item.idComment == commentId
        );

        const commentCurrent = ArticleDB.comments[convArray];

        if (!commentCurrent) {
          return res
            .status(404)
            .json({ errors: ["Commentario não encontrado."] });
        }

        await ArticleDB.comments.remove(commentCurrent);

        await ArticleDB.save();

        return res.status(200).json({
          msg: "Comentario excluido",
        });
      } catch (err) {
        return res.status(404).json({ errors: ["Artigo não encontrado."] });
      }
    }
  } else {
    return res.status(404).json({ errors: ["Usuario não Autorizado"] });
  }
};

//   Likes
const LikesArticle = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  const ArticleDB = await Article.findById(id);

  if (!ArticleDB) {
    return res.status(404).json({ errors: ["Artigo não encontrado."] });
  }

  if (ArticleDB.likes.includes(reqUser._id)) {
    return res.status(422).json({ errors: ["voce já curtiu este Artigo."] });
  }

  ArticleDB.likes.push(reqUser._id);

  await ArticleDB.save();

  return res.status(200).json({
    message: "Este Artigo foi curtido!.",
  });
};

//   Views
const ViewsArticle = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  const ArticleDB = await Article.findById(id);
  const UserCurrent = await User.findById(reqUser._id);

  if (!ArticleDB) {
    return res.status(404).json({ errors: ["Artigo não encontrado."] });
  }

  // Length Views Article
  const ViewsArticle = ArticleDB.views.length;

  const newViews = {
    userName: UserCurrent.firstName + " " + UserCurrent.lastName,
    userId: UserCurrent._id,
    idViews: ViewsArticle + 1,
  };

  await ArticleDB.views.push(newViews);

  await ArticleDB.save();

  return res.status(200).json({
    view: newViews,
  });
};

//   Recently ✓
const RecentlyPostedArticle = async (req, res) => {
  const FristSix = await Article.find({})
    .sort([["createdAt", -1]])
    .limit(6)
    .exec();

  return res.status(200).json(FristSix);
};

//   About ✓
const AboutArticle = async (req, res) => {
  const FristThree = await Article.find({})
    .sort([["createdAt", -1]])
    .limit(3)
    .exec();

  return res.status(200).json(FristThree);
};

//   Pagination ✓
const PaginationArticle = async (req, res) => {
  const { page = 0 } = req.params;

  const offset = page * 4;

  const ArticlesDB = await Article.find({}).skip(offset).limit(4).exec();

  res.status(200).json(ArticlesDB);
};

//   Search Article
const SearchArticle = async (req, res) => {
  const { q } = req.query;

  const Search = await Article.find({
    articleTitle: new RegExp(q, "i"),
  }).exec();

  if (Search == "") {
    return res.status(404).json({ errors: ["Sem Resultados."] });
  }

  return res.status(200).json(Search);
};

module.exports = {
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
};
