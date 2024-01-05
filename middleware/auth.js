const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const rawHeaders = req.rawHeaders;
  const authHeaderIndex = rawHeaders.indexOf("Authorization");

  if (authHeaderIndex === -1 || rawHeaders.length <= authHeaderIndex + 1) {
    req.isAuth = false;
    return next();
  }

  let token = rawHeaders[authHeaderIndex + 1];

  token = token.replace(/^Bearer\s+/, "");

  if (!token || token === "") {
    req.isAuth = false;
    return next();
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!decodedToken) {
    req.isAuth = false;
    return next();
  }

  req.isAuth = true;
  req.userId = decodedToken.userId;
  next();
};

module.exports = { authenticateUser };
