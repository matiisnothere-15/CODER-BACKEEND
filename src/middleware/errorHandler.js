import { ERROR_TYPES } from "../utils/errorTypes.js";

// Middleware para manejar errores globalmente
export const errorHandler = (err, req, res, next) => {
    // Imprime el error en la consola para depuración
    console.error(err);

    // Manejo de errores de tipo 'CastError', común en mongoose cuando se pasa un ID inválido
    if (err.name === 'CastError') {
        return res.status(400).json({
            error: `El id proporcionado para el ${err.path} es inválido. Debe ser un string hex de 24 caracteres.`,
            code: 400 // Código de estado 400 para errores de solicitud incorrecta
        });
    }

    // Maneja errores personalizados que contienen un código de estado y un mensaje
    if (err.code && err.message) {
        return res.status(err.code).json({ error: err.message });
    }

    // Si no se reconoce el tipo de error, responde con un error interno del servidor (500)
    res.status(500).json({ error: ERROR_TYPES.INTERNAL_SERVER_ERROR.message });
};
