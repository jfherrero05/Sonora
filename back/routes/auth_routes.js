const express = require('express');
const router = express.Router(); // Objeto para manejar rutas
// Importamos las funciones que escribimos en el controlador
const authController = require('../controllers/auth_controller');

// Definición de los endpoints de autenticación

// Endpoint: POST /api/usuarios/registro
router.post('/registro', authController.registro);

// Endpoint: POST /api/usuarios/login
router.post('/login', authController.login);

// Exportar el router para usarlo en server.js
module.exports = router;