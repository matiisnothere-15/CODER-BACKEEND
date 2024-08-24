const stripe = Stripe('tu_clave_publica_de_stripe');

const handlePayment = async () => {
    const response = await fetch('/api/payments/create-payment-intent', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ amount: 5000 }), // Monto en centavos
    });

    const { clientSecret } = await response.json();

    const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
            card: cardElement, // Referencia al elemento de la tarjeta
        },
    });

    if (result.error) {
        console.error(result.error.message);
    } else {
        if (result.paymentIntent.status === 'succeeded') {
            console.log('Pago exitoso');
        }
    }
};