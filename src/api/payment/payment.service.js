const { ObjectId } = require("mongodb");
const stripe = require("stripe")(process.env.Stripe_Secret_Key);
const { collections } = require("../../utils/db");

exports.createPaymentIntent = async (price) => {
  const amount = parseInt(price * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount,
    currency: "usd",
    payment_method_types: ["card"],
  });

  return paymentIntent.client_secret;
};

exports.savePaymentInfo = async (paymentInfo) => {
  // Delete cart items
  const query = {
    _id: {
      $in: paymentInfo.cartIds.map((id) => new ObjectId(id)),
    },
  };
  const deletedResult = await collections.cartCollection.deleteMany(query);

  // Save payment
  const result = await collections.paymentCollection.insertOne(paymentInfo);

  return { result, deletedResult };
};

exports.getPaymentHistory = async (email) => {
  const query = { email: email };
  return await collections.paymentCollection.find(query).toArray();
};
