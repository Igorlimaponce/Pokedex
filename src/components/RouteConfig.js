// RouteConfig.js
import React from 'react';
import { Route, Routes } from 'react-router-dom';  
import Layout from './Layout'; // Importa o Layout
import PokemonDetail from './PokemonDetail'; 
import App from './App';
import ItemList from './ItemList';  // Importa a nova página de itens
import ItemDetail from './ItemDetail';  // Página de detalhes do item (se você quiser implementar)

function RouteConfig() {
  return (
    <Routes>
      {/* Layout vai envolver todas as páginas */}
      <Route path="/" element={<Layout />}>
        <Route index element={<App />} />  {/* Página principal de Pokémons */}
        <Route path="/pokemon/:id" element={<PokemonDetail />} /> {/* Página de detalhes do Pokémon */}
        <Route path="/items" element={<ItemList />} />  {/* Nova página de itens */}
        <Route path="/item/:id" element={<ItemDetail />} />  {/* Página de detalhes do item (opcional) */}
      </Route>
    </Routes>
  );
}

export default RouteConfig;
