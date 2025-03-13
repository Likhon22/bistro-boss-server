const router = require("express").Router();
const cartController = require("./cart.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.post("/", cartController.addToCart);
router.get("/:email", verifyToken, cartController.getCartItems);
router.delete("/:id", cartController.removeCartItem);

module.exports = router;
