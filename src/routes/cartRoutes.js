import { Router } from "express";
import CartManager from "../dao/CartManager.js";

const Carts = new CartManager();
const router = Router();

router.get("/:cid", async (req, res) => {
    try {
        const id = parseInt(req.params.cid);
        const carrito = await Carts.getCartById(id);
        res.status(200).json(carrito);
    } catch (error) {
        res.status(500).json({ error: "Error inesperado en el servidor" });
    }
});

router.post("/", async (req, res) => {
    try {
        const nuevoCarrito = await Carts.createCart();
        res.status(200).json(nuevoCarrito);
    } catch (error) {
        res.status(500).json({ error: "Error inesperado en el servidor" });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    try {
        const cid = req.params.cid;
        const pid = req.params.pid;

        let carrito = await Carts.getCartById(cid);
        if (!carrito) {
            return res.status(404).json({ message: "No existe el carrito en el que desea agregar productos" });
        }

        await Carts.addToCart(carrito, pid);

        const dbActualizada = await Carts.getCarts();
        res.status(200).json(dbActualizada);
    } catch (error) {
        res.status(500).json({ error: "Error inesperado en el servidor" });
    }
});

export { router };
