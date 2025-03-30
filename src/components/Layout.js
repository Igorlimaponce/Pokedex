// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom'; // Outlet será onde o conteúdo das rotas vai aparecer
import Header from './Header'; // Supondo que o header seja um componente separado

const Layout = () => {
  return (
    <div>
      <Header /> {/* Exibe o Header */}
      <div className="main-content">
        <Outlet /> {/* Onde o conteúdo das rotas será renderizado */}
      </div>
    </div>
  );
}

export default Layout;
