import express from "express";
import { router as productsRouter } from "./routes/productRoutes.js";
import { router as cartsRouter } from "./routes/cartsRoutes.js";

const PORT = 8080;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// RUTAS CON ROUTER
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
// FIN RUTAS CON ROUTER

app.get("/", (req, res) => {
    res.send("Home page");
});

app.get("*", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.status(404).json({
        message: "Error 404 - page not found"
    });
});

const server = app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));
