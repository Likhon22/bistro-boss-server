const paymentService = require("./payment.service");

exports.createPaymentIntent = async (req, res) => {
  try {
    const { price } = req.body;
    const clientSecret = await paymentService.createPaymentIntent(price);
    res.send({ clientSecret });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.savePaymentInfo = async (req, res) => {
  try {
    const paymentInfo = req.body;
    const result = await paymentService.savePaymentInfo(paymentInfo);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const email = req.params.email;
    const result = await paymentService.getPaymentHistory(email);
    res.send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};
