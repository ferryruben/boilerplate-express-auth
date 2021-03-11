var express = require("express");
var router = express.Router();
const errors = require("restify-errors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config");
const User = require("../models/user");
const Session = require("../models/session");
const { body } = require("express-validator");
const { validate } = require("../middlewares/validate");

router.post(
  "/register",
  validate([
    body("email")
      .exists()
      .withMessage("Missing required email field")
      .isEmail()
      .withMessage("Email must be a valid email address")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (user) throw new Error("Email already in use");
      }),
    body("password")
      .exists()
      .withMessage("Missing required password field")
      .isLength({ min: 5 })
      .withMessage("Password must be at least 5 chars long")
      .matches(/\d/)
      .withMessage("Password must contain a number"),
  ]),
  async (req, res, next) => {
    console.log("msk");
    try {
      const { email, password } = req.body;
      const user = new User({
        email,
        password,
        role: "admin",
      });

      await user.save();
      res.send(201);
    } catch (err) {
      next(err);
    }
  }
);

//Authenticate a User login
router.post(
  "/login",
  validate([
    body("email")
      .exists()
      .withMessage("Missing required email field")
      .isEmail()
      .withMessage("Email must be a valid email address")
      .custom(async (value) => {
        const user = await User.findOne({ email: value });
        if (!user) throw new Error("User Not Found");
      }),
    body("password").exists().withMessage("Missing required password field"),
  ]),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      // Match User email with password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new errors.UnauthorizedError("Failed to authenicate user");
      }
      // Delete existing session
      await Session.deleteOne({ userId: user._id });
      // Create new session
      const sessionId = await Session.generateSessionId();
      const session = new Session({
        sessionId,
        userId: user._id,
      });
      await session.save();

      // Create JWT
      const token = jwt.sign(session.toJSON(), config.JWT_SECRET, {
        expiresIn: config.JWT_EXPIRES_IN,
      });
      res.send({ token });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
