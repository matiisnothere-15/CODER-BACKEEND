import express from 'express';
import path from 'path';
import { engine } from 'express-handlebars';
import { Server } from 'socket.io';
import session from 'express-session';
import passport from 'passport';
import mongoose from './config/db.js';
import { router as vistasRouter } from './routes/vistas.router.js';
import { router as cartRouter } from './routes/cartRouter.js';
import { router as productRouter } from './routes/productRouter.js';
import userRouter from './routes/userRouter.js';
import { messageModelo } from './dao/models/messageModelo.js';
import authRouter from './routes/auth.js';
import sessionRouter from './routes/session.js';
import cookieParser from 'cookie-parser';
import './config/passport.config.js';
import { PORT, SESSION_SECRET, DB_CONNECTION_STRING } from './config/config.js';
import generateMockProducts from './mocking.js';
import errorHandler from './middleware/errorHandler.js';
import logger from './config/logger.js';
import paymentRoutes from './routes/paymentRoutes.js'; // Importa las rutas de pago

// Integración de Swagger
const swaggerApp = require('./src/swagger');

const app = express();

// Configuración del motor de vistas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(process.cwd(), 'public')));
app.use(session({ 
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false 
}));

// Middleware de Swagger 
app.use(swaggerApp);

// Inicialización de Passport
import { initializePassport } from './config/passport.config.js';
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/api/users', userRouter);
app.use('/', vistasRouter);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/auth', authRouter);
app.use('/session', sessionRouter);
app.use('/api/payments', paymentRoutes); 

// Endpoint para generar productos de prueba
app.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

// Manejo de usuarios conectados a través de Socket.IO
let usuarios = [];
const server = app.listen(PORT, () => {
    logger.info(`Servidor escuchando en el puerto ${PORT}`); 
});

export const io = new Server(server);

io.on("connection", (socket) => {
    logger.info(`Se conectó el cliente ${socket.id}`); 

    socket.on("id", async (userName) => {
        usuarios[socket.id] = userName;
        let messages = await messageModelo.find();
        socket.emit("previousMessages", messages);
        socket.broadcast.emit("newUser", userName);
    });

    socket.on("newMessage", async (userName, message) => {
        await messageModelo.create({ user: userName, message: message });
        io.emit("sendMessage", userName, message);
    });

    socket.on("disconnect", () => {
        const userName = usuarios[socket.id];
        delete usuarios[socket.id];
        if (userName) {
            io.emit("userDisconnected", userName);
        }
    });
});

// Conexión a la base de datos MongoDB
const connDB = async () => {
    try {
        await mongoose.connect(
            DB_CONNECTION_STRING,
            { useNewUrlParser: true, useUnifiedTopology: true, dbName: "eCommerce" }
        );
        logger.info("Mongoose conectado");  
    } catch (error) {
        logger.error("Error al conectar a MongoDB", error);  
    }
};

connDB();

// Middleware de manejo de errores 
app.use(errorHandler);

// Endpoint para probar el logger
app.get('/loggerTest', (req, res) => {
    logger.debug('Debug log');
    logger.http('HTTP log');
    logger.info('Info log');
    logger.warn('Warning log');
    logger.error('Error log');
    logger.fatal('Fatal log');
    res.send('Logs probados!');
});

export { app };