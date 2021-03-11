var express = require("express");
var router = express.Router();
const User = require("../models/user");
const errors = require("restify-errors");
const { body, param } = require("express-validator");
const { validate } = require("../middlewares/validate");

router.get("/", async (req, res, next) => {
  try {
    const user = await User.find({});
    res.send(user);
  } catch (err) {
    return next(new errors.InvalidContentError(err));
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) throw new Error();
    res.send(user);
  } catch (err) {
    return next(
      new errors.ResourceNotFoundError(
        `There is no user with the id of ${req.params.id}`
      )
    );
  }
});

router.post(
  "/",
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
    try {
      const { email, password } = req.body;
      const user = new User({
        email,
        password,
        role: "restricted",
      });

      await user.save();
      res.send(201);
    } catch (err) {
      return next(new errors.InternalError(err.message));
    }
  }
);

router.put(
  "/:id",
  validate([
    param("id")
      .exists()
      .withMessage("Missing required id field")
      .custom(async (value) => {
        const user = await User.findById(value);
        if (!user) throw new errors.ResourceNotFoundError("User Not Found");
      }),
  ]),
  async (req, res, next) => {
    try {
      await User.findOneAndUpdate({ _id: req.params.id }, req.body);
      res.send(200);
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no user with the id of ${req.params.id}`
        )
      );
    }
  }
);

router.delete(
  "/:id",
  validate([
    param("id")
      .exists()
      .withMessage("Missing required id field")
      .custom(async (value) => {
        const user = await User.findById(value);
        if (!user) throw new errors.ResourceNotFoundError("User Not Found");
      }),
  ]),
  async (req, res, next) => {
    try {
      await User.findOneAndRemove({ _id: req.params.id });
      res.send(204);
    } catch (err) {
      return next(
        new errors.ResourceNotFoundError(
          `There is no user with the id of ${req.params.id}`
        )
      );
    }
  }
);

module.exports = router;
