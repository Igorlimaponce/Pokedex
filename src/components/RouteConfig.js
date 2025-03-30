// RouteConfig.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';  
import Layout from './Layout'; // Importa o Layout
import PokemonDetail from './PokemonDetail'; 
import App from './App';

function RouteConfig() {
  return (
    <Routes>
      {/* Layout vai envolver todas as páginas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />  {/* Página principal */}
        <Route path="/pokemon/:id" element={<PokemonDetail />} /> {/* Página de detalhes */}
      </Route>
    </Routes>
  );
}

export default RouteConfig;
