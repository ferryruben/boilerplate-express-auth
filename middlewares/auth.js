const errors = require("restify-errors");
const jwt = require("jsonwebtoken");
const Session = require("../models/session");
const config = require("../config");

exports.authMiddleware = (req, res, next) => {
  const paths = ["/api/auth/login", "/api/auth/register"];
  if (paths.includes(req.originalUrl)) {
    return next();
  }

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (token == null) return next(new errors.UnauthorizedError("Invalid Token")); // if there isn't any token
  jwt.verify(token, config.JWT_SECRET, async (err, session) => {
    if (err) return next(new errors.UnauthorizedError("Invalid Token"));
    //check session
    const exist = await Session.findOne({ sessionId: session.sessionId });
    if (!exist) return next(new errors.UnauthorizedError("Invalid Session")); // if there isn't any session
    req.session = session;
    next(); // pass the execution off to whatever request the client intended
  });
};
