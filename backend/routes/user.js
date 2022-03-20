const express = require("express");
const { body } = require("express-validator");

const { signUpUser, loginUser } = require("../controllers/user");

const userRouter = express.Router();

userRouter.post(
  "/signup",
  [
    body("name").isLength({ min: 5 }),
    body("email").isEmail(),
    body("password").not().isEmpty(),
  ],
  signUpUser
);

userRouter.post("/login", loginUser);

module.exports = { userRouter };
