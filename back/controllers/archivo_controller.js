const multer = require('multer');
const path = require('path');
const db = require('../config/db');

const storage = multer.diskStorage({
    destination: 'archivos/', 
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single('archivo');

exports.subirArchivo = (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).json({ mensaje: 'Error al subir archivo físico' });

        // Datos recibidos de Angular
        const { titulo, autor, id_usuario_fk } = req.body; 
        const { filename } = req.file;
        const url_audio = `/archivos/${filename}`;

        try {
            // 1. BUSCAR AUTOR: Usamos 'nombre_artistico' que es tu columna real
            let [autorDb] = await db.query(
                'SELECT id_autor FROM autor WHERE nombre_artistico = ? AND id_usuario_fk = ?', 
                [autor, id_usuario_fk]
            );

            let id_autor_final;

            if (autorDb.length > 0) {
                id_autor_final = autorDb[0].id_autor;
            } else {
                // 2. CREAR AUTOR: Si no existe, lo insertamos con 'nombre_artistico'
                const [nuevoAutor] = await db.query(
                    'INSERT INTO autor (nombre_artistico, id_usuario_fk) VALUES (?, ?)', 
                    [autor, id_usuario_fk]
                );
                id_autor_final = nuevoAutor.insertId;
            }

            // 3. INSERTAR CANCIÓN: 
            // Añadimos id_licencia_fk = 1 (Asegúrate de tener una licencia con ID 1 en tu tabla licencias)
            const sqlCancion = `
                INSERT INTO canciones 
                (titulo, id_autor_fk, url_audio, fecha_catalogo, reproducciones, descargas, id_licencia_fk) 
                VALUES (?, ?, ?, NOW(), 0, 0, 1)
            `;

            await db.query(sqlCancion, [titulo, id_autor_final, url_audio]);

            res.status(200).json({ mensaje: 'Canción y autor registrados correctamente' });

        } catch (error) {
            console.error('Error detallado en BBDD:', error);
            res.status(500).json({ mensaje: 'Error al guardar en la base de datos', detalle: error.message });
        }
    });
};