const userService = require("./user.service");

exports.saveUser = async (req, res) => {
  try {
    const user = req.body;
    const email = req.params.email;
    const result = await userService.saveUser(user, email);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const result = await userService.getAllUsers();
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await userService.getUserByEmail(email);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateUserRole = async (req, res) => {
  try {
    const user = req.body;
    const email = req.params.email;
    const result = await userService.updateUserRole(user, email);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
