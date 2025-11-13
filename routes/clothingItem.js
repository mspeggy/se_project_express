const router = require('express').Router();


const  { createItem, getItems, updateItem, deleteItem, likeItem,  dislikeItem,} = require('../controllers/clothingItem')

//CRUD


//CREATE
router.post("/",createItem)

//Read

router.get('/', getItems);

//Update

router.put('/:itemId', updateItem)

//Delete

router.delete('/:itemId', deleteItem)

// new like/unlike routes
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);



module.exports = router;