const { body } = require("express-validator");

// REGISTER
const registerValidate = () => {
  return [
    body("firstName")
      .isString()
      .withMessage("O Primeiro nome e obrigatório")
      .isLength({ min: 4 })
      .withMessage("O Primeiro nome deve conter no minimo 4 Caracteres.")
      .isLength({ max: 10 })
      .withMessage("O Primeiro nome deve conter no maximo 8 Caracteres.")
      .custom((value) => {
        if (value.toLowerCase().includes('admin')) {
          throw new Error('O nome de usuário não pode conter "admin".');
        }
        return true;
      }),
    body("lastName")
      .isString()
      .withMessage("O Ultimo nome e obrigatorio")
      .isLength({ min: 4 })
      .withMessage("O Ultimo nome deve conter no minimo 4 Caracteres.")
      .isLength({ max: 11 })
      .withMessage("O Ultimo nome deve conter no maximo 10 Caracteres.")
      .custom((value) => {
        if (value.toLowerCase().includes('admin')) {
          throw new Error('O nome de usuário não pode conter "admin".');
        }
        return true;
      }),
    body("phone")
      .optional()
      .isString()
      .isLength({ max: 15 })
      .withMessage("O Numero deve conter no maximo 15 Caracteres."),
    body("email")
      .isString()
      .withMessage("O email/gmail e obrigatório.")
      .isEmail()
      .withMessage("Insira um email/gmail valido.")
      .isLength({ max: 30 })
      .withMessage("O Email deve conter no maximo 30 Caracteres."),
    body("password")
      .isString()
      .withMessage("A senha e obrigatória.")
      .isLength({ min: 6 })
      .withMessage("A senha deve conter um minimo 6 Caracteres.")
      .isLength({ max: 20 })
      .withMessage("A senha deve conter no maximo 20 Caracteres."),
    body("confirmPassword")
      .isString()
      .withMessage("A confirmação da senha e obrigatória.")
      .custom((value, { req }) => {
        if (value != req.body.password) {
          throw new Error("As senhas devem ser iguais.");
        }

        return true;
      }),
  ];
};

// LOGIN
const loginValidate = () => {
  return [
    body("firstName").isString().withMessage("O Primeiro nome e obrigatorio."),
    body("lastName").isString().withMessage("O Ultimo nome e obrigatorio."),
    body("email")
      .isString()
      .withMessage("O email/gmail e obrigatorio.")
      .isEmail()
      .withMessage("Insira um email valido."),
    body("password").isString().withMessage("A senha e obrigatoria."),
  ];
};

// UPDATE
const UpdateValidate = () => {
  return [
    body("firstName")
      .optional()
      .isString()
      .withMessage("O Primeiro nome e obrigatorio.")
      .isLength({ min: 4 })
      .withMessage("O Primeiro nome deve conter no minimo 4 Caracteres.")
      .isLength({ max: 8 })
      .withMessage("O Primeiro nome deve conter no maximo 8 Caracteres."),
    body("lastName")
      .optional()
      .isString()
      .withMessage("O Ultimo nome e obrigatorio.")
      .isLength({ min: 4 })
      .withMessage("O Ultimo nome deve conter no minimo 4 Caracteres.")
      .isLength({ max: 8 })
      .withMessage("O Ultimo nome deve conter no maximo 8 Caracteres."),
    body("password")
      .optional()
      .isLength({ min: 6 })
      .withMessage("A senha deve conter um minimo 6 Caracteres.")
      .isLength({ max: 10 })
      .withMessage("A senha deve conter um maximo 10 Caracteres."),
    body("phone")
      .optional()
      .isString()
      .isLength({ max: 15 })
      .withMessage("O Numero deve conter no maximo 15 Caracteres."),
  ];
};

module.exports = {
  registerValidate,
  loginValidate,
  UpdateValidate,
};
