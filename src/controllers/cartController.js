const Cart = require('../dao/models/cartModelo');
const ProductRepository = require('../repositories/ProductRepository');
const Ticket = require('../dao/models/ticketModelo'); 
const emailService = require('../services/emailService'); 
const User = require('../dao/models/user');

const addToCart = async (req, res) => {
    const userId = req.user._id;
    const productId = req.body.productId;

    try {
        const [user, product] = await Promise.all([
            User.findById(userId),
            ProductRepository.findById(productId) 
        ]);

        if (!product) {
            return res.status(404).send('Product not found');
        }

        if (user.role === 'premium' && product.owner.equals(userId)) {
            return res.status(403).send('Premium users cannot add their own products to the cart');
        }

        const cart = await Cart.findOne({ user: userId });

        if (!cart) {
            return res.status(404).send('Cart not found for this user');
        }

        cart.products.push(productId); 
        await cart.save();

        res.send('Product added to cart');
    } catch (error) {
        res.status(500).send('Server error'); 
    }
};

exports.purchase = async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await Cart.findById(cartId);

        const productsToPurchase = [];
        const failedProducts = [];

        for (const item of cart.products) {
            const product = await ProductRepository.findById(item.productId);

            if (product.stock >= item.quantity) {
                product.stock -= item.quantity;
                await product.save();
                productsToPurchase.push(item);
            } else {
                failedProducts.push(item.productId);
            }
        }

        if (failedProducts.length > 0) {
            cart.products = cart.products.filter(item => !failedProducts.includes(item.productId));
            await cart.save();
            return res.status(400).json({ message: 'Algunos productos no se pudieron comprar', failedProducts });
        }

        const ticket = new Ticket({
            code: generateUniqueCode(),
            purchase_datetime: new Date(),
            amount: calculateTotalAmount(productsToPurchase),
            purchaser: req.user.email 
        });
        await ticket.save();

        await emailService.sendEmail(req.user.email, 'Compra Exitosa', `Tu compra con código ${ticket.code} ha sido procesada exitosamente.`);

        cart.products = []; 
        await cart.save();

        res.status(200).json({ message: 'Compra completada con éxito', ticket }); 
    } catch (error) {
        console.error("Error purchasing:", error); 
        res.status(500).json({ message: 'Error al completar la compra', error });
    }
};

function generateUniqueCode() {
    return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function calculateTotalAmount(items) {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

module.exports = {
    addToCart,
    purchase, 
};
