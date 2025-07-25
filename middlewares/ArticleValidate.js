const { body } = require("express-validator");

// Create
const articleValidate = () => {
  return [
    body("articleTitle")
      .isString()
      .withMessage("O Titilo Principal e obrigatorio.")
      .isLength({ min: 10 })
      .withMessage("O Titilo Principal deve conter no Minimo 20 caracteres.")
      .isLength({ max: 35 })
      .withMessage("O Titilo Principal deve conter no Maximo 35 caracteres."),
    body("miniDescri")
      .isString()
      .withMessage("A MiniDescrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A MiniDescriçao deve conter no Minimo 200 caracteres.")
      .isLength({ max: 305 })
      .withMessage("A MiniDescriçao deve conter no Maximo 262 caracteres."),
    body("firstTitle")
      .isString()
      .withMessage("O Segundo Titulo e obrigatorio.")
      .isLength({ min: 10 })
      .withMessage("O Segundo Titilo deve conter no Minimo 20 caracteres.")
      .isLength({ max: 35 })
      .withMessage("O Segundo Titilo deve conter no Maximo 35 caracteres."),
    body("firstDescri")
      .isString()
      .withMessage("A Segunda Descrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A Segunda Descriçao deve conter no Minimo 200 caracteres.")
      .isLength({ max: 305 })
      .withMessage("A Segunda Descriçao deve conter no Maximo 262 caracteres."),
    body("lastTitle")
      .isString()
      .withMessage("O Terceiro Titulo e obrigatorio.")
      .isLength({ min: 10 })
      .withMessage("O Terceiro Titulo deve conter no Minimo 20 caracteres.")
      .isLength({ max: 35 })
      .withMessage("O Terceiro Titulo deve conter no Maximo 35 caracteres."),
    body("lastDescri")
      .isString()
      .withMessage("A Terceira Descrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A Terceira Descrição deve conter no Minimo 200 caracteres.")
      .isLength({ max: 305 })
      .withMessage(
        "A Terceira Descrição deve conter no Maximo 262 caracteres."
      ),
  ];
};

// Update
const updateValidate = () => {
  return [
    body("miniDescri")
      .optional()
      .isString()
      .withMessage("A MiniDescrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A MiniDescriçao deve conter no Minimo 200 caracteres.")
      .isLength({ max: 262 })
      .withMessage("A MiniDescriçao deve conter no Maximo 262 caracteres."),

    body("firstDescri")
      .optional()
      .isString()
      .withMessage("A Segunda Descrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A Segunda Descriçao deve conter no Minimo 200 caracteres.")
      .isLength({ max: 262 })
      .withMessage("A Segunda Descriçao deve conter no Maximo 262 caracteres."),

    body("lastDescri")
      .optional()
      .isString()
      .withMessage("A Terceira Descrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A Terceira Descrição deve conter no Minimo 200 caracteres.")
      .isLength({ max: 262 })
      .withMessage(
        "A Terceira Descrição deve conter no Maximo 262 caracteres."
      ),
  ];
};

// Comments
const commentsValidate = () => {
  return [
    body("comments")
      .isString()
      .withMessage("o comentario e obrigatório")
      .isLength({ min: 5 })
      .withMessage("o comentario deve conter no minimo 5 caracteres")
      .isLength({ max: 400 })
      .withMessage("o comentario deve conter no maximo 400 caracteres"),
  ];
};

module.exports = {
  articleValidate,
  updateValidate,
  commentsValidate,
};
