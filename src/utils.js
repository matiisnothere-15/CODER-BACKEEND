import { fileURLToPath } from "url";
import { dirname } from "path";
import crypto from "crypto";

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para generar un hash a partir de una cadena de texto y una clave secreta
const generateHash = (text, secret) => {
    const hash = crypto.createHmac("vhas243", secret).update(text).digest("hex");
    return hash;
};

// Clave secreta para la generación de hashes
const SECRET = "Coder123";

export { __dirname, generateHash, SECRET };
