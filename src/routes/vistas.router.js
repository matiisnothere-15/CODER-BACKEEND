import { Router } from 'express';
import ProductManager from '../dao/ProductManagerMONGO.js';
import CartManager from '../dao/CartManagerMONGO.js';
import { productsModelo } from '../dao/models/productsModelo.js';

const router = Router();
const productManager = new ProductManager();
const cartManager = new CartManager();

router.get('/', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('home', { products });
    } catch (error) {
        handleServerError(res, error);
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.setHeader('Content-Type', 'text/html');
        res.status(200).render('realTime', { products });
    } catch (error) {
        handleServerError(res, error);
    }
});

router.get("/chat", (req, res) => {
    res.status(200).render("chat");
});

router.get("/products", async (req, res) => {
    try {
        let cart = await cartManager.getCartsBy() || await cartManager.create();
        const { page = 1, limit = 10, sort } = req.query;

        const options = {
            page: Number(page),
            limit: Number(limit),
            lean: true,
        };

        const searchQuery = {};

        if (req.query.category) {
            searchQuery.category = req.query.category;
        }

        if (req.query.title) {
            searchQuery.title = { $regex: req.query.title, $options: "i" };
        }

        if (req.query.stock) {
            const stockNumber = parseInt(req.query.stock);
            if (!isNaN(stockNumber)) {
                searchQuery.stock = stockNumber;
            }
        }

        if (sort === "asc" || sort === "desc") {
            options.sort = { price: sort === "asc" ? 1 : -1 };
        }

        const buildLinks = (products) => {
            const { prevPage, nextPage } = products;
            const baseUrl = req.originalUrl.split("?")[0];
            const sortParam = sort ? `&sort=${sort}` : "";

            const prevLink = prevPage
                ? `${baseUrl}?page=${prevPage}${sortParam}`
                : null;
            const nextLink = nextPage
                ? `${baseUrl}?page=${nextPage}${sortParam}`
                : null;

            return {
                prevPage: prevPage ? parseInt(prevPage) : null,
                nextPage: nextPage ? parseInt(nextPage) : null,
                prevLink,
                nextLink,
            };
        };

        const products = await productManager.getProductsPaginate(searchQuery, options);
        const { prevPage, nextPage, prevLink, nextLink } = buildLinks(products);
        const categories = await productsModelo.distinct("category");

        let requestedPage = parseInt(page);
        if (isNaN(requestedPage)) {
            return res.status(400).json({ error: "Page debe ser un número" });
        }
        if (requestedPage < 1) {
            requestedPage = 1;
        }

        if (requestedPage > products.totalPages) {
            return res.status(400).json({ error: "Lo sentimos, el sitio aún no cuenta con tantas páginas" });
        }

        return res.render("products", {
            status: "success",
            payload: products.docs,
            totalPages: products.totalPages,
            page: parseInt(page),
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevPage,
            nextPage,
            prevLink,
            nextLink,
            categories: categories,
            cart
        });
    } catch (error) {
        handleServerError(res, error);
    }
});

router.get("/carts/:cid", async (req, res) => {
    try {
        res.setHeader('Content-Type', 'text/html');
        const cid = req.params.cid;
        const cart = await cartManager.getCartsBy({ _id: cid });

        if (cart) {
            res.status(200).render("cart", { cart });
        } else {
            return res.status(404).json({ error: `No existe un carrito con el ID: ${cid}` });
        }
    } catch (error) {
        handleServerError(res, error);
    }
});

export default router;

function handleServerError(res, error) {
    console.error(error);
    res.setHeader('Content-Type', 'application/json');
    res.status(500).json({ error: `Error interno del servidor: ${error.message}` });
}
