const express = require('express');
const cors = require('cors');
const pool = require('./db');

const app = express();

// MIDDLEWARES
app.use(cors());
app.use(express.json());

// RUTAS
app.get('/hola-mundo', (req, res) => {
  res.send('Hello World!');
});

// GET - Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const resultado = await pool.query('SELECT * FROM usuarios');
    res.json(resultado.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST - Crear usuario
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, apaterno, amaterno, edad, telefono, email } = req.body;
    
    if (!nombre || !apaterno) {
      return res.status(400).json({ error: 'Nombre y apellido paterno son requeridos' });
    }
    
    const nuevo = await pool.query(
      'INSERT INTO usuarios (nombre, apaterno, amaterno, edad, telefono, email) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, apaterno, amaterno || null, edad || null, telefono || null, email || null]
    );
    res.status(201).json(nuevo.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE - Eliminar usuario
app.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
    res.json({ mensaje: "Usuario eliminado correctamente" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LISTEN
const PORT = 6025; // Puerto a usar
app.listen(PORT, () => {
  console.log(`Servidor de Usuarios escuchando en http://localhost:${PORT}`);
});
