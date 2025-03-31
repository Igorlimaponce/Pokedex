const express = require('express');
const router = express.Router();
const { Client } = require('pg');  // Requerendo o cliente PostgreSQL

// Conexão com o banco de dados
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

client.connect();

// Rota de registro
router.post('/register', async (req, res) => {
  const { username, password, favoritePokemon } = req.body;

  try {
    const result = await client.query(
      'INSERT INTO users (username, password, favorite_pokemon) VALUES ($1, $2, $3) RETURNING *',
      [username, password, favoritePokemon]
    );
    res.status(200).json({ username: result.rows[0].username });
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1 AND password = $2',
      [username, password]
    );

    if (result.rows.length > 0) {
      res.status(200).json({ message: 'Login bem-sucedido!' });
    } else {
      res.status(403).json({ error: 'Credenciais inválidas' });
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

module.exports = router;
