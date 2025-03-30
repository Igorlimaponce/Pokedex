import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../style.css';

function PokemonDetail() {
  const [pokemon, setPokemon] = useState(null);
  const { id } = useParams(); // Pegando o ID da URL

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

  if (!pokemon) return <p>Carregando...</p>;

  // Função para formatar as habilidades
  const formatAbilities = (abilities) => {
    return abilities.map(a => a.ability.name).join(', ');
  };

  // Função para formatar as estatísticas
  const formatStats = (stats) => {
    return stats.map(stat => (
      <div key={stat.stat.name}>
        {stat.stat.name}: {stat.base_stat}
      </div>
    ));
  };

  // Função para formatar os movimentos
  const formatMoves = (moves) => {
    return moves.slice(0, 5).map(move => move.move.name).join(', '); // Limita a 5 movimentos
  };

  return (
    <div className="pokemon-detail">
      <div className='pokemon-header-PokemonDetail'>
        <h1>{pokemon.name}</h1>
      </div>
      <div className="pokemon-container">
        <div className="pokemon-image">
          <img src={pokemon.sprites.front_default} alt={pokemon.name} />
        </div>
        <div className="pokemon-description">
          <h2>Detalhes do Pokémon</h2>
          <div><strong>Tipo(s):</strong> {pokemon.types.map(t => t.type.name).join(', ')}</div>
          <div><strong>ID:</strong> {pokemon.id}</div>
          <div><strong>Peso:</strong> {pokemon.weight / 10} kg</div>
          <div><strong>Altura:</strong> {pokemon.height / 10} m</div>

          <h3>Habilidades</h3>
          <div>{formatAbilities(pokemon.abilities)}</div>

          <h3>Estatísticas</h3>
          <div>{formatStats(pokemon.stats)}</div>

          <h3>Movimentos</h3>
          <div>{formatMoves(pokemon.moves)}</div>

          <div className="pokemon-description-text">
            <h3>Sobre {pokemon.name}</h3>
            <p>{pokemon.name} é um Pokémon de tipo {pokemon.types[0].type.name}, conhecido por sua velocidade e poder de ataque. Com suas habilidades únicas, ele pode se destacar em diferentes tipos de batalhas. Se você estiver em uma luta contra adversários do tipo {pokemon.types[0].type.name}, {pokemon.name} tem uma vantagem significativa, mas precisa tomar cuidado com Pokémons do tipo {pokemon.types.length > 1 ? pokemon.types[1].type.name : 'desconhecido'}. Preparar-se é a chave para uma vitória rápida!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PokemonDetail;
