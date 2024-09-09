import express from "express";
import { engine } from "express-handlebars";
import { Server } from 'socket.io';
import loggerTestRouter from './routers/loggerTest.js';
import resetPasswordRouter from './routers/resetPassword.js';
import productsRouter from "./routers/products.js";
import cartsRouter from "./routers/carts.js";
import views from "./routers/views.js";
import sessionsRouter from "./routers/sessions.js";
import __dirname from "./utils.js";
import path from "path";
import sessions from 'express-session';
import { dbConnection } from "./database/config.js";
import { messageModel } from "./dao/models/messages.js";
import { addProductService, getProductsService } from "./services/productsManagerDBService.js";
import { auth } from "./middleware/auth.js";
import { initPassport } from "./config/passport.config.js";
import passport from "passport";
import { config } from "./config/config.js";
import { errorHandler } from "./middleware/errorHandler.js";
import loggerMiddleware from "./middleware/loggerMiddleware.js";
import logger from "./config/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUI from "swagger-ui-express";

const app = express();
const PORT = config.PORT;

// Middleware para logging de las solicitudes
app.use(loggerMiddleware);

// Middleware para parsear JSON y datos codificados en URL
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos desde el directorio 'public'
app.use(express.static('public'));

// Configuración de la sesión
app.use(sessions({
    secret: config.SECRET,
    resave: true,
    saveUninitialized: true
}));

// Configuración de Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Ecommerce-Coder API",
            version: "1.0.0",
            description: "API para la gestión de productos y carritos en proyecto ecommerce",
            contact: {
                name: "Matias Riquelme",
                email: "matiasriquelme633@gmail.com",
            },
        },
        servers: [
            {
                url: "http://localhost:3000",
                description: "Servidor local",
            },
        ],
    },
    apis: ["./docs/*.yaml"]
};
const spec = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(spec));

// Inicializar Passport
initPassport();
app.use(passport.initialize());
app.use(passport.session());

// Configuración del motor de plantillas Handlebars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// Middleware para manejo de errores
app.use(errorHandler);

// Definición de rutas
app.use('/', views);
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use("/api/sessions", sessionsRouter);
app.use('/api/reset', resetPasswordRouter);
app.use('/loggerTest', loggerTestRouter);

// Conexión a la base de datos
await dbConnection();

// Iniciar el servidor Express
const expressServer = app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});

// Configuración del servidor WebSocket
const socketServer = new Server(expressServer);

// Manejo de conexiones WebSocket
socketServer.on('connection', async (socket) => {
    logger.info('Usuario conectado desde el frontend');

    try {
        // Enviar productos actuales al cliente cuando se conecta
        const { payload } = await getProductsService({});
        socket.emit('productos', payload);

        // Manejar la adición de productos desde el cliente
        socket.on('agregarProducto', async (producto) => {
            try {
                const newProduct = await addProductService({ ...producto });
                if (newProduct) {
                    const productos = await getProductsService({});
                    socket.emit('productos', productos.payload);
                }
            } catch (error) {
                logger.error("Error al agregar producto: ", error);
            }
        });

        // Enviar mensajes almacenados al cliente
        const messages = await messageModel.find().lean();
        socket.emit('message', messages);

        // Manejar la recepción de mensajes desde el cliente
        socket.on('message', async (data) => {
            try {
                const newMessage = await messageModel.create({ ...data });
                if (newMessage) {
                    const messages = await messageModel.find().lean();
                    socketServer.emit('messageLogs', messages);
                }
            } catch (error) {
                logger.error("Error al procesar mensaje: ", error);
            }
        });

        // Manejar la eliminación de todos los mensajes
        socket.on('delete', async () => {
            try {
                await messageModel.deleteMany();
            } catch (error) {
                logger.error("Error al eliminar mensajes: ", error);
            }
        });

        // Notificar a otros usuarios sobre la conexión de un nuevo usuario
        socket.broadcast.emit('nuevo_user');

    } catch (error) {
        logger.error("Error en la conexión WebSocket: ", error);
    }
});

export default app;
