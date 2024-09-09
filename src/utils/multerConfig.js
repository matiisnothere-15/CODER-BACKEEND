import multer from "multer";
import path from "path";
import fs from 'fs';
import __dirname from "../utils.js"; 

// Define el directorio de subida de archivos
const uploadDir = path.join(__dirname, "../uploads/");

// Verifica si el directorio de uploads existe, si no, lo crea
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true }); // Crea el directorio de manera recursiva si es necesario
}

// Configuración de almacenamiento para Multer
const storage = multer.diskStorage({
    // Define el destino de los archivos según el tipo de documento
    destination: function (req, file, cb) {
        const docType = file.fieldname;  // Obtiene el tipo de archivo del campo 'fieldname' del archivo
        let uploadPath = path.join(uploadDir);  // Ruta base de uploads

        // Define subcarpetas dependiendo del tipo de archivo
        if (docType === "profileImage") {
            uploadPath = path.join(uploadPath, "profiles/");  // Carpeta para imágenes de perfil
        } else if (docType === "productsImage") {
            uploadPath = path.join(uploadPath, "products/");  // Carpeta para imágenes de productos
        } else if (["Identificacion", "Comprobante de domicilio", "Comprobante de estado de cuenta"].includes(docType)) {
            uploadPath = path.join(uploadPath, "documents/");  // Carpeta para documentos personales
        }

        // Verifica si la subcarpeta existe, si no, la crea
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });  // Crea la subcarpeta si no existe
        }

        cb(null, uploadPath);  // Pasa la ruta de destino a Multer
    },
    // Configura el nombre del archivo subido
    filename: function (req, file, cb) {
        // Genera un nombre único para el archivo utilizando la fecha actual y el nombre original del archivo
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Inicializa Multer con la configuración de almacenamiento
const upload = multer({ storage });

export default upload;
