// App.js
import React, { useEffect, useState } from 'react';
import '../style.css';
import { Link } from 'react-router-dom';

function App() {
  const [pokemons, setPokemons] = useState([]);

  async function loadAPI() {
    try {
      let url = 'https://pokeapi.co/api/v2/pokemon?limit=100';
      let response = await fetch(url);
      let json = await response.json();
      
      // Carregar detalhes de cada Pokémon
      const pokemonDetails = await Promise.all(
        json.results.map(async (pokemon) => {
          let res = await fetch(pokemon.url);
          return await res.json();
        })
      );
      
      setPokemons(pokemonDetails);
    } catch (err) {
      console.error("Erro ao carregar os Pokémons", err);
    }
  }

  useEffect(() => {
    loadAPI();
  }, []);

  function getPokemonClass(types) {
    if (types.length > 0) {
      return `pokemon-${types[0].type.name}`;
    }
    return 'pokemon-normal'; // Classe padrão caso não tenha tipo definido
  }

  return (
    <div className="App">
      <div className="pokemon-list">
        {pokemons.length > 0 ? (
          pokemons.map((pokemon) => (
            <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id} className={`pokemon-card ${getPokemonClass(pokemon.types)}`}>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <div className='pokemon-name'>{pokemon.name}</div>
              <div className='pokemon-description-pai'> 
                <div>Tipo: {pokemon.types.map(t => t.type.name).join(', ')}</div>
                <div>N: {pokemon.id}</div>
                <div>Peso: {pokemon.weight / 10}kg</div>
                <div>Altura: {pokemon.height / 10}m</div>
              </div>
            </Link>
          ))
        ) : (
          <p>Carregando...</p>
        )}
      </div>
    </div>
  );
}

export default App;
