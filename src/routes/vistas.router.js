import { Router } from 'express';
import { ProductManager } from '../dao/ProductManager.js';
import { __dirname } from '../utils.js';

const router = Router();
const productManager = new ProductManager(__dirname + '/data/products.json');

router.get('/', async (req, res) => {
    try {
        const listOfProducts = await productManager.getProducts(); 
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('inicio', { listOfProducts });
        console.log(listOfProducts);
    } catch (error) {
        console.error('Error al obtener la lista de productos:', error);
        res.status(500).send('Error al obtener la lista de productos.');
    }
});

// Aquí usamos socket
router.get('/realTimeproducts', async (req, res) => {
    res.status(200).render('realTimeProducts', {});
});

export { router };
