const router = require("express").Router();
const paymentController = require("./payment.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.post("/create-payment-intent", paymentController.createPaymentIntent);
router.post("/", paymentController.savePaymentInfo);
router.get("/:email", verifyToken, paymentController.getPaymentHistory);

module.exports = router;
