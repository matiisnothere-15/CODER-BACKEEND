import DAOFactory from '../dao/DAOFactory.js';
import ProductRepository from '../repositories/ProductRepository.js';

const daoType = process.argv[2] || 'MONGO'; // Usar 'MONGO' por defecto si no se pasa argumento
const productDAO = DAOFactory.getDAO(daoType);
const productRepository = new ProductRepository(productDAO);

// Controladores para productos
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
  try {
    const deletedProduct = await productRepository.deleteProduct(req.params.id);
    if (!deletedProduct) {
      return res.status(404).send('Product not found');
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send(err.message);
  }
};
