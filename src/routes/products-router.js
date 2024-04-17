import { Router } from 'express';
import { productManager } from '../app.js';
import { auth } from '../middleware/middleW01.js';
import { upload } from '../utils.js';

const productRouter = Router();

const handleErrors = (res, error, message) => {
    console.error(error);
    res.status(500).send(message);
};

// Ruta GET para obtener todos los productos
productRouter.get('/', async (req, res) => {
    try {
        const { limit } = req.query;
        let products = await productManager.getProducts();

        if (limit) {
            products = products.slice(0, limit);
        }

        res.json(products);
    } catch (error) {
        handleErrors(res, error, "Error al intentar recibir los productos.");
    }
});

// Ruta GET para obtener un producto por ID
productRouter.get('/:productId', auth, async (req, res) => {
    const { productId } = req.params;
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).send("No se encontró el producto con el ID proporcionado.");
        }
    } catch (error) {
        handleErrors(res, error, "Error al intentar recibir el producto por ID.");
    }
});

// Ruta POST para agregar un nuevo producto
productRouter.post('/', upload.single("avatar"), async (req, res) => {
    try {
        const { title, description, price, thumbnail, code, stock, status, category } = req.body;
        const response = await productManager.addProduct({ title, description, price, thumbnail, code, stock, status, category });
        res.json(response);
    } catch (error) {
        handleErrors(res, error, "Error al intentar agregar producto.");
    }
});

// Ruta PUT para actualizar un producto por ID
productRouter.put('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        const { nombre, descripcion, precio, imagen, stock, categoria } = req.body;
        const response = await productManager.updateProduct(productId, { nombre, descripcion, precio, imagen, stock, categoria });
        res.json(response);
    } catch (error) {
        handleErrors(res, error, "Error al intentar editar producto.");
    }
});

// Ruta DELETE para eliminar un producto por ID
productRouter.delete('/:productId', async (req, res) => {
    const { productId } = req.params;
    try {
        await productManager.deleteProductById(productId);
        res.send("Producto eliminado exitosamente.");
    } catch (error) {
        handleErrors(res, error, "Error al intentar eliminar producto.");
    }
});

export { productRouter };
