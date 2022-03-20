const path = require("path");
// const cors = require("cors");
const multer = require("multer");
const express = require("express");
const { body } = require("express-validator");

const { isAuth } = require("../middleware/is-auth");

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
const postRouter = express.Router();

postRouter.use((req, res, next) => {
  console.log(`Time: ${Date.now()}`);
  next();
});

postRouter.use(uploadFile);

postRouter.get("/posts", isAuth, getPosts);

postRouter.get("/posts/:postId", isAuth, getPost);

// postRouter.options("/posts/:postId", cors());

postRouter.post(
  "/post",
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  isAuth,
  createPost
);

postRouter.put(
  "/posts/:postId",
  isAuth,
  [body("title").isLength({ min: 5 }), body("content").isLength({ min: 5 })],
  updatePost
);

// postRouter.options("/posts/:postId", cors());
postRouter.delete("/posts/:postId", isAuth, deletePost);

module.exports = { postRouter };
