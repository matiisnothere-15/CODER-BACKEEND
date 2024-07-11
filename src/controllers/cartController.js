const Cart = require('../dao/models/cartModelo');
const ProductRepository = require('../repositories/ProductRepository'); // Usamos el repositorio para centralizar la lógica de producto
const Ticket = require('../dao/models/ticketModelo'); 
const emailService = require('../services/emailService'); // Agregamos el servicio de correo electrónico

exports.purchase = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId);
        const productsToPurchase = [];
        const failedProducts = [];

        for (const item of cart.products) {
            const product = await ProductRepository.findById(item.productId); // Usamos el repositorio de productos

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                productsToPurchase.push(item);
            } else {
                failedProducts.push(item.productId);
            }
        }

        // Manejo de productos fallidos (si hay)
        if (failedProducts.length > 0) {
            cart.products = cart.products.filter(item => !failedProducts.includes(item.productId));
            await cart.save();
            return res.status(400).json({ message: 'Algunos productos no se pudieron comprar', failedProducts });
        }

        // Generación de ticket y envío de correo electrónico
        const ticket = new Ticket({
            code: generateUniqueCode(),
            purchase_datetime: new Date(), 
            amount: calculateTotalAmount(productsToPurchase), // Función para calcular el total
            purchaser: req.user.email 
        });
        await ticket.save();

        await emailService.sendEmail(req.user.email, 'Compra Exitosa', `Tu compra con código ${ticket.code} ha sido procesada exitosamente.`); 

        // Limpiar el carrito después de la compra exitosa
        cart.products = []; 
        await cart.save();

        res.status(200).json({ message: 'Compra completada con éxito', ticket }); 
    } catch (error) {
        res.status(500).json({ message: 'Error al completar la compra', error });
    }
};

// Funciones auxiliares (mejoradas y combinadas)
function generateUniqueCode() {
    return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function calculateTotalAmount(items) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

module.exports = {
    purchase, 
};
