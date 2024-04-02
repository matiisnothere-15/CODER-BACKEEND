const express = require('express');
const router = express.Router();
const CartManager = require('../dao/CartManager');

const cartManager = new CartManager('./src/data/carrito.json');

// Obtener el carrito por su ID
router.get('/:cid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const carrito = await cartManager.obtenerCarrito(cid);
        if (carrito) {
            res.status(200).json(carrito);
        } else {
            res.status(404).json({ message: `No se encontró ningún carrito con el ID ${cid}` });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
});

// Agregar un producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cid = parseInt(req.params.cid);
        const pid = parseInt(req.params.pid);
        await cartManager.agregarProductoAlCarrito(cid, pid);
        res.status(200).json({ message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        res.status(500).json({ error: 'Error al agregar producto al carrito' });
    }
});

module.exports = router;
