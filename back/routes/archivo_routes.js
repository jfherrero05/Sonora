const express = require('express');
const router = express.Router();
const archivoController = require('../controllers/archivo_controller'); // Asegúrate de que la ruta al controller sea correcta

// Definimos el endpoint /subir
// La ruta completa será /api/archivos/subir
router.post('/subir', archivoController.subirArchivo);

module.exports = router;