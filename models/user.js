const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    required: [true, "The avatar field is required"],
    validate: {
      validator(value) {
        return validator.isURL(value);
      },
       message: 'You must enter a valid URL',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,                     // Enforces unique constraint
    validate: {
      validator: (v) => validator.isEmail(v),
      message: "Invalid email format",
    },
  },

  password: {
    type: String,
    required: true,
    select: false,                    // Prevents password from being returned in queries
  },
});
const bcrypt = require("bcrypt");

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select("+password") // because password has select: false
    .then((user) => {
      if (!user) {
        // email does not exist
        return Promise.reject(new Error("Incorrect email or password"));
      }

      // compare passwords
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          // password mismatch
          return Promise.reject(new Error("Incorrect email or password"));
        }

        return user; // success
      });
    });
};

module.exports = mongoose.model("user", userSchema);
