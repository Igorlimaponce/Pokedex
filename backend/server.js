const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Client } = require('pg');  // Para conectar ao PostgreSQL
const authRoutes = require('./routes/authRoutes');

const app = express();

// Middleware
app.use(express.json());  // Para processar o corpo da requisição como JSON

const corsOptions = {
    origin: '*',  // Permite todas as origens (não recomendado para produção, mas ajuda no teste)
    methods: 'GET,POST,PUT,DELETE',  // Permite esses métodos
    allowedHeaders: 'Content-Type,Authorization',  // Permite esses cabeçalhos
  };
  
  app.use(cors(corsOptions));

  
// Conexão com o PostgreSQL
const client = new Client({
  user: process.env.DB_USER,  // Usando variáveis de ambiente
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,  // Se não especificado, usa a porta padrão 5432
});

client.connect()
  .then(() => {
    console.log("Conexão com o banco de dados PostgreSQL estabelecida.");
  })
  .catch((err) => {
    console.error("Erro ao conectar ao banco de dados:", err);
    process.exit(1);  // Termina a aplicação se não conseguir conectar
  });

// Rotas de autenticação
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
