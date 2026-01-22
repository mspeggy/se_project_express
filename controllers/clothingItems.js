const ClothingItem = require("../models/clothingItem");
const {
  OK_STATUS_CODE,
  CREATED_STATUS_CODE
} = require("../utils/constants");

const {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} = require("../errors");

/* ----------------------------------
          GET /items - public
-----------------------------------*/
const getItems = async (req, res, next) => {
  try {
    const items = await ClothingItem.find({});
    res.status(OK_STATUS_CODE).send(items);
  } catch (err) {
    next(err); // delegate to global error handler
  }
};

/* ----------------------------------
          POST /items - protected
-----------------------------------*/
const createItem = async (req, res, next) => {
  try {
    const { name, imageUrl, weather } = req.body;
    const owner = req.user ? req.user._id : undefined;

    if (!name || !imageUrl || !weather) {
      throw new BadRequestError("All fields (name, imageUrl, weather) are required");
    }

    const item = await ClothingItem.create({ name, imageUrl, weather, owner });
   return res.status(CREATED_STATUS_CODE).send(item);
  } catch (err) {
    if (err.name === "ValidationError") {
      return next(new BadRequestError(err.message));
    }
    return next(err);
  }
};

/* ----------------------------------
          GET /items/:itemId - public
-----------------------------------*/
const getItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const item = await ClothingItem.findById(itemId).orFail();
    return res.status(OK_STATUS_CODE).send(item);
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError(`Could not find item with id ${req.params.itemId}`));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

/* ----------------------------------
          PATCH /items/:itemId/like
-----------------------------------*/
const likeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    ).orFail();

    return res.status(OK_STATUS_CODE).send({ data: item });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

/* ----------------------------------
          PATCH /items/:itemId/dislike
-----------------------------------*/
const dislikeItem = async (req, res, next) => {
  try {
    const item = await ClothingItem.findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    ).orFail();

    return res.status(OK_STATUS_CODE).send({ data: item });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID"));
    }
    return next(err);
  }
};

/* ----------------------------------
          DELETE /items/:itemId
-----------------------------------*/
const deleteItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const userId = req.user._id;

    const item = await ClothingItem.findById(itemId).orFail();

    if (item.owner.toString() !== userId) {
      throw new ForbiddenError("You do not have permission to delete this item");
    }

    await ClothingItem.findByIdAndDelete(itemId);
    return res.status(OK_STATUS_CODE).send({ message: "Item deleted successfully" });
  } catch (err) {
    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError("Item not found"));
    }
    if (err.name === "CastError") {
      return next(new BadRequestError("Invalid item ID format"));
    }
    return next(err);
  }
};

/* ----------------------------------
                EXPORTS
-----------------------------------*/
module.exports = {
  getItems,
  createItem,
  getItem,
  likeItem,
  dislikeItem,
  deleteItem,
};