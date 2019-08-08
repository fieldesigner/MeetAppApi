module.exports = {
  // método up quando a migration for executada
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('subscriptions', { 
        // definindo os campos da tabela no BD
        id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        meetup_id: {
          type: Sequelize.INTEGER,
          references: { model: 'meetups', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          allowNull: false,
        },
        user_id:{
          type: Sequelize.INTEGER,
          references: { model: 'users', key: 'id' },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
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
  down: queryInterface => {
      return queryInterface.dropTable('subscriptions');
  }
};