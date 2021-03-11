//models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const uniqueValidator = require("mongoose-unique-validator");
const timestamp = require("mongoose-timestamp");

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "restricted"],
    required: true,
  },
});

UserSchema.plugin(uniqueValidator);
UserSchema.plugin(timestamp);

UserSchema.pre("save", function (next) {
  let user = this;

  if (!user.isModified("password")) return next();

  bcrypt
    .genSalt(12)
    .then((salt) => bcrypt.hash(user.password, salt))
    .then((hash) => {
      user.password = hash;
      next();
    })
    .catch((err) => next(err));
});

module.exports = mongoose.model("User", UserSchema); // exports the User model for reuse in other files
