module.exports = {
  // método up quando a migration for executada
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('files', {
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
      path: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  // método down para possível rowback
  down: queryInterface => {
    return queryInterface.dropTable('files');
  },
};
