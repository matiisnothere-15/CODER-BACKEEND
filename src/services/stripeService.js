const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async (amount) => {
    return await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        payment_method_types: ['card'],
    });
};

module.exports = { createPaymentIntent };