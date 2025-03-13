const router = require("express").Router();
const userController = require("./user.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");
const { verifyAdmin } = require("../../middlewares/admin.middleware");

router.post("/:email", userController.saveUser);
router.get("/", verifyToken, verifyAdmin, userController.getAllUsers);
router.get("/:email", userController.getUserByEmail);
router.put("/:email", verifyToken, verifyAdmin, userController.updateUserRole);

module.exports = router;
