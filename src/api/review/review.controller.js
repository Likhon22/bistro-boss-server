const reviewService = require("./review.service");

exports.getAllReviews = async (req, res) => {
  try {
    const result = await reviewService.getAllReviews();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getReviewsByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await reviewService.getReviewsByEmail(email);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.addReview = async (req, res) => {
  try {
    const reviewInfo = req.body;
    const result = await reviewService.addReview(reviewInfo);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
