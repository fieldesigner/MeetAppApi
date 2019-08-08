import Meetup from '../models/Meetup';
import Subscriptions from '../models/Subscriptions';
import Notification from '../schemas/Notification';
import User from '../models/User';

import Mail from '../../lib/Mail';

class SubscriptionController {
  async store(req, res) {
    const { meetup_id } = req.body;
    const meetup = await Meetup.findByPk(meetup_id, {
      include: [
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!meetup) {
      return res.status(401).json({ error: 'Evento inexistente' });
    }

    if (meetup.user_id === req.userId) {
      return res.status(401).json({
        error: 'Você não pode ser inscrever em evento que vc esta organizando',
      });
    }

    if (meetup.past === true) {
      return res.status(401).json({ error: 'Este evento já passou.' });
    }

    const subscript = await Subscriptions.findOne({
      where: { user_id: req.userId, meetup_id: meetup.id },
    });
    if (subscript) {
      return res.status(401).json({ error: 'Você já está inscrito' });
    }

    const meetSameDate = await Subscriptions.findOne({
      where: { user_id: req.userId },
      include: [
        {
          model: Meetup,
          where: {
            date: meetup.date,
          },
        },
      ],
    });

    if (meetSameDate) {
      return res.status(400).json({
        error: 'Você já esta inscrito para um evento no mesmo horário',
      });
    }

    const subscriptOk = await Subscriptions.create({
      user_id: req.userId,
      meetup_id: meetup.id,
    });

    /* notificando ao organizador do evento */
    const userIncrito = await User.findByPk(req.userId);
    await Notification.create({
      content: `${userIncrito.name} se inscreveu para o evento ${meetup.title}`,
      user: meetup.user_id,
    });
    /* enviando email ao organizador do evento */
    await Mail.sendMail({
      to: `${meetup.User.name} <${meetup.User.email}>`,
      subject: `Novo inscrito para o evento ${meetup.title}`,
      template: `notification`,
      context: {
        userName: meetup.User.name,
        meetupTitle: meetup.title,
      },
    });

    return res.json(subscriptOk);
  }
}

export default new SubscriptionController();
