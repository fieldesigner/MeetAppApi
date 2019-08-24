/*
importando do express o Router para separar a parte de
roteamento em outro arquivo sem precisar importar todo o express
*/
// antes era: const { Router } = require('express');
import { Router } from 'express';

// refer upload de arquivos
import multer from 'multer';
import multerConfig from './config/multer';

// importando models temporario para teste
// import User from './app/models/User';

/* middleware para pegar o token do usuario e
proteger rotas internas que precisam estar logado para acessar */
import authMiddleware from './app/middlewares/auth';

// usado na rota do controller do usuário
import UserController from './app/controllers/UserController';

// usado no login do usuário
import SessionController from './app/controllers/SessionController';

// usado no upload de arquivos
import FileController from './app/controllers/FileController';

// usado para o agendamento de evento
import MeetupController from './app/controllers/MeetupController';

// usado para o agendamento de evento
import SubscriptionController from './app/controllers/SubscriptionController';

// lista de eventos que o user esta inscrito
import RegisteredController from './app/controllers/RegisteredController';

// declarando variavel
const routes = new Router();

const upload = multer(multerConfig); // refer ao upload de arquivos

routes.post('/users', UserController.store); // cadastro de usuário

routes.post('/sessions', SessionController.store); // rota para login

/* utilizando o authMiddleware global (como abaixo) todas as rotas abaixo desta
precisaram de login de acesso */
routes.use(authMiddleware);

routes.put('/users', UserController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.post('/meetups', MeetupController.store);
routes.put('/meetups/:id', MeetupController.update);
routes.get('/meetups', MeetupController.index);
routes.get('/allmeetups', MeetupController.indexForAll);
routes.get('/meetup/:id', MeetupController.indexById);
routes.delete('/meetups/:id', MeetupController.delete);

routes.post('/subscription', SubscriptionController.store);
routes.delete('/subscription/:id', SubscriptionController.delete);

routes.get('/registered', RegisteredController.index);

/* TESTE DE ROTAS PARA CADASTRO DE USER ANTES DE ADICIONAR USERCONTROLLER.STORE
routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Rafae',
    email: 'fiel@fiel.com',
    password_hash: '123456'
  })
  return res.json(user);
})
*/

// exportando as rotas
// antes era: module.exports = routes;
export default routes;
