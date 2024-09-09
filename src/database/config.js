import mongoose from "mongoose";
import { config } from "../config/config.js";

// Función para establecer la conexión con la base de datos
export const dbConnection = async () => {
    try {
        // Conexión a la base de datos de MongoDB usando la URL de configuración
        await mongoose.connect(config.MONGO_URL);
        console.log('Conexión a la base de datos exitosa');
    } catch (error) {
        // Manejo de errores en caso de que la conexión falle
        console.error(`Error al conectar con la base de datos: ${error}`);
        process.exit(1); // Termina el proceso si hay un error crítico
    }
};
