import React, { useEffect, useState } from 'react';
import './App.css';
import './style.css';

function App() {
  const [pokemon, setPokemon] = useState(null);

  function loadAPI() {
    let url = 'https://pokeapi.co/api/v2/pokemon/zorua';
    fetch(url)
      .then(response => response.json())
      .then(json => setPokemon(json))
      .catch(err => console.log(err));
  }

  useEffect(() => {
    loadAPI();
  }, []);

  return (
    <div className="App">
      <header>
        <strong> Pokedex </strong>
      </header>

      {pokemon ? (
        <div>
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          <div> Name: {pokemon.name}</div>
          <div> N: {pokemon.id}</div>
          <div> Peso: {pokemon.weight / 10}kg</div>
          <div> Altura: {pokemon.height / 10}m</div>
        </div>
      ) : (
        <p>Carregando...</p>
      )}
    </div>
  );
}

export default App;
