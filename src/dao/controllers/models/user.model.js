import mongoose from 'mongoose';

// Definición del esquema de usuario
const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'] // El nombre es obligatorio
    },
    email: {
        type: String,
        unique: true, // El correo debe ser único en la base de datos
        required: [true, 'El correo electrónico es obligatorio'] // El correo es obligatorio
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'] // La contraseña es obligatoria
    },
    age: {
        type: Number,
        required: [true, 'La edad es obligatoria'] // La edad es obligatoria
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'carts' // Referencia al carrito asociado al usuario
    },
    rol: {
        type: String,
        enum: ['user', 'premium', 'admin'], // Definición de roles permitidos
        default: 'user' // Valor predeterminado: 'user'
    },
    resetPasswordToken: String, // Token de restablecimiento de contraseña
    resetPasswordExpires: Date, // Fecha de expiración del token de restablecimiento
    documents: [
        {
            name: { type: String, required: [true, 'El nombre del documento es obligatorio'] }, // Nombre del documento
            reference: { type: String, required: [true, 'La referencia del documento es obligatoria'] } // Referencia del documento
        }
    ],
    last_connection: {
        type: Date,
        default: Date.now // Guarda la última conexión del usuario, por defecto la fecha actual
    }
});

// Exporta el modelo de usuario basado en el esquema
export const userModel = mongoose.model('usuarios', userSchema);
