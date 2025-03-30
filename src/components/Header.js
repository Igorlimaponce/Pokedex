import React from 'react';
import { Link } from 'react-router-dom';  // Importando o Link
import pokeball from '../assets/pokeball.gif';  // Corrigido o caminho da imagem
import '../style.css'; // Adapte os estilos conforme necessário

const Header = () => {
  return (
    <header>
      {/* Link que envolve tanto a imagem quanto o texto */}
      <Link to="/" className="header-link">
        <img className="pokebola-header" src={pokeball} alt="Pokebola" />
        <strong>Pokedex</strong>
      </Link>
    </header>
  );
}

export default Header;
