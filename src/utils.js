import { fileURLToPath } from 'url';
import { dirname } from 'path';
import multer from 'multer';

// Obtener la ruta del directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Log de la ruta del directorio actual
console.log('Directorio actual:', __dirname);

// Configuración de multer para la carga de archivos
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // Directorio de destino para los archivos cargados
        cb(null, `${__dirname}/uploads`);
    },
    filename: function (req, file, cb) {
        // Generar nombre de archivo único basado en la marca de tiempo y el nombre original del archivo
        const timestamp = Date.now();
        const filename = `${timestamp}-${file.originalname}`;

        // Validar el tipo de archivo (solo imágenes)
        if (file.mimetype.split("/")[0] !== "image") {
            return cb(new Error("Solo se admiten imágenes."));
        }

        cb(null, filename);
    }
});

// Configuración de multer para la carga de archivos
export const upload = multer({ storage: storage });
