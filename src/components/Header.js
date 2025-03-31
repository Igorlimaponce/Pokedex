import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import pokeball from '../assets/pokeball.gif'; 
import profileIcon from '../assets/profile-header.png'; // Ícone de perfil genérico
import '../style.css';
import '../profile-header.css';

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [favoritePokemon, setFavoritePokemon] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Simulação de autenticação e recuperação do Pokémon favorito
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user')); // Pega os dados do usuário no localStorage
    if (user && user.username) {
      setIsLoggedIn(true);
      setFavoritePokemon(user.favoritePokemon); // Salva os dados do Pokémon favorito
    }
  }, []);

  // Alternar a visibilidade do menu de perfil
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Função para logout
  const handleLogout = () => {
    localStorage.removeItem('user'); // Remove o usuário do localStorage
    setIsLoggedIn(false);
    setFavoritePokemon(null);
    setIsMenuOpen(false);
  };

  return (
    <header>
      {/* Logo */}
      <Link to="/" className="header-link">
        <img className="pokebola-header" src={pokeball} alt="Pokebola" />
        <strong>Pokedex</strong>
      </Link>

      {/* Link para Itens */}
      <Link to="/items" className="header-link-others">
        <strong>Itens</strong>
      </Link>

      {/* Seção do Perfil */}
      <div className="profile-container">
        <div className="profile-button" onClick={toggleMenu}>
          {isLoggedIn && favoritePokemon && (
            <>
              <img src={favoritePokemon.image} alt={favoritePokemon.name} className="pokemon-icon" />
            </>
          )}
          <img src={profileIcon} alt="Perfil" className="profile-icon" />
        </div>

        {/* Menu suspenso */}
        {isMenuOpen && (
          <div className="dropdown-menu">
            {isLoggedIn ? (
              <>
                <p>Olá, {localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).username : ''}!</p>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <Link to="/login">
                <button>Login</button>
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
