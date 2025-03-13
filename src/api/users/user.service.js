const { collections } = require("../../utils/db");

exports.saveUser = async (user, email) => {
  const query = { email: email };
  const isExist = await collections.userCollection.findOne(query);

  if (isExist) {
    return isExist;
  }

  return await collections.userCollection.insertOne(user);
};

exports.getAllUsers = async () => {
  return await collections.userCollection.find().toArray();
};

exports.getUserByEmail = async (email) => {
  const query = { email: email };
  return await collections.userCollection.findOne(query);
};

exports.updateUserRole = async (user, email) => {
  const query = { email: email };
  const updateDoc = {
    $set: {
      role: user.role,
    },
  };
  return await collections.userCollection.updateOne(query, updateDoc);
};
