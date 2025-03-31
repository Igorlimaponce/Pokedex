const pool = require('../database');

const createUser = async (username, password, favoritePokemon) => {
  const query = 'INSERT INTO users (username, password, favorite_pokemon) VALUES ($1, $2, $3) RETURNING *';
  const values = [username, password, favoritePokemon];
  const result = await pool.query(query, values);
  return result.rows[0];
};

module.exports = { createUser };
