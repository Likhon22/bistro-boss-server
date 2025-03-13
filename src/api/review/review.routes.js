const router = require("express").Router();
const reviewController = require("./review.controller");
const { verifyToken } = require("../../middlewares/auth.middleware");

router.get("/", reviewController.getAllReviews);
router.get("/:email", verifyToken, reviewController.getReviewsByEmail);
router.post("/", reviewController.addReview);

module.exports = router;
