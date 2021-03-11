require("dotenv").config();
module.exports = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",
  URL: process.env.URL || "http://localhost:3000",
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/practice",
  JWT_SECRET: process.env.JWT_SECRET || "supersecretkey", //require('crypto').randomBytes(64).toString('hex')
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "100m",
};
