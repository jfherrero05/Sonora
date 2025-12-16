const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); 
require('dotenv').config(); 

// -----------------------------------------------------------------
// Generar el JWT
// -----------------------------------------------------------------
const generarToken = (usuario) => {
    // Datos que queremos incluir en el token 
    const payload = {
        id: usuario.id_usuario,
        nombre_usuario: usuario.nombre_usuario,
        es_administrador: usuario.es_administrador
    };
    // Combinar el token con la clave secreta y definir la expiración
    return jwt.sign(
        payload,
        process.env.SECRET_KEY, 
        { expiresIn: '1d' }    // El token expira en 1 día
    );
};

// -----------------------------------------------------------------
// Controlador para REGISTRAR un nuevo usuario
// -----------------------------------------------------------------
exports.registro = async (req, res) => {
    const { nombre_usuario, email, password } = req.body;

    if (!nombre_usuario || !email || !password) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios: nombre_usuario, email y password.' });
    }

    try {
        //Verificar si el usuario ya existe
        const [existeUsuario] = await db.query(
            'SELECT id_usuario FROM Usuarios WHERE email = ? OR nombre_usuario = ?',
            [email, nombre_usuario]
        );

        if (existeUsuario.length > 0) {
            return res.status(409).json({ mensaje: 'El email o el nombre de usuario ya se encuentra en uso.' });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        // Insertar el usuario en la base de datos
        const [resultado] = await db.query(
            'INSERT INTO Usuarios (nombre_usuario, email, password_hash, fecha_registro) VALUES (?, ?, ?, NOW())',
            [nombre_usuario, email, password_hash]
        );

        // --- CAMBIOS PARA JWT EN REGISTRO ---
        const nuevoUsuario = {
            id_usuario: resultado.insertId,
            nombre_usuario: nombre_usuario,
            es_administrador: 0 
        };

        const token = generarToken(nuevoUsuario);

        // Respuesta 
        res.status(201).json({
            mensaje: 'Usuario registrado correctamente. Sesión iniciada.',
            token: token, // Enviamos el token para que el frontend inicie sesión automáticamente
            usuario: nuevoUsuario,
            id_usuario: usuario.id_usuario
        });

    } catch (error) {
        console.error('Error en el registro:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al registrar el usuario.' });
    }
};

// -----------------------------------------------------------------
// Controlador para LOGIN de un usuario 
// -----------------------------------------------------------------
exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ mensaje: 'Faltan campos obligatorios: email y password.' });
    }

    try {
        // Buscar el usuario por email
        // Seleccionamos todos los campos necesarios para el token y las comparaciones
        const [usuarios] = await db.query(
            'SELECT id_usuario, nombre_usuario, password_hash, es_administrador FROM Usuarios WHERE email = ?',
            [email]
        );

        const usuario = usuarios[0];

        // Verificar si el usuario existe
        if (!usuario) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
        }

        // Comparar la contraseña ingresada con el hash de la DB
        const esValida = await bcrypt.compare(password, usuario.password_hash);

        if (!esValida) {
            return res.status(401).json({ mensaje: 'Credenciales inválidas.' });
        }

        // Actualizar la última sesión
        await db.query('UPDATE Usuarios SET ultima_sesion = NOW() WHERE id_usuario = ?', [usuario.id_usuario]);

        // Generar Token JWT ---
        const token = generarToken(usuario);

        //Respuesta
        res.status(200).json({
            mensaje: 'Login exitoso.',
            token: token, // Esto es lo que el frontend guarda
            id_usuario: usuario.id_usuario,
            nombre_usuario: usuario.nombre_usuario
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor al iniciar sesión.' });
    }
};