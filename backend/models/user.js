const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Posts",
  },
  status: {
    type: String,
    default: "NEW",
  },
});

module.exports = mongoose.model("User", UserSchema);
