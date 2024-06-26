const Ticket = require('../models/ticket');
const ProductRepository = require('../repositories/ProductRepository');
const emailService = require('../services/emailService');

const purchaseCart = async (req, res) => {
  const { cid } = req.params;
  const cart = await Cart.findById(cid);
  const productsToPurchase = [];

  for (let item of cart.items) {
    const product = await ProductRepository.findById(item.productId);
    if (product.stock >= item.quantity) {
      product.stock -= item.quantity;
      await product.save();
      productsToPurchase.push(item);
    }
  }

  const ticket = new Ticket({
    code: generateUniqueCode(),
    amount: calculateTotalAmount(productsToPurchase),
    purchaser: req.user.email,
  });
  
  await ticket.save();
  await emailService.sendEmail(req.user.email, 'Compra Exitosa', `Tu compra con código ${ticket.code} ha sido procesada exitosamente.`);

  cart.items = cart.items.filter(item => !productsToPurchase.includes(item));
  await cart.save();

  res.json({ ticket, unprocessedItems: cart.items });
};

const generateUniqueCode = () => {
  return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
};

const calculateTotalAmount = (items) => {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
};

module.exports = {
  purchaseCart,
};