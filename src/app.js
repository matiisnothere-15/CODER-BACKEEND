import express from "express";
import path from "path";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import session from "express-session";
import passport from "passport";
import mongoose from "./config/db.js";
import { router as vistasRouter } from './routes/vistas.router.js';
import { router as cartRouter } from './routes/cartRouter.js';
import { router as productRouter } from './routes/productRouter.js';
import { messageModelo } from "./dao/models/messageModelo.js";
import authRouter from './routes/auth.js'; 
import sessionRouter from './routes/session.js';
import cookieParser from 'cookie-parser';
import './config/passport.config.js'; 

const PORT = process.env.PORT || 8080;
const app = express();

// Configuración del motor de vistas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware para manejar datos JSON y URL codificados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 
app.use(express.static(path.join(process.cwd(), 'public')));

// Configuración de la sesión
app.use(session({
    secret: 'yourSecret', 
    resave: false,
    saveUninitialized: false
}));

// Inicializar Passport y la sesión de Passport
import { initializePassport } from './config/passport.config.js';
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Rutas
app.use('/', vistasRouter);
app.use('/api/product', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/auth', authRouter); 
app.use('/api/sessions', sessionRouter);

// Manejo de usuarios conectados a través de Socket.IO
let usuarios = [];
const server = app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});

export const io = new Server(server);

io.on("connection", (socket) => {
    console.log(`Se conectó el cliente ${socket.id}`);

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
            "mongodb+srv://<usuario>:<contraseña>@cluster0.mongodb.net/eCommerce?retryWrites=true&w=majority",
            { useNewUrlParser: true, useUnifiedTopology: true, dbName: "eCommerce" }
        );
        console.log("Mongoose activo");
    } catch (error) {
        console.log("Error al conectar a DB", error.message);
    }
};

connDB();

export { app }; // Exportar app
