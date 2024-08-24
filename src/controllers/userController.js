const User = require('../models/User'); // Asegúrate de que el modelo de usuario esté bien importado
const nodemailer = require('nodemailer');

// Función para obtener todos los usuarios
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}, 'name email role'); // Selecciona solo los campos principales
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error });
    }
};

// Función para eliminar usuarios inactivos
exports.deleteInactiveUsers = async (req, res) => {
    try {
        const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 días
        const inactiveUsers = await User.find({ lastLogin: { $lt: cutoff } });
        
        inactiveUsers.forEach(async (user) => {
            await User.findByIdAndDelete(user._id);
            sendDeletionEmail(user.email);
        });

        res.status(200).json({ message: 'Usuarios inactivos eliminados y correos enviados' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos', error });
    }
};

// Función para enviar correo de eliminación
function sendDeletionEmail(email) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tu-correo@gmail.com',
            pass: 'tu-contraseña'
        }
    });

    const mailOptions = {
        from: 'tu-correo@gmail.com',
        to: email,
        subject: 'Cuenta eliminada por inactividad',
        text: 'Tu cuenta ha sido eliminada debido a inactividad. Si crees que esto es un error, por favor contacta con soporte.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        } else {
            console.log('Correo enviado: ' + info.response);
        }
    });
}

// Función para actualizar a premium
exports.updateUserToPremium = async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const requiredDocuments = ['Identificación', 'Comprobante de domicilio', 'Comprobante de estado de cuenta'];
        const userDocuments = user.documents.map(doc => doc.name);

        const hasAllDocuments = requiredDocuments.every(doc => userDocuments.includes(doc));

        if (!hasAllDocuments) {
            return res.status(400).json({ message: 'No se han subido todos los documentos necesarios para ser premium' });
        }

        user.premium = true; // Marcar al usuario como premium
        await user.save();

        res.status(200).json({ message: 'Usuario actualizado a premium exitosamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar a premium', error });
    }
};

// Función para subir documentos
exports.uploadDocuments = async (req, res) => {
    try {
        const user = await User.findById(req.params.uid);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        req.files.forEach(file => {
            user.documents.push({ name: file.originalname, reference: file.path });
        });

        await user.save();

        res.status(200).json({ message: 'Documentos subidos exitosamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al subir documentos', error });
    }
};


// Función para eliminar usuarios inactivos
exports.deleteInactiveUsers = async (req, res) => {
    try {
        const cutoff = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 días
        const inactiveUsers = await User.find({ lastLogin: { $lt: cutoff } });
        
        for (let user of inactiveUsers) {
            await User.findByIdAndDelete(user._id);
            sendDeletionEmail(user.email);
        }

        res.status(200).json({ message: 'Usuarios inactivos eliminados y correos enviados' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuarios inactivos', error });
    }
};
