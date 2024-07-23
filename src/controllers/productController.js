import DAOFactory from '../dao/DAOFactory.js';
import ProductRepository from '../repositories/ProductRepository.js';
import User from '../dao/models/user.js'; 

const daoType = process.argv[2] || 'MONGO';
const productDAO = DAOFactory.getDAO(daoType);
const productRepository = new ProductRepository(productDAO);

// --- Product Controllers ---

export const getAllProducts = async (req, res) => {
    try {
        const products = await productRepository.getAllProducts();
        res.json(products);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productRepository.getProductById(req.params.id);
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export const createProduct = async (req, res) => {
    try {
        const newProduct = await productRepository.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updatedProduct = await productRepository.updateProduct(req.params.id, req.body);
        if (!updatedProduct) {
            return res.status(404).send('Product not found');
        }
        res.json(updatedProduct);
    } catch (err) {
        res.status(500).send(err.message);
    }
};


export const deleteProduct = async (req, res) => {
    const productId = req.params.id;
    const userId = req.user._id; 

    try {
        
        const [product, user] = await Promise.all([
            Product.findById(productId),
            User.findById(userId)
        ]);

        if (!product) {
            return res.status(404).send('Product not found');
        }


        if (user.role !== 'admin' && !product.owner.equals(userId)) {
            return res.status(403).send('You do not have permission to delete this product');
        }

        await productRepository.deleteProduct(productId); 
        res.send('Product deleted');
    } catch (error) {
        res.status(500).send('Server error');
    }
};
