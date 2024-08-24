const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const upload = require('../middleware/multerConfig'); 

// Ruta para obtener todos los usuarios
router.get('/', userController.getAllUsers);

// Ruta para eliminar usuarios inactivos
router.delete('/', userController.deleteInactiveUsers);

// Ruta para actualizar a un usuario a premium
router.patch('/premium/:uid', userController.updateUserToPremium);

// Endpoint para subir documentos 
router.post('/:uid/documents', upload.array('documents'), userController.uploadDocuments);

module.exports = router;
