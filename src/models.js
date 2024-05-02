import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: Number,
    stock: Number,
    status: String,
    category: String
});

const Product = mongoose.model('Product', productSchema);

const cartSchema = new mongoose.Schema({
    
});

const Cart = mongoose.model('Cart', cartSchema);

const messageSchema = new mongoose.Schema({
    user: String,
    message: String
});

const Message = mongoose.model('Message', messageSchema);

export { Product, Cart, Message };
