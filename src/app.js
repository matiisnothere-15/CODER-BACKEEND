import express from "express";
import { ProductManager } from './dao/ProductManager.js';
import { productRouter } from "./routes/products-router.js"
import { CartManager } from "./dao/CartManager.js";
import { cartsRouter } from "./routes/cart-router.js";
import { router as vistasRouter } from './routes/vistas.router.js';
import { errorHandler, middleware01, middleware02, middleware03 } from "./middleware/middleW01.js";
import { engine } from "express-handlebars";
import path from "path"; 
import __dirname from "./utils.js"; 
import { Server } from "socket.io";

const puerto = 8080;
const app = express();
const mongoURI = 'mongodb://localhost:27017/';
export const productManager = new ProductManager;
export const cartManager = new CartManager;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Conexión a MongoDB establecida'))
    .catch(err => console.error('Error de conexión a MongoDB:', err));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Configuración de Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

// Contenido estático
app.use(express.static(path.join(__dirname,'/public')));

// Rutas
app.use('/api/products', productRouter);
app.use('/api/carts', cartsRouter);
app.use('/', vistasRouter);

// Ruta predeterminada
app.use('/', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send("Todo Ok");
});

// Middleware de manejo de errores
app.use(errorHandler);

// Escucha del servidor
const serverHTTP = app.listen(puerto, () => console.log('Servidor andando en puerto ',  puerto));
export const io = new Server(serverHTTP);

// Web sockets
io.on("connection", async socket => {
    socket.on("message", (message) => {
        console.log(message);
    });

    console.log(`Se conectó un cliente con ID ${socket.id}`);

    // Emitir lista de productos al cliente
    const listOfProducts = await productManager.getProducts(); 
    socket.emit('sendProducts', listOfProducts);

    // Escuchar eventos de agregar producto
    socket.on("addProduct", async (objeto) => {
        await productManager.addProduct(objeto);
        const updatedListOfProducts = await productManager.getProducts(); 
        socket.emit('sendProducts', updatedListOfProducts);
    });

    // Escuchar eventos de eliminar producto
    socket.on("deleteProduct", async (id) => {
        console.log("Se recibió un evento para eliminar el producto con ID:", id);
        await productManager.deleteProductById(id);
        const updatedListOfProducts = await productManager.getProducts(); 
        socket.emit('sendProducts', updatedListOfProducts);
    });
});
