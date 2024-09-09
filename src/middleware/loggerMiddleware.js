import logger from '../config/logger.js';

// Middleware para registrar solicitudes HTTP
const loggerMiddleware = (req, res, next) => {
    // Registra el método HTTP y la URL de cada solicitud
    logger.http(`${req.method} ${req.url}`);
    
    // Continúa con el siguiente middleware o controlador
    next();
};

export default loggerMiddleware;
