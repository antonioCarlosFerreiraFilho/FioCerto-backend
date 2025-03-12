const { body } = require("express-validator");

// Create
const articleValidate = () => {
  return [
    body("articleTitle")
    .isString()
    .withMessage("O Primeiro nome e obrigatorio."),
    body("miniDescri")
    .isString()
    .withMessage("O Ultimo nome e obrigatorio."),
    body("firstTitle")
    .isString()
    .withMessage("O Ultimo nome e obrigatorio."),
    body("firstDescri")
    .isString()
    .withMessage("O Ultimo nome e obrigatorio."),
    body("lastTitle")
    .isString()
    .withMessage("O Ultimo nome e obrigatorio."),
    body("lastDescri")
    .isString()
    .withMessage("O Ultimo nome e obrigatorio."),
    body("file")
    .custom((value, { req }) => {
      if (!req.file) {
        throw new Error("As Imagens são obrigatorias.");
      }
      return true;
    })
    .custom((value, { req }) => {
      if (req.files.length < 3 || req.files.length > 3) {
        throw new Error("São permitidas somente 3 Imagens.");
      } 
      return true;
    })
    .withMessage("São permitidas somente 3 Imagens."),
  ];
};

module.exports = {
  articleValidate
};