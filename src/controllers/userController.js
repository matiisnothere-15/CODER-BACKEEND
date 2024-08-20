const User = require('../models/User'); // Asegúrate de que el modelo de usuario esté bien importado

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
