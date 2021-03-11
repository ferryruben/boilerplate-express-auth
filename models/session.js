const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const crypto = require("crypto");

const SessionSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    unique: true,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

SessionSchema.plugin(uniqueValidator);

SessionSchema.statics.generateSessionId = function () {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(16, (err, buf) => {
      if (err) reject(err);
      const token = buf.toString("hex");
      resolve(token);
    });
  });
};

module.exports = mongoose.model("Session", SessionSchema);
