const authService = require("./auth.service");

exports.generateToken = async (req, res) => {
  try {
    const user = req.body;
    const result = await authService.generateToken(user, res);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie("token").send({ success: true });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
