const multer = require("multer");
const path = require("path");
const express = require("express");
const { body } = require("express-validator");

const {
  getPost,
  getPosts,
  createPost,
  updatePost,
} = require("../controllers/post");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../images"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadFile = multer({ storage: fileStorage }).single("image");
const router = express.Router();

router.use((req, res, next) => {
  console.log(`Time: ${Date.now()}`);
  next();
});

router.use(uploadFile);

router.get("/posts", getPosts);

router.get("/post/:postId", getPost);

router.post(
  "/post",
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  createPost
);

router.put(
  "/post/:postId",
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  updatePost
);

module.exports = { router };
