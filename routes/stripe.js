const express = require("express");
const router = express.Router();
const API="sk_test_51N9IDbIkwxyvGO5pUOCGidHgQQTuix1Yl0o950aBxDOBdljGkib2YbN4kqBCrwQ1mjBSGutlmRh4wKhrO10kLft500KMwDNSVo";
const stripe = require("stripe")(API);

router.post("/payment", async (req, res) => {
  try {
    const { tokenId, amount } = req.body;

    const charge = await stripe.charges.create({
      source: tokenId,
      amount: amount,
      currency: "usd",
    });

    res.status(200).json(charge);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
