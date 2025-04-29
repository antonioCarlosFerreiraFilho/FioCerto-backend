// Models
const User = require("../models/User");
// Lib crypto Pass
const bcrypt = require("bcrypt");
// Lib Token
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
// ADM config
const ADM_phone = process.env.ADM_PHONE;
const ADM_email = process.env.ADM_EMAIL;
const ADM_id = process.env.ADM_ID;
const ADM_permissions = process.env.ADM_PERMISSIONS;

// ADD TOKEN //
const authUserToken = (id) => {
  return jwt.sign({ id }, jwt_secret, {
    expiresIn: "7d",
  });
};

//  Register  //
const registerUser = async (req, res) => {
  const { firstName, lastName, phone, email, password } = req.body;

  const userAlreadyRegister = await User.findOne({ email });

  if (userAlreadyRegister) {
    return res
      .status(422)
      .json({ errors: ["Este usuário já se encontra cadastrado."] });
  }

  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    firstName,
    lastName,
    phone,
    email,
    password: passwordHash,
  });

  if (!newUser) {
    return res.status(422).json({ errors: ["Erro ao cadastrar."] });
  }

  return res.status(200).json({
    msg: "usuário Cadastrado.",
    _id: newUser._id,
    token: authUserToken(newUser._id),
  });
};

//  Login  //
const loginUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  const userExist = await User.findOne({ email });

  if (!userExist) {
    return res
      .status(422)
      .json({ errors: ["Este email não se encontra cadastrado."] });
  }

  if (!(await bcrypt.compare(password, userExist.password))) {
    return res.status(422).json({ errors: ["Senha incorreta."] });
  }

  if (await (firstName != userExist.firstName)) {
    return res.status(422).json({ errors: ["Primeiro nome Incorreto."] });
  }

  if (await (lastName != userExist.lastName)) {
    return res.status(422).json({ errors: ["Ultimo nome Incorreto."] });
  }

  return res.status(200).json({
    _id: userExist._id,
    imageProfile: userExist.imageProfile,
    token: authUserToken(userExist._id),
  });
};

//  Profile  //
const profileUser = async (req, res) => {
  const user = req.user;
  return res.status(200).json(user);
};

//  Update User  //
const UpdateUSer = async (req, res) => {
  const { firstName, lastName, phone, password } = req.body;

  const reqUser = req.user;
  const userDB = await User.findById(reqUser._id).select("-password");
  //Image Upload
  if (req.file) {
    const {
      originalname: imageProfileNAME,
      size: imageProfileSIZE,
      key: imageProfileKEY,
      location: imageProfileURL = "",
    } = req.file;

    userDB.imageProfileNAME = imageProfileNAME;
    userDB.imageProfileSIZE = imageProfileSIZE;
    userDB.imageProfileKEY = imageProfileKEY;
    userDB.imageProfileURL = imageProfileURL;
  }

  if (firstName) {
    userDB.firstName = firstName;
  }

  if (lastName) {
    userDB.lastName = lastName;
  }

  if (phone) {
    userDB.phone = phone;
  }

  if (password) {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    userDB.password = passwordHash;
  }

  await userDB.save();

  return res.status(200).json({
    message: " Usuario Atualizado. ",
    user: userDB,
  });
};

//  permissions User  //
const permissionsUSer = async (req, res) => {
  const reqUser = req.user;
  const userDB = await User.findById(reqUser._id).select("-password");

  if (
    userDB.phone == ADM_phone &&
    userDB.email == ADM_email &&
    userDB.id == ADM_id
  ) {
    const { permissions } = req.body;

    if (permissions) {
      userDB.permissions = permissions;
    }

    await userDB.save();

    return res.status(200).json({
      msg: "Usuario Autenticado é Atualizado",
      user: userDB,
    });
  }

  return res.status(422).json({ errors: ["Usuario não Autorizado."] });
};

//  Delete User  //
const deletUser = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  //id Usuario a ser deletado
  const userDB = await User.findById(id);
  //ADM Infos
  const ADMverifi = await User.findById(reqUser._id).select("-password");

  if (
    ADMverifi.phone == ADM_phone &&
    ADMverifi.email == ADM_email &&
    ADMverifi._id == ADM_id &&
    ADMverifi.permissions == ADM_permissions
  ) {
    if (!userDB) {
      return res.status(404).json({ errors: ["Usuario Não Encontrado"] });
    }

    //Verifi ADM
    if (!ADMverifi._id.equals(ADM_id)) {
      return res.status(422).json({ errors: ["Você não tem o direito."] });
    }

    await User.findByIdAndDelete(userDB._id);

    res.status(200).json({
      id: userDB._id,
      message: "Usuario excluido",
    });
  } else {
    return res.status(422).json({ errors: ["Você não tem o direito."] });
  }
};

//   All Users   //
const allUsers = async (req, res) => {
  const allUsers = await User.find({})
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(allUsers);
};

//   Search Users   //
const searchUsers = async (req, res) => {
  const { q } = req.query;

  const reqUser = req.user;
  const userDB = await User.findById(reqUser._id).select("-password");

  if (
    userDB.phone == ADM_phone &&
    userDB.email == ADM_email &&
    userDB._id == ADM_id &&
    userDB.permissions == ADM_permissions
  ) {
    const searchUsers = await User.find({
      firstName: new RegExp(q, "i"),
    }).exec();

    if (searchUsers == "") {
      return res.status(422).json({ errors: ["Sem Resultados."] });
    }

    res.status(200).json(searchUsers);
  } else {
    return res.status(422).json({ errors: ["Usuario não Autorizado."] });
  }
};

module.exports = {
  registerUser,
  loginUser,
  profileUser,
  UpdateUSer,
  permissionsUSer,
  deletUser,
  allUsers,
  searchUsers,
};
