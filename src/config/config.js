
import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT;
export const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING;
export const SESSION_SECRET = process.env.SESSION_SECRET;
