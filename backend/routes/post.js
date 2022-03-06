const multer = require("multer");
const express = require("express");
const { body } = require("express-validator");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const uploadFile = multer({ storage: fileStorage });

const router = express.Router();

const { getPost, getPosts, createPost } = require("../controllers/post");

router.use((req, res, next) => {
  console.log(`Time: ${Date.now()}`);
  next();
});

router.get("/posts", getPosts);

router.get("/post/:postId", getPost);

router.post(
  "/post",
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  uploadFile.single("image"),
  createPost
);

module.exports = { router };
