const jwt = require("jsonwebtoken");

const isAuth = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    const errObj = new Error("Authorization Header missing.");
    errObj.statusCode = 401;

    throw errObj;
  }

  const jwtToken = authorizationHeader.split(" ")[1];

  if (!jwtToken) {
    const errObj = new Error("Invalid Token");
    errObj.statusCode = 401;
    throw errObj;
  }

  console.log({ jwtToken });

  try {
    const decodedToken = jwt.verify(jwtToken, "secret");
    req.userId = decodedToken.userId;
  } catch (error) {
    const errObj = new Error("Invalid Token");
    errObj.statusCode = 401;
    throw errObj;
  }

  next();
};

module.exports = { isAuth };
