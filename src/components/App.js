import React, { useEffect, useState } from 'react';
import '../style.css';
import { Link } from 'react-router-dom';

function App() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [nameFilter, setNameFilter] = useState(""); // Filtro por nome
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [pokemonsPerPage] = useState(20); // Número de Pokémons por página

  // Função para carregar os Pokémons e seus detalhes
  async function loadAPI() {
    try {
      let url = 'https://pokeapi.co/api/v2/pokemon?limit=1000';
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
      setFilteredPokemons(pokemonDetails);  // Inicialmente, mostra todos os Pokémon
    } catch (err) {
      console.error("Erro ao carregar os Pokémons", err);
    }
  }

  // Filtra os Pokémons com base no nome
  useEffect(() => {
    let filtered = pokemons;

    if (nameFilter) {
      filtered = filtered.filter((pokemon) =>
        pokemon.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    setFilteredPokemons(filtered);
  }, [nameFilter, pokemons]);

  // Função para obter a classe de tipo do Pokémon
  function getPokemonClass(types) {
    if (types.length > 0) {
      return `pokemon-${types[0].type.name}`;
    }
    return 'pokemon-normal'; // Classe padrão caso não tenha tipo definido
  }

  // Função para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Páginas de Pokémon a serem mostradas
  const indexOfLastPokemon = currentPage * pokemonsPerPage;
  const indexOfFirstPokemon = indexOfLastPokemon - pokemonsPerPage;
  const currentPokemons = filteredPokemons.slice(indexOfFirstPokemon, indexOfLastPokemon);

  // Número total de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPokemons.length / pokemonsPerPage); i++) {
    pageNumbers.push(i);
  }

  // Gerar números de página ao redor da página atual
  const generatePageNumbers = () => {
    let pages = [];
    let totalPages = pageNumbers.length;

    if (totalPages <= 3) {
      pages = pageNumbers; // Exibir todas se houver 3 ou menos páginas
    } else {
      const prev = currentPage - 1;
      const next = currentPage + 1;

      if (currentPage === 1) {
        pages = [1, 2, 3];
      } else if (currentPage === totalPages) {
        pages = [totalPages - 2, totalPages - 1, totalPages];
      } else {
        pages = [prev, currentPage, next];
      }
    }

    return pages;
  };

  useEffect(() => {
    loadAPI();
  }, []);

  return (
    <div className="App">
      {/* Filtro por nome */}
      <div className="filters">
        <input
          type="text"
          placeholder="Filtrar por nome"
          value={nameFilter}
          onChange={(e) => setNameFilter(e.target.value)}
        />
      </div>

      {/* Lista de Pokémon filtrados */}
      <div className="pokemon-list">
        {currentPokemons.length > 0 ? (
          currentPokemons.map((pokemon) => (
            <Link to={`/pokemon/${pokemon.id}`} key={pokemon.id} className={`pokemon-card ${getPokemonClass(pokemon.types)}`}>
              <img src={pokemon.sprites.front_default} alt={pokemon.name} />
              <div className='pokemon-name'>{pokemon.name}</div>
              <div className='pokemon-description-pai'>
                <div>Tipo: {pokemon.types.map(t => t.type.name).join(', ')}</div>
                <div>ID: {pokemon.id}</div>
                <div>Peso: {pokemon.weight / 10}kg</div>
                <div>Altura: {pokemon.height / 10}m</div>
              </div>
            </Link>
          ))
        ) : (
          <p>Carregando...</p>
        )}
      </div>

      {/* Controles de paginação */}
      <div className="pagination">
        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
          Anterior
        </button>
        <div className="page-numbers">
          {generatePageNumbers().map((number) => (
            <button key={number} onClick={() => paginate(number)} className={currentPage === number ? 'active' : ''}>
              {number}
            </button>
          ))}
        </div>
        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === pageNumbers.length}>
          Próximo
        </button>
      </div>
    </div>
  );
}

export default App;
