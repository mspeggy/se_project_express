const mongoose = require("mongoose");
const validator = require("validator");

const clothingitemSchema = new mongoose.Schema({
  name: {
    // name had to be a string
    type: String,
    // name has to be provided
    required: true,
    // name has to be at least 2 characters
    minLength: 2, 
    maxLength: 30, 
  },
  weather: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Link is not Valid",
    },
  },

   likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user", // references the user model
      default: [],
    },
  ],
});

module.exports = mongoose.model("clothingitem", clothingitemSchema);