const cartService = require("./cart.service");

exports.addToCart = async (req, res) => {
  try {
    const cartItem = req.body;
    const result = await cartService.addToCart(cartItem);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getCartItems = async (req, res) => {
  try {
    const email = req.params.email;
    const sortField = req.query.sortField;
    const sortType = req.query.sortType;
    const result = await cartService.getCartItems(email, sortField, sortType);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await cartService.removeCartItem(id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
