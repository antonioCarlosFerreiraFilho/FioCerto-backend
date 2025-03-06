const jwt = require("jsonwebtoken");
const jwt_secret = process.env.JWT_SECRET;
const User = require("../models/User");

const AuthGuard = async (req, res, next) => {
  const autheaders = req.headers["authorization"];

  const token = autheaders && autheaders.split(" ")[1];

  if (!token) {
    return res.status(422).json({ errors: ["Token invalido."] });
  }

  try {
    const tokenVerify = jwt.verify(token, jwt_secret);
    req.user = await User.findById(tokenVerify.id).select(["-password", "-permissions", "-phone", "-email",]);
    next();
  } catch (err) {
    return res.status(422).json({ errors: ["Acesso Negado."] });
  }
};

module.exports = AuthGuard;
