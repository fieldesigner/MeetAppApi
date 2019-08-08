import Sequelize, { Model } from 'sequelize';

import bcrypt from 'bcryptjs';

class User extends Model {
  // metodo init chamado automaticamente pelo sequelize
  static init(sequelize){
    super.init({
      // colunas inseridas pelo usuario
      name: Sequelize.STRING,
      email: Sequelize.STRING,
      password: Sequelize.VIRTUAL, // VIRTUAL = INEXISTENTE NO BANCO
      password_hash: Sequelize.STRING,
    },
    {
      sequelize,
    }
    );

    /* ADICIONANDO HOOK (beforesave) QUE SERÁ EXECUTANDO ANTES DE EDITAR OU CRIAR O USUÁRIO */
    this.addHook('beforeSave', async user => {
      // verificando se passou password para criar o hash
      if(user.password){
        user.password_hash = await bcrypt.hash(user.password, 8);
      }
    });

    return this;
  }

  static associate(models) {
    this.hasMany(models.Meetup);
  }

  /*  MÉTODO PARA COMPARAR A SENHA */
  checkPassword(password){
    return bcrypt.compare(password, this.password_hash);
  }

}

export default User;