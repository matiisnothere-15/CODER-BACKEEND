import express from "express";
import path from "path";
import { engine } from "express-handlebars";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { router as vistasRouter } from './routes/vistas.router.js';
import { router as cartRouter } from './routes/cartRouter.js';
import { router as productRouter } from './routes/productRouter.js';
import { messageModelo } from "./dao/models/messageModelo.js";
import { productsModelo } from "./dao/models/productsModelo.js";

const PORT = process.env.PORT || 8080;
const app = express();

// Configuración del motor de vistas Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(process.cwd(), 'views'));

// Middleware para manejar datos JSON y URL codificados
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(process.cwd(), 'public')));

// Rutas
app.use('/', vistasRouter);
app.use('/api/product', productRouter);
app.use('/api/carts', cartRouter);

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
            "mongodb+srv://matiisnothere:CoderCoder@cluster0.bqr5bqp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
            { dbName: "eCommerce" }
        );
        console.log("Mongoose activo");
    } catch (error) {
        console.error("Error al conectar a la base de datos:", error);
    }
};

connDB(); // Llamar a la función para conectar a la base de datos

export { app }; // Exportar app
