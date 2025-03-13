const { ObjectId } = require("mongodb");
const { collections } = require("../../utils/db");

exports.addToCart = async (cartItem) => {
  return await collections.cartCollection.insertOne(cartItem);
};

exports.getCartItems = async (email, sortField, sortType) => {
  const query = { userEmail: email };
  const sortObj = {};

  if (sortField && sortType) {
    sortObj[sortField] = sortType;
  }

  return await collections.cartCollection.find(query).sort(sortObj).toArray();
};

exports.removeCartItem = async (id) => {
  const query = { _id: new ObjectId(id) };
  return await collections.cartCollection.deleteOne(query);
};
