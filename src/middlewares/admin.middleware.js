const { collections } = require("../utils/db");

exports.verifyAdmin = async (req, res, next) => {
  const user = req.user;
  const query = { email: user?.email };
  const result = await collections.userCollection.findOne(query);

  if (!result || result?.role !== "Admin") {
    return res.status(401).send({ message: "unauthorized access" });
  }

  next();
};
