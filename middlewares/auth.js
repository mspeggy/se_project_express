const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-error");

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

   const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch (err) {
    return next(new UnauthorizedError("Invalid or expired token"));
  }
};