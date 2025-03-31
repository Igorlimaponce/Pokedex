import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../login.css';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [favoritePokemon, setFavoritePokemon] = useState('');
  const [pokemons, setPokemons] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');  // Para armazenar mensagens de erro

  useEffect(() => {
    async function fetchPokemons() {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50');
        setPokemons(response.data.results);
      } catch (error) {
        console.error("Erro ao carregar Pokémon", error);
        setErrorMessage("Erro ao carregar Pokémon, tente novamente.");
      }
    }
    fetchPokemons();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!favoritePokemon) {
      setErrorMessage("Selecione um Pokémon favorito.");
      return;  // Não faz o submit se o Pokémon favorito não for selecionado
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        password,
        favoritePokemon
      });
      alert(`Usuário ${response.data.username} cadastrado com sucesso!`);
      setErrorMessage('');  // Limpa a mensagem de erro após sucesso
    } catch (error) {
      console.error('Erro ao registrar usuário', error);
      setErrorMessage("Erro ao cadastrar usuário. Tente novamente.");
    }
  };

  return (
    <div className="login-container">
      <h2>Registrar</h2>

      {/* Exibição de erro */}
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <form onSubmit={handleSubmit}>
        <label>Usuário:</label>
        <input 
          type="text" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
        />

        <label>Senha:</label>
        <input 
          type="password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />

        <label>Pokémon Favorito:</label>
        <select 
          value={favoritePokemon} 
          onChange={(e) => setFavoritePokemon(e.target.value)} 
          required
        >
          <option value="">Selecione um Pokémon</option>
          {pokemons.map((pokemon) => (
            <option key={pokemon.name} value={pokemon.name}>
              {pokemon.name}
            </option>
          ))}
        </select>

        <button type="submit">Registrar</button>
      </form>

      {/* Exibe a imagem do Pokémon favorito */}
      {favoritePokemon && (
        <div className="pokemon-preview">
          <h3>Pokémon Escolhido:</h3>
          <p>{favoritePokemon}</p>
          <img 
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemons.find(p => p.name === favoritePokemon)?.url.split('/')[6]}.png`} 
            alt={favoritePokemon} 
          />
        </div>
      )}
    </div>
  );
};

export default Login;
