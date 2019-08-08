import { Model } from 'sequelize';

class Subscriptions extends Model {
  // metodo init chamado automaticamente pelo sequelize
  static init(sequelize) {
    super.init(
      {},
      {
        sequelize,
      }
    );

    return this;
  }

  // caso precise relacionar duas vezes com a mesma tabela o as: é obrigatório
  static associate(models) {
    this.belongsTo(models.Meetup, { foreignKey: 'meetup_id' });
    this.belongsTo(models.User, { foreignKey: 'user_id' });
  }
}

export default Subscriptions;
