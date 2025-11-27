const ClothingItem = require("../models/clothingItem");
const {
  OK_STATUS_CODE,
  FORBIDDEN_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
  CREATED_STATUS_CODE
} = require("../utils/constants");

// GET /items - public
const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK_STATUS_CODE).send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

// POST /items - protected
const createItem = (req, res) => {
  const { name, imageUrl, weather  } = req.body;
  const owner = req.user ? req.user._id : undefined;

  ClothingItem.create({ name, imageUrl, weather, owner })
    .then((item) => res.status(CREATED_STATUS_CODE).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

// GET /items/:itemId - public
const getItem = (req, res) => {
  const { itemId } = req.params;

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => res.status(OK_STATUS_CODE).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: `Could not find item with id ${itemId}` });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: err.message });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};
const likeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } }, // adds only if not already liked
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK_STATUS_CODE).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }

      // 500 branch: generic message only
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

// DELETE /items/:itemId - protected
const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId = req.user._id; // logged-in user from auth middleware

  ClothingItem.findById(itemId)
    .orFail()
    .then((item) => {
      // item.owner is an ObjectId — convert both to strings
      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN_STATUS_CODE)
          .send({ message: "You do not have permission to delete this item" });
      }

      // User owns the item → OK to delete
      return ClothingItem.findByIdAndDelete(itemId).then(() => {
        res.status(OK_STATUS_CODE).send({ message: "Item deleted successfully" });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }

      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID format" });
      }

      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Server error" });
    });
};
const dislikeItem = (req, res) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } }, // removes user ID from likes array
    { new: true }
  )
    .orFail()
    .then((item) => res.status(OK_STATUS_CODE).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Item not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Invalid item ID" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "An error occurred on the server" });
    });
};

module.exports = { getItems, createItem, getItem, deleteItem, likeItem, dislikeItem };