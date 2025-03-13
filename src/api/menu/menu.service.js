const { ObjectId } = require("mongodb");
const { collections } = require("../../utils/db");

exports.getMenuItems = async (
  category,
  currentPage,
  limit,
  sortField,
  sortType
) => {
  const skip = (currentPage - 1) * limit;
  const sortObj = {};

  if (sortField && sortType) {
    sortObj[sortField] = sortType;
  }

  let categoryObj = {};
  if (category) {
    categoryObj.category = category;
  }

  const total = await collections.menuCollection.countDocuments(categoryObj);
  const result = await collections.menuCollection
    .find(categoryObj)
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .toArray();

  return { result, total };
};

exports.addMenuItem = async (menuItem) => {
  return await collections.menuCollection.insertOne(menuItem);
};

exports.getMenuItemsByAdmin = async (email) => {
  const query = { adminEmail: email };
  return await collections.menuCollection.find(query).toArray();
};

exports.deleteMenuItem = async (id) => {
  const query = { _id: new ObjectId(id) };
  return await collections.menuCollection.deleteOne(query);
};

exports.updateMenuItem = async (id, menuItem) => {
  const query = { _id: new ObjectId(id) };
  const options = { upsert: true };
  const updateDoc = {
    $set: menuItem,
  };
  return await collections.menuCollection.updateOne(query, updateDoc, options);
};
