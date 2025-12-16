const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importa el pool de conexión a la base de datos
const db = require('./config/db'); 

//Importar el módulo de rutas de autenticación
const authRoutes = require('./routes/auth_routes.js'); 

const archivosRoutes = require('./routes/archivo_routes.js');

const app = express();
const PORT = process.env.PORT || 3000;

// -----------------------------------------------------------------
// MIDDLEWARES GLOBALES
// -----------------------------------------------------------------

// Middleware para habilitar CORS (comunicación con Angular)
app.use(cors()); 

// Middleware para parsear JSON 
app.use(express.json());

// -----------------------------------------------------------------
// CONEXIÓN DE RUTAS
// -----------------------------------------------------------------
// Conecta authRoutes al prefijo /api/usuarios
app.use('/api/usuarios', authRoutes); 

app.use('/api/archivos', archivosRoutes);
// -----------------------------------------------------------------
// Rutas de prueba 
// -----------------------------------------------------------------
app.get('/', (req, res) => {
    res.status(200).json({
        mensaje: 'API de Sonora funcionando. Lista para recibir peticiones.',
        estado: 'OK'
    });
});

// -----------------------------------------------------------------
// Iniciar Servidor
// -----------------------------------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en http://localhost:${PORT}`);
});