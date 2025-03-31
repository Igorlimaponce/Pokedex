import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../style.css';

function Items() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [nameFilter, setNameFilter] = useState(""); // Filtro por nome
  const [currentPage, setCurrentPage] = useState(1); // Página atual
  const [itemsPerPage] = useState(20); // Número de itens por página

  // Função para carregar os itens e seus detalhes
  async function loadAPI() {
    try {
      let url = 'https://pokeapi.co/api/v2/item?limit=1000';
      let response = await fetch(url);
      let json = await response.json();

      // Carregar detalhes de cada item
      const itemDetails = await Promise.all(
        json.results.map(async (item) => {
          let res = await fetch(item.url);
          return await res.json();
        })
      );

      setItems(itemDetails);
      setFilteredItems(itemDetails);  // Inicialmente, mostra todos os itens
    } catch (err) {
      console.error("Erro ao carregar os itens", err);
    }
  }

  // Filtra os itens com base no nome
  useEffect(() => {
    let filtered = items;

    if (nameFilter) {
      filtered = filtered.filter((item) =>
        item.name.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }

    setFilteredItems(filtered);
  }, [nameFilter, items]);

  // Função para mudar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Páginas de itens a serem mostrados
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredItems.slice(indexOfFirstItem, indexOfLastItem);

  // Número total de páginas
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredItems.length / itemsPerPage); i++) {
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

      {/* Lista de itens filtrados */}
      <div className="item-list">
        {currentItems.length > 0 ? (
          currentItems.map((item) => (
            <Link to={`/item/${item.id}`} key={item.id} className="item-card">
              {item.sprites?.default ? (
                <img src={item.sprites.default} alt={item.name} />
              ) : (
                <img src="https://via.placeholder.com/96" alt="Imagem não disponível" />
              )}
              <div className="item-name">{item.name}</div>
              <div className="item-description">
                <p>{item.effect_entries?.[0]?.effect || 'Sem descrição.'}</p>
                <p><strong>Preço:</strong> {item.cost ? `${item.cost} Pokédollars` : 'Não disponível'}</p>
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

export default Items;
