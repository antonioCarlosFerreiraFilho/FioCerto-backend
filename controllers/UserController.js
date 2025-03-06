const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;

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
  res.send("ola mundo");
};

//  Delete User  //
const deletUser = async (req, res) => {
  const { id } = req.params;
  const reqUser = req.user;

  try {
    const userDB = await User.findById(new mongoose.Types.ObjectId(id));

    if (!userDB) {
      return res.status(404).json({ errors: ["Usuario Não Encontrado"] });
    }

    if (!userDB.userId.equals(reqUser._id)) {
      return res.status(422).json({ errors: ["Você não tem o direito."] });
    }

    await User.findByIdAndDelete(userDB._id);

    res.status(200).json({
      id: userDB._id,
      message: "Usuario excluido",
    });
  } catch (err) {
    return res.status(422).json({ errors: ["tente novamente mais tarde."] });
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

  const searchUsers = await User.find({ firstName: new RegExp(q, "i") }).exec();

  if (searchUsers == "") {
    return res.status(422).json({ errors: ["Sem Resultados."] });
  }

  res.status(200).json(searchUsers);
};

module.exports = {
  registerUser,
  loginUser,
  profileUser,
  UpdateUSer,
  deletUser,
  allUsers,
  searchUsers,
};
