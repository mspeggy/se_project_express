const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  CONFLICT_STATUS_CODE,
  UNAUTHORIZED_STATUS_CODE,
  
} = require("../utils/constants");

const { JWT_SECRET } = require("../utils/config");

/* ----------------------------------
      POST /signup  — Create User
-----------------------------------*/
const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;

  if (!name || !avatar || !email || !password) {
    return res.status(BAD_REQUEST_STATUS_CODE).send({
      message: "All fields (name, avatar, email, password) are required",
    });
  }

  return bcrypt
    .hash(password, 10)
    .then((hash) =>
      User.create({
        name,
        avatar,
        email,
        password:hash 
      })
    )
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(CREATED_STATUS_CODE).send(userObj);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res
          .status(CONFLICT_STATUS_CODE)
          .send({ message: "Email already exists" });
      }

      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: err.message });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Server error" });
    });
};

/* ----------------------------------
      POST /signin — Login
-----------------------------------*/
const login = (req, res) => {
  const { email, password } = req.body;
if(!email || !password){return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Invalid data" });}
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(OK_STATUS_CODE).send({ token });
    })
    .catch(() => 
       res
        .status(UNAUTHORIZED_STATUS_CODE)
        .send({ message: "Incorrect email or password" })
    )
};

/* ----------------------------------
    GET /users/me — Current User
-----------------------------------*/
const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(OK_STATUS_CODE).send(user))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: "User not found" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Server error" });
    });
};

/* ----------------------------------
  PATCH /users/me — Update Profile
-----------------------------------*/
const updateUserProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((updatedUser) => res.status(OK_STATUS_CODE).send(updatedUser))
    .catch((err) => {
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Invalid user data" });
      }

      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_STATUS_CODE).send({ message: "User not found" });
      }

      return res.status(INTERNAL_SERVER_ERROR_STATUS_CODE).send({
        message: "Server error",
      });
    });
};

/* ----------------------------------
             EXPORTS
-----------------------------------*/
module.exports = {
  createUser,
  login,
  getCurrentUser,
  updateUserProfile,
};