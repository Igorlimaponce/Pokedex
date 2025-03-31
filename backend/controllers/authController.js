const bcrypt = require('bcrypt');
const pool = require('../db');

const registerUser = async (req, res) => {
  const { username, password, favoritePokemon } = req.body;
  
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (username, password, favorite_pokemon) VALUES ($1, $2, $3) RETURNING *',
      [username, hashedPassword, favoritePokemon]
    );
    
    res.status(201).json({ username: result.rows[0].username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao registrar usuário' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const user = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (user.rows.length === 0) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const isValidPassword = await bcrypt.compare(password, user.rows[0].password);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Senha incorreta' });
    }

    res.status(200).json({ username: user.rows[0].username, favoritePokemon: user.rows[0].favorite_pokemon });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao fazer login' });
  }
};

module.exports = { registerUser, loginUser };
