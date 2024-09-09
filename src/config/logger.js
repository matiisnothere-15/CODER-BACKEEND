import winston from 'winston';
import colors from 'colors';
import { config } from './config.js';

const { combine, timestamp, printf } = winston.format;

// Definimos el tema de colores para los diferentes niveles de logs
colors.setTheme({
    debug: 'blue',
    http: 'magenta',
    info: 'green',
    warn: 'yellow',
    error: 'red',
    fatal: 'bgRed white'
});

// Formato personalizado para los logs
const logFormat = printf(({ level, message, timestamp }) => {
    const colorizedLevel = colors[level](`[${level.toUpperCase()}]`);
    return `${timestamp} ${colorizedLevel}: ${message}`;
});

// Logger para entornos de desarrollo
const developmentLogger = winston.createLogger({
    level: 'debug',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.Console()
    ]
});

// Logger para entornos de producción
const productionLogger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'errors.log', level: 'error' }) // Guarda solo errores en archivo
    ]
});

// Selecciona el logger dependiendo del entorno
const logger = config.ENTORNO === 'production' ? productionLogger : developmentLogger;

export default logger;
