const router = require("express").Router();

const {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

// CRUD

// start with /items

// GET all items
router.get("/", getItems);

// CREATE an item
router.post("/", createItem);

// DELETE an item
router.delete("/:itemId", deleteItem);

// new like/unlike routes
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
