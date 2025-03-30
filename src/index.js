import React from 'react';
import ReactDOM from 'react-dom/client';  // Importa a versão mais recente do ReactDOM
import { BrowserRouter } from 'react-router-dom';  
import './index.css';
import RouteConfig from './components/RouteConfig';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <RouteConfig />
  </BrowserRouter>
);
