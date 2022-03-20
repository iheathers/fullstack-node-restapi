const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

const User = require("../models/user");

const signUpUser = async (req, res, next) => {
  console.log("Signing Up");

  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    const validationErrObj = new Error("Validation Error");
    validationErrObj.statusCode = 422;

    return next(validationErrObj);
  }

  const { name, email, password } = req.body;

  const existingUser = await User.findOne({
    email: email,
  });

  if (existingUser) {
    return res.status(422).json({
      message: "User exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name: name,
    email: email,
    password: hashedPassword,
  });

  try {
    await newUser.save();

    res.status(201).json({
      message: "User Created",
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      const errObj = new Error("User does not exist.");
      errObj.statusCode = 401;
      return next(errObj);
    }

    const matches = await bcrypt.compare(password, user.password);

    if (!matches) {
      const errObj = new Error("Incorrect Password");
      errObj.statusCode = 401;
      return next(errObj);
    }

    const jwtToken = await jwt.sign({ userId: user._id }, "secret", {
      expiresIn: "1hr",
    });

    res.status(200).json({
      token: jwtToken,
      userId: user._id.toString(),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { signUpUser, loginUser };
