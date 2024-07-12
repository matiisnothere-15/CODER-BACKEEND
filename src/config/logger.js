import { createLogger, format, transports } from 'winston';
import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';


const logFormat = printf(({ level, message, timestamp, stack }) => {
  // Incluimos el stack trace solo para errores
  return `${timestamp} ${level}: ${message} ${stack ? '\n' + stack : ''}`;
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug', 
  format: combine(
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss', 
    }),
    logFormat,
    format.errors({ stack: true }) 
  ),
  transports: [
    new transports.Console({
      format: format.combine(
        colorize({ all: true }), 
        logFormat
      )
    }),
    new DailyRotateFile({
      filename: 'logs/application-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true,
      maxSize: '20m',
      maxFiles: '14d'
    })
  ],
});


// Manejo de excepciones no capturadas
process.on('uncaughtException', (err) => {
  logger.error('Excepción no capturada', err);
  process.exit(1); 
});

// Manejo de promesas rechazadas
process.on('unhandledRejection', (err) => {
  logger.error('Promesa rechazada', err);
});

export default logger;
