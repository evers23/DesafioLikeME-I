import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch'; // Asegúrate de que node-fetch esté instalado
import pkg from 'pg';

const { Pool } = pkg;

const app = express();
const port = 3000;

// Configurar middleware
app.use(cors({
    origin: 'http://localhost:5173' 
}));
app.use(express.json());

// Configuración de la conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'likeme',
    password: '1234',
    port: 5432,
});

// Ruta GET para obtener todos los posts
app.get('/posts', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM posts');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Ruta POST para crear un nuevo post
app.post('/posts', async (req, res) => {
    const { titulo, img, descripcion, likes } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, $4) RETURNING *',
            [titulo, img, descripcion, likes]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Solicitud GET con fetch desde Node.js
async function fetchPosts() {
    try {
        const response = await fetch('http://localhost:3000/posts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        console.log('Fetched posts:', data);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
}

// Llamar a la función fetchPosts (esto puede ser eliminado o cambiado según tus necesidades)
fetchPosts();

// Iniciar el servidor
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});





