import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import '../style.css';

function ItemDetail() {
  const [item, setItem] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    async function loadItemDetails() {
      try {
        const response = await fetch(`https://pokeapi.co/api/v2/item/${id}`);
        const data = await response.json();
        setItem(data);
      } catch (error) {
        console.error("Erro ao carregar os detalhes do item", error);
      }
    }

    loadItemDetails();
  }, [id]);

  if (!item) return <p>Carregando...</p>;

  return (
    <div className="item-detail">
      <div className='item-header'>
        <h1>{item.name}</h1>
      </div>

      <div className="item-container">
        <div className="item-image">
          {/* Exibir imagem do item, se disponível */}
          {item.sprites && item.sprites.default ? (
            <img src={item.sprites.default} alt={item.name} />
          ) : (
            <p>Imagem não disponível</p>
          )}
        </div>

        <div className="item-description">
          <h2>Detalhes do Item</h2>
          <div><strong>ID:</strong> {item.id}</div>
          <div><strong>Categoria:</strong> {item.category.name}</div>
          <div><strong>Efeito:</strong> {item.effect_entries[0].effect}</div>

          {/* Exibindo mais detalhes se houver */}
          <h3>Usos</h3>
          <div>{item.flavor_text_entries ? item.flavor_text_entries[0].flavor_text : 'Não disponível'}</div>

          <h3>Objetos Relacionados</h3>
          <div>
            {/* Aqui você pode adicionar links ou informações de outros itens relacionados */}
            {/* Exemplo: */}
            {item.related_entries ? (
              item.related_entries.map((relatedItem, index) => (
                <Link key={index} to={`/item/${relatedItem.item.id}`}>{relatedItem.item.name}</Link>
              ))
            ) : (
              <p>Sem itens relacionados</p>
            )}
          </div>
        </div>
      </div>

      <div className='item-links'>
        <Link to="/items">Voltar para a lista de itens</Link>
      </div>
    </div>
  );
}

export default ItemDetail;
