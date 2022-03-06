const path = require("path");
// const multer = require("multer");

const express = require("express");
const mongoose = require("mongoose");

const { router } = require("./routes/post");

const app = express();

// THIS CAN BE DONE AS WELL BUT WILL ADD THE file FIELD IN ALL THE REQUEST
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, path.join(__dirname, "images"));
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

// const uploadFile = multer({ storage: fileStorage }).single("image");

app.use(express.json());
// app.use(uploadFile);
app.use("/images", express.static(path.join(__dirname, "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/api/feed", router);

app.use((error, req, res, next) => {
  console.log("global error handling function", { error });

  const statusCode = error.statusCode || 500;
  const message = error.message;

  res.status(statusCode).json({
    statusCode,
    message,
  });
});

mongoose
  .connect(
    "mongodb+srv://heathids:heathids@cluster0.nyqib.mongodb.net/socialNetwork?retryWrites=true&w=majority"
  )
  .then(
    app.listen(8080, () => {
      console.log("App listening on port 8080");
    })
  )
  .catch((err) => {
    console.log({ err });
  });
