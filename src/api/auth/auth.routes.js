const router = require("express").Router();
const authController = require("./auth.controller");

router.post("/jwt", authController.generateToken);
router.get("/logout", authController.logout);

module.exports = router;
