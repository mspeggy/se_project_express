const ClothingItem = require("../models/clothingitem");

const {
  OK_STATUS_CODE,
  BAD_REQUEST_STATUS_CODE,
  NOT_FOUND_STATUS_CODE,
  INTERNAL_SERVER_ERROR_STATUS_CODE,
} = require("../utils/constants");

const createItem = (req, res) => {
  console.log(req);
  console.log(req.body);

  const { name, weather, imageUrl } = req.body;

  ClothingItem.create({ name, weather, imageUrl })
    .then((item) => {
      console.log(item);
      res.send({ data: item });
    })
    .catch((err) => {
      // if a validation error has occurred, send back a 400 error
      // console.log({"error name": err.name})
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST_STATUS_CODE).send({
          message:
            "ValidationError: name, weather, or imageUrl do not meet requirements",
        });
      }
     return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Error from createItem", err });
    });
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(OK_STATUS_CODE).send(items))
    .catch(() => 
      res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Error from getItems" })
    );
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageUrl } = req.body;

  ClothingItem.findByIdAndUpdate(itemId, { $set: { imageUrl } })
    .orFail()
    .then((item) => res.status(OK_STATUS_CODE).send({ data: item }))
    .catch(() => 
      res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Error from createItem"})
    );
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  console.log(itemId);
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then(() => res.status(OK_STATUS_CODE).send({}))
    .catch((e) => {
      if (e.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Error from deleteItem" });
      }
      if (e.name === "DocumentNotFoundError") {
        return res
          .status(NOT_FOUND_STATUS_CODE)
          .send({ message: "Error from deleteItem" });
      }
     return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Error from deleteItem" });
    });
};

// PUT /items/:itemId/likes
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
      return res
        .status(INTERNAL_SERVER_ERROR_STATUS_CODE)
        .send({ message: "Server error", error: err.message });
    });
};

// DELETE /items/:itemId/likes
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
        .send({ message: "Server error", error: err.message });
    });
};

module.exports = {
  createItem,
  getItems,
  updateItem,
  deleteItem,
  likeItem,
  dislikeItem,
};
