const path = require("path");
// const cors = require("cors");
const multer = require("multer");
const express = require("express");
const { body } = require("express-validator");

const {
  getPost,
  getPosts,
  createPost,
  updatePost,
  deletePost,
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

router.get("/posts/:postId", getPost);

// router.options("/posts/:postId", cors());

router.post(
  "/post",
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  createPost
);

router.put(
  "/posts/:postId",
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  updatePost
);

// router.options("/posts/:postId", cors());
router.delete("/posts/:postId", deletePost);

module.exports = { router };
