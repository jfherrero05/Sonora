const mysql = require('mysql2/promise'); 
require('dotenv').config(); 

// Configuración de la conexión 
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Prueba de conexión
async function testConnection() {
    try {
        await pool.getConnection();
        console.log('Conexión con la base de datos MySQL.');
    } catch (error) {
        console.error('Error al conectar con la base de datos:', error.message);
        process.exit(1); // Sale de la aplicación si no puede conectar
    }
}

testConnection();

module.exports = pool;