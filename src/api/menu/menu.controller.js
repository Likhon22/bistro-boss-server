const menuService = require("./menu.service");

exports.getMenuItems = async (req, res) => {
  try {
    const category = req.query.category;
    const currentPage = Number(req.query.currentPage) || 1;
    const limit = Number(req.query.limit) || 10;
    const sortField = req.query.sortField;
    const sortType = req.query.sortType;

    const result = await menuService.getMenuItems(
      category,
      currentPage,
      limit,
      sortField,
      sortType
    );
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.addMenuItem = async (req, res) => {
  try {
    const menuItem = req.body;
    const result = await menuService.addMenuItem(menuItem);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getMenuItemsByAdmin = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await menuService.getMenuItemsByAdmin(email);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.deleteMenuItem = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await menuService.deleteMenuItem(id);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.updateMenuItem = async (req, res) => {
  try {
    const id = req.params.id;
    const menuItem = req.body;
    const result = await menuService.updateMenuItem(id, menuItem);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
