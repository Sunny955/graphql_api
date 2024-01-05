const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.cookies.authToken;

  if (!token) {
    req.isAuth = false;
    return next();
  }

  try {
    const decodedToken = jwt.verify(token, process.env.SECRET);
    req.isAuth = true;
    req.userId = decodedToken.userId;
    next();
  } catch (error) {
    req.isAuth = false;
    next();
  }
};

module.exports = { authenticateUser };
