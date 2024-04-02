const express = require('express');
const router = express.Router();
const ProductManager = require('../dao/ProductManager');

const productManager = new ProductManager('./src/data/productos.json');

// Obtener todos los productos
router.get('/', async (req, res) => {
    try {
        const productos = await productManager.leerProductos();
        res.status(200).json(productos);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los productos' });
    }
});

// Obtener un producto por su ID
router.get('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const producto = await productManager.obtenerProducto(id);
        if (producto) {
            res.status(200).json(producto);
        } else {
            res.status(404).json({ message: `No se encontró ningún producto con el ID ${id}` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el producto' });
    }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
    try {
        const producto = req.body;
        const nuevoProducto = await productManager.agregarProducto(producto);
        res.status(201).json(nuevoProducto);
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar el producto' });
    }
});

// Actualizar un producto por su ID
router.put('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        const productoActualizado = req.body;
        await productManager.actualizarProducto(id, productoActualizado);
        res.status(200).json({ message: 'Producto actualizado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el producto' });
    }
});

// Eliminar un producto por su ID
router.delete('/:pid', async (req, res) => {
    try {
        const id = parseInt(req.params.pid);
        await productManager.eliminarProducto(id);
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el producto' });
    }
});

module.exports = router;
