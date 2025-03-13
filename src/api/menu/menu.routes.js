const router = require("express").Router();
const menuController = require("./menu.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { verifyAdmin } = require("../../middlewares/admin.middleware");

router.get("/", menuController.getMenuItems);
router.post("/", verifyToken, verifyAdmin, menuController.addMenuItem);
router.get("/:email", verifyToken, menuController.getMenuItemsByAdmin);
router.delete("/:id", verifyToken, verifyAdmin, menuController.deleteMenuItem);
router.put("/:id", verifyToken, verifyAdmin, menuController.updateMenuItem);

module.exports = router;
