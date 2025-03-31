import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Radar } from 'react-chartjs-2';
import { Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import '../style.css';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function PokemonDetail() {
  const [pokemon, setPokemon] = useState(null);
  const [evolutionChain, setEvolutionChain] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    async function loadPokemonDetails() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const data = await response.json();
        setPokemon(data);
      } catch (error) {
        console.error("Erro ao carregar os detalhes do Pokémon", error);
      }
    }

    loadPokemonDetails();
  }, [id]);

  useEffect(() => {
    async function loadEvolutionChain() {
      if (!pokemon) return;

      try {
        const speciesResponse = await fetch(pokemon.species.url);
        const speciesData = await speciesResponse.json();
        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        const evolutionData = await evolutionResponse.json();

        const chain = [];
        let current = evolutionData.chain;

        while (current) {
          const pokeId = current.species.url.split('/').slice(-2, -1)[0]; // Pegando o ID do Pokémon
          const pokeResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokeId}`);
          const pokeData = await pokeResponse.json();
          chain.push({
            name: current.species.name,
            id: pokeId,
            types: pokeData.types.map(t => t.type.name),
          });
          current = current.evolves_to.length > 0 ? current.evolves_to[0] : null;
        }

        setEvolutionChain(chain);
      } catch (error) {
        console.error("Erro ao carregar a cadeia de evolução", error);
      }
    }

    loadEvolutionChain();
  }, [pokemon]);

  if (!pokemon) return <p>Carregando...</p>;

  const chartData = {
    labels: ['HP', 'Ataque', 'Defesa', 'Ataque Especial', 'Defesa Especial', 'Velocidade'],
    datasets: [
      {
        label: `${pokemon.name} - Estatísticas`,
        data: pokemon.stats.map(stat => stat.base_stat),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Função para obter a classe de tipo do Pokémon
  function getPokemonClass(types) {
    if (types.length > 0) {
      return `pokemon-${types[0]}`; // Usa o primeiro tipo como classe
    }
    return 'pokemon-normal'; // Classe padrão caso não tenha tipo definido
  }

  return (
    <div className="pokemon-detail">
      <div className='pokemon-header-PokemonDetail'>
        <h1>{pokemon.name}</h1>
      </div>
      <div className="pokemon-container">
        <div className="pokemon-cantainer-img-chart">
          <div className="pokemon-image">
            <img src={pokemon.sprites.front_default} alt={pokemon.name} />
          </div>

          <div className="pokemon-stats-chart">
            <Radar data={chartData} />
          </div>
        </div>

        <div className="pokemon-description">
          <h2>Detalhes do Pokémon</h2>
          <div><strong>Tipo(s):</strong> {pokemon.types.map(t => t.type.name).join(', ')}</div>
          <div><strong>ID:</strong> {pokemon.id}</div>
          <div><strong>Peso:</strong> {pokemon.weight / 10} kg</div>
          <div><strong>Altura:</strong> {pokemon.height / 10} m</div>

          <h3>Habilidades</h3>
          <div>{pokemon.abilities.map(a => a.ability.name).join(', ')}</div>

          <h3>Estatísticas</h3>
          {pokemon.stats.map(stat => (
            <div key={stat.stat.name}>{stat.stat.name}: {stat.base_stat}</div>
          ))}

          <h3>Movimentos</h3>
          <div>{pokemon.moves.slice(0, 5).map(move => move.move.name).join(', ')}</div>

          <div className="pokemon-description-text">
            <h3>Sobre {pokemon.name}</h3>
            <p>{pokemon.name} é um Pokémon do tipo {pokemon.types[0].type.name}, conhecido por sua velocidade e poder de ataque.</p>
          </div>
        </div>
      </div>
      <div className='pokemon-arvore-evolucao'>
        <h2>Árvore de Evolução</h2>
        <div className='pokemon-arvore-evolucao-card'>
          {evolutionChain.map((poke, index) => (
            <Link key={index} to={`/pokemon/${poke.id}`} className={`evolution-item ${getPokemonClass(poke.types)}`}>
              <img 
                src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${poke.id}.png`} 
                alt={poke.name} 
              />
              <p>{poke.name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
