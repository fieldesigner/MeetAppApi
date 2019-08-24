import { Op } from 'sequelize';
import Meetup from '../models/Meetup';
import Subscriptions from '../models/Subscriptions';
import User from '../models/User';
import Files from '../models/Files';

class RegisteredController {
  // listagem dos eventos que esta instrito do usuario logado.
  async index(req, res) {
    // para paginação e informando valor padrão 1 caso nao tenha passo a pagina
    const { page = 1 } = req.query;
    // const now = new Date();
    const registered = await Subscriptions.findAll({
      where: { user_id: req.userId },
      limit: 10,
      offset: (page - 1) * 10,
      include: [
        {
          model: Meetup,
          where: {
            date: {
              [Op.gt]: new Date(), // > data atual
            },
          },
          include: [User, Files],
          required: true,
        },
      ],
      order: [[Meetup, 'date']],
    });
    return res.json(registered);
  }
}

export default new RegisteredController();
