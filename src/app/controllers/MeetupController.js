import * as Yup from 'yup'; // usando para validar as informações do form
import { Op } from 'sequelize';
import {
  isBefore,
  startOfDay,
  startOfHour,
  endOfDay,
  parseISO,
} from 'date-fns';
import Meetup from '../models/Meetup';
import User from '../models/User';
import Files from '../models/Files';

class MeetupController {
  // cadastra evento
  async store(req, res) {
    // validando informações
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      id_image: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const { title, description, location, id_image, date } = req.body;

    // tranformando a var date (string) passado pelo usuario em formato date do javascritp
    const hourStart = startOfHour(parseISO(date));
    // verificando se horario de agendamento já passou
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'data não permitida ' });
    }

    // se chegou aqui pode gravar
    const user_id = req.userId;
    const meetup = await Meetup.create({
      title,
      description,
      location,
      date,
      id_image,
      user_id,
    });

    return res.json(meetup);
  }

  // atualização do evento
  async update(req, res) {
    // validando informações
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
      id_image: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Erro de validação' });
    }

    const meetup = await Meetup.findByPk(req.params.id);

    // verificando se é responsável pelo evento
    if (!meetup || meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'Permissão negada' });
    }

    if (meetup.past === true) {
      return res.status(401).json({
        error: 'O prazo máximo para modificação deste evento já passou.',
      });
    }

    // tranformando a var date (string) passado pelo usuario em formato date do javascritp
    const hourStart = startOfHour(parseISO(req.body.date));
    // verificando se horario de agendamento já passou
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'data não permitida ' });
    }

    // se chegou aqui pode atualizar
    await meetup.update(req.body);

    return res.json(meetup);
  }

  // listagem dos eventos do usuario logado.
  async index(req, res) {
    // para paginação e informando valor padrão 1 caso nao tenha passo a pagina
    const { page = 1 } = req.query;
    const where = { user_id: req.userId };

    if (req.query.date) {
      const dateMeet = parseISO(req.query.date);
      where.date = {
        [Op.between]: [startOfDay(dateMeet), endOfDay(dateMeet)],
      };
    }

    const meetups = await Meetup.findAll({
      where,
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
      include: [User, Files],
    });
    return res.json(meetups);
  }

  async delete(req, res) {
    // validando informações

    const meetup = await Meetup.findByPk(req.params.id);

    // verificando se é responsável pelo evento
    if (!meetup || meetup.user_id !== req.userId) {
      return res.status(401).json({ error: 'Permissão negada' });
    }

    if (meetup.past === true) {
      return res.status(401).json({
        error: 'O prazo máximo para modificação deste evento já passou.',
      });
    }

    // se chegou aqui pode atualizar
    await meetup.destroy();

    return res.json({ sucess: 'evento excluido com sucesso ' });
  }
}

export default new MeetupController();
