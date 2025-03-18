const { body } = require("express-validator");

// Create
const articleValidate = () => {
  return [
    body("articleTitle")
      .isString()
      .withMessage("O Titilo Principal e obrigatorio.")
      .isLength({ min: 20 })
      .withMessage("O Titilo Principal deve conter no Minimo 20 caracteres.")
      .isLength({ max: 35 })
      .withMessage("O Titilo Principal deve conter no Maximo 35 caracteres."),
    body("miniDescri")
      .isString()
      .withMessage("A MiniDescrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A MiniDescriçao deve conter no Minimo 200 caracteres.")
      .isLength({ max: 262 })
      .withMessage("A MiniDescriçao deve conter no Maximo 262 caracteres."),
    body("firstTitle")
      .isString()
      .withMessage("O Segundo Titulo e obrigatorio.")
      .isLength({ min: 20 })
      .withMessage("O Segundo Titilo deve conter no Minimo 20 caracteres.")
      .isLength({ max: 35 })
      .withMessage("O Segundo Titilo deve conter no Maximo 35 caracteres."),
    body("firstDescri")
      .isString()
      .withMessage("A Segunda Descrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A Segunda Descriçao deve conter no Minimo 200 caracteres.")
      .isLength({ max: 262 })
      .withMessage("A Segunda Descriçao deve conter no Maximo 262 caracteres."),
    body("lastTitle")
      .isString()
      .withMessage("O Terceiro Titulo e obrigatorio.")
      .isLength({ min: 20 })
      .withMessage("O Terceiro Titulo deve conter no Minimo 20 caracteres.")
      .isLength({ max: 35 })
      .withMessage("O Terceiro Titulo deve conter no Maximo 35 caracteres."),
    body("lastDescri")
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

// Update
const updateValidate = () => {
  return [
    body("articleTitle")
      .optional()
      .isString()
      .withMessage("O Titilo Principal e obrigatorio.")
      .isLength({ min: 20 })
      .withMessage("O Titilo Principal deve conter no Minimo 20 caracteres.")
      .isLength({ max: 35 })
      .withMessage("O Titilo Principal deve conter no Maximo 35 caracteres."),
    body("miniDescri")
      .optional()
      .isString()
      .withMessage("A MiniDescrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A MiniDescriçao deve conter no Minimo 200 caracteres.")
      .isLength({ max: 262 })
      .withMessage("A MiniDescriçao deve conter no Maximo 262 caracteres."),
    body("firstTitle")
      .optional()
      .isString()
      .withMessage("O Segundo Titulo e obrigatorio.")
      .isLength({ min: 20 })
      .withMessage("O Segundo Titilo deve conter no Minimo 20 caracteres.")
      .isLength({ max: 35 })
      .withMessage("O Segundo Titilo deve conter no Maximo 35 caracteres."),
    body("firstDescri")
      .optional()
      .isString()
      .withMessage("A Segunda Descrição e Obrigatoria.")
      .isLength({ min: 200 })
      .withMessage("A Segunda Descriçao deve conter no Minimo 200 caracteres.")
      .isLength({ max: 262 })
      .withMessage("A Segunda Descriçao deve conter no Maximo 262 caracteres."),
    body("lastTitle")
      .optional()
      .isString()
      .withMessage("O Terceiro Titulo e obrigatorio.")
      .isLength({ min: 20 })
      .withMessage("O Terceiro Titulo deve conter no Minimo 20 caracteres.")
      .isLength({ max: 35 })
      .withMessage("O Terceiro Titulo deve conter no Maximo 35 caracteres."),
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

module.exports = {
  articleValidate,
  updateValidate,
};
