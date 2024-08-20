const multer = require('multer');
const path = require('path');

// Configuración del almacenamiento
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let folder = 'documents'; // Valor por defecto
        if (file.mimetype.includes('image/')) {
            if (file.originalname.includes('profile')) {
                folder = 'profiles';
            } else if (file.originalname.includes('product')) {
                folder = 'products';
            }
        }
        cb(null, path.join(__dirname, '..', 'uploads', folder));
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Guardar el archivo con un nombre único
    }
});

const upload = multer({ storage });

module.exports = upload;
