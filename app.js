var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const { authMiddleware } = require("./middlewares/auth");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(authMiddleware);

app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/user"));

app.use((req, res, next) => res.status(404).json({ message: "Not found" }));
app.use((err, req, res, next) => {
  // custom application error
  if (typeof err === "string") return res.status(400).json({ message: err });
  if (err.name === "BadRequestError")
    return res.status(400).json({ message: err.message });
  if (err.name === "UnauthorizedError")
    return res.status(401).json({ message: err.message ?? "Invalid Token" });
  if (err.name === "NotFoundError" || err.name === "ResourceNotFoundError")
    return res.status(404).json({ message: err.message });
  if (err.name === "ConflictError")
    return res.status(409).json({ message: err.message });
  // default to 500 server error
  return res.status(500).json({ message: err.message });
});

module.exports = app;
