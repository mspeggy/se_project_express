const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const { UNAUTHORIZED_STATUS_CODE } = require("../utils/constants");

module.exports = (req, res, next) => {
  // Public routes that don't require auth
  const publicPaths = [
    { method: "POST", path: "/signin" },
    { method: "POST", path: "/signup" },
    { method: "GET", path: "/items" },
  ];

  const isPublic = publicPaths.some(
    (route) => route.method === req.method && route.path === req.path
  );
  if (isPublic) {
    return next();
  }

  // Get token from headers
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .send({ message: "Authorization required" });
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // attach payload to request
    return next(); // allow request to continue
  } catch (err) {
    return res
      .status(UNAUTHORIZED_STATUS_CODE)
      .send({ message: "Invalid or expired token" });
  }
};
