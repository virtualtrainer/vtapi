const mongoose = require("mongoose");

const User = mongoose.model(
  "User",
  new mongoose.Schema({
    username: String,
    resetLink: String,
    email: String,
    password: String,
    signuprandomnumber: String,
    confirmed: {
      type: Boolean,
      default: false
    },
    profile: [
      {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Profile"
      }
      ],
    roles: [
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role"
    }
    ]
  },{timestamps: true})
);

module.exports = User;
