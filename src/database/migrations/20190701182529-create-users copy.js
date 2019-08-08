
module.exports = {
  // método up quando a migration for executada
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', { 
        // definindo os campos da tabela no BD
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true,
        },
        password_hash: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
        }
      });
  },

  // método down para possível rowback
  down: (queryInterface) => {

      return queryInterface.dropTable('users');

  }
};
