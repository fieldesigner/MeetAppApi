import Sequelize, { Model } from 'sequelize';

class Files extends Model {
  // metodo init chamado automaticamente pelo sequelize
  static init(sequelize){
    super.init({
      // colunas no banco
      name: Sequelize.STRING,
      path: Sequelize.STRING,
      url: {
        type: Sequelize.VIRTUAL,
        get() {
          return `${process.env.APP_URL}/files/${this.path}`;
        },
      },
    },
    {
      sequelize,
    }
    );

    return this;
  }


}

export default Files;