const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE,
} = require("../utils/constants");

const { JWT_SECRET } = require("../utils/config");

const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  ConflictError,
} = require('../errors');

/* ----------------------------------
      POST /signup  — Create User
-----------------------------------*/
const createUser = async (req, res, next) => {
  try {
    const { name, avatar, email, password } = req.body;

    // Check required fields
    if (!name || !avatar || !email || !password) {
      throw new BadRequestError(
        "All fields (name, avatar, email, password) are required"
      );
    }

    // Hash password
    const hash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      avatar,
      email,
      password: hash,
    });

    const userObj = user.toObject();
    delete userObj.password;

    res.status(CREATED_STATUS_CODE).send(userObj); // success response
  } catch (err) {
    // Duplicate email
    if (err.code === 11000) {
      return next(new ConflictError("Email already exists"));
    }

    // Validation error
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }

    // Any other error
    return next(err);
  }
};

/* ----------------------------------
      POST /signin — Login
-----------------------------------*/
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next (new BadRequestError("Email and password are required"));
    }

    const user = await User.findUserByCredentials(email, password);

    // Generate JWT token
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    res.status(OK_STATUS_CODE).send({ token });
  } catch (err) {
    return next(new UnauthorizedError("Incorrect email or password"));
  }
};

/* ----------------------------------
    GET /users/me — Current User
-----------------------------------*/
const getCurrentUser = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).orFail();

    res.status(OK_STATUS_CODE).send(user);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }
    return next(err);
  }
};

/* ----------------------------------
  PATCH /users/me — Update Profile
-----------------------------------*/
const updateUserProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, avatar },
      { new: true, runValidators: true }
    ).orFail();

    res.status(OK_STATUS_CODE).send(updatedUser);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError("Invalid user data"));
    }

    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("User not found"));
    }

    return next(err);
  }
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
