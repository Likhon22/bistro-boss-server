const { collections } = require("../../utils/db");

exports.getAllReviews = async () => {
  return await collections.reviewCollection.find().toArray();
};

exports.getReviewsByEmail = async (email) => {
  const query = { email: email };
  return await collections.reviewCollection.find(query).toArray();
};

exports.addReview = async (reviewInfo) => {
  return await collections.reviewCollection.insertOne(reviewInfo);
};
