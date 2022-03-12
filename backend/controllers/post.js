const { validationResult } = require("express-validator");
const post = require("../models/post");

const Post = require("../models/post");

const getPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();

    if (!posts.length) {
      throw new Error("Could not fetch posts");
    }

    res.status(200).json({
      posts: posts,
    });
  } catch (error) {
    next(error);
  }
};

const createPost = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // return res.status(422).json({
    //   errors: errors.array(),
    // });

    const errObj = new Error("Validation Error");
    errObj.statusCode = 422;

    return next(errObj);
  }

  if (!req.file) {
    throw new Error("Image not found");
  }

  const { title, content } = req.body;
  const imageUrl = `/images/${req.file.filename}`;

  try {
    const post = new Post({
      title: title,
      content: content,
      creator: {
        name: "Sparrow",
      },
      imageUrl: imageUrl,
    });

    await post.save();

    const newPost = {
      title: title,
      content: content,
      creator: {
        name: "Sparrow",
      },
      createdAt: new Date(),
      _id: new Date().toISOString(),
    };

    res.status(201).json({
      message: "Post request Success.",
      post: newPost,
    });
  } catch (error) {
    const errObj = new Error("Server Error");
    errObj.statusCode = 500;

    next(errObj);
  }
};

const getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      throw new Error("Could not find the post");
    }

    res.status(200).json({
      post,
    });
  } catch (error) {
    next(error);
  }
};

const updatePost = async (req, res, next) => {
  const postId = req.params.postId;

  try {
    const selectedPostForUpdate = await Post.findById(postId);

    if (!selectedPostForUpdate) {
      const errObj = new Error("Post not found.");
      errObj.statusCode = 422;

      next(errObj);
    }

    const { title, content } = req.body;

    let imageUrl = selectedPostForUpdate.imageUrl;

    if (req.file) {
      imageUrl = `/images/${req.file.filename}`;
    }

    selectedPostForUpdate.title = title;
    selectedPostForUpdate.content = content;
    selectedPostForUpdate.imageUrl = imageUrl;

    const updatedPost = await selectedPostForUpdate.save();

    res.status(200).json({
      message: "Post updated successfully.",
      post: updatedPost,
    });
  } catch (error) {
    next(error);
  }

  console.log("updated Post");
};

const deletePost = async (req, res, next) => {
  console.log("deletePost");

  const postId = req.params.postId;

  try {
    const { deletedCount } = await Post.deleteOne({ _id: postId });

    if (!deletedCount) {
      return res.status(404).json({
        message: "Not Found",
      });
    }
    res.status(200).json({
      message: "Post deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getPost, getPosts, createPost, updatePost, deletePost };
