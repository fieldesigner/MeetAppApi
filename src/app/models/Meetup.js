import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

class Meetup extends Model {
  // metodo init chamado automaticamente pelo sequelize
  static init(sequelize) {
    super.init(
      {
        // infos inseridas pelo usuario
        title: Sequelize.STRING,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        date: Sequelize.DATE,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  // caso precise relacionar duas vezes com a mesma tabela o as: é obrigatório
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.Files, { foreignKey: 'id_image' });
    this.hasMany(models.Subscriptions, { foreignKey: 'meetup_id' });
  }
}

export default Meetup;
