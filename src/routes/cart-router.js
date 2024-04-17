import { Router } from 'express';
import { cartManager } from '../app.js';

const cartsRouter = Router();

// Manejo de errores centralizado
const handleErrors = (res, error, message) => {
    console.error(error);
    res.status(500).send(message);
};

// Traer todos los carritos
cartsRouter.get('/', async (req, res) => {
    try {
        const response = await cartManager.getCarts();
        res.json(response);
    } catch (error) {
        handleErrors(res, error, "Error al intentar obtener los carritos");
    }
});

// Crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    try {
        const response = await cartManager.newCart();
        res.json(response);
    } catch (error) {
        handleErrors(res, error, "Error al intentar crear el carrito");
    }
});

// Obtener por ID del carrito y listar productos
cartsRouter.get('/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        const response = await cartManager.getCartProducts(cartId);
        res.json(response);
    } catch (error) {
        handleErrors(res, error, "Error al intentar enviar los productos del carrito");
    }
});

// Agregar producto al carrito
cartsRouter.post('/:cartId/products/:productId', async (req, res) => {
    const { cartId, productId } = req.params;
    try {
        await cartManager.addProductToCart(cartId, productId);
        res.send('Producto agregado exitosamente');
    } catch (error) {
        handleErrors(res, error, "Error al intentar agregar el producto al carrito");
    }
});

export { cartsRouter };
