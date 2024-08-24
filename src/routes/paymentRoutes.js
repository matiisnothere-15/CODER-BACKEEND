const express = require('express');
const router = express.Router();
const { createPaymentIntent } = require('../services/stripeService');

router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;
    try {
        const paymentIntent = await createPaymentIntent(amount);
        res.status(200).send({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;