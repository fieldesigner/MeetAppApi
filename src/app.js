/* ARQUIVO COM A CONFIGURAÇÃO BASE DA NOSSA APLICAÇÃO */
import 'dotenv/config'; // variaveis de ambiente que esta na raiz no arquivo .env
// importanto o express
// antes era: const express = require('express');
import express from 'express';

import cors from 'cors';
import path from 'path';

// importando rotas do arquivo externo routes.js
// antes era const routes = require('./routes');
import routes from './routes';

// importando database.js
import './database';

// definindo classe do app
class App {
  // método constructor é chamado automaticamente quando a classe é instaciada
  constructor() {
    this.server = express();

    /*
    chamando os 2 metodos (middlewares e routes) criados abaixo para que os
    funcionem assim que que a classe for instaciada.
    */
    this.middlewares();
    this.routes();
  }

  // métodod middlewares: configurando aplicação para ler e enviar requisições em json
  middlewares() {
    this.server.use(cors());
    this.server.use(express.json());
    this.server.use(
      '/files',
      express.static(path.resolve(__dirname, '..', 'tmp', 'uploads'))
    );
  }

  // métodod routes: configurando para buscar as rotas do arquivo routes.js
  routes() {
    this.server.use(routes);
  }
}

// exportando a classe App
// antes era: module.exports = new App().server;
export default new App().server;
