const express = require("express");
const { default: mongoose } = require("mongoose");
const app = express();
require("dotenv").config();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./src/Routes/AuthRoute");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const route = require("./src/Routes/BlogRoute");
const PORT = 8000;
const db = process.env.DBURL;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getMinutes() + " - " + file.originalname);
  },
});

const filter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(
  cors({
    origin: ["*"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  })
);
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cookieParser());
app.use(bodyParser.json());
app.use("/", authRoute);

app.use(multer({ storage: fileStorage, fileFilter: filter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/v1", route);

app.use((error, req, res, next) => {
  const status = error.status || 500;
  const message = error.message;
  const data = error.data;

  res.status(status).json({
    message: message,
    data: data,
  });
});

mongoose
  .connect(db)
  .then(() => {
    console.log("connected db");
  })
  .catch((err) => {
    console.log("db cconnection failed", err);
  });

app.listen(PORT, () => {
  console.log("Running on port ", PORT);
});
