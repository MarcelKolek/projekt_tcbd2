const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers["authorization"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  if (token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  });
};

isAdmin = (req, res, next) => {
  if (req.userRole === "admin") {
    next();
  } else {
    return res.status(403).send({ message: "Require Admin Role!" });
  }
};

module.exports = {
  verifyToken,
  isAdmin
};
