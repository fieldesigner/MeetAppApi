import Sequelize from 'sequelize';
import mongoose from 'mongoose';
import User from '../app/models/User';
import Files from '../app/models/Files';
import Meetup from '../app/models/Meetup';
import Subscriptions from '../app/models/Subscriptions';
import databaseConfig from '../config/database';

// array com todos os models da aplicação
const models = [User, Files, Meetup, Subscriptions];

class Database{
  constructor(){
    this.init();
    this.mongo()
  }

  init(){
    this.connection = new Sequelize(databaseConfig);

    // percorrendo os models
    models
    .map(model => model.init(this.connection))
    .map(model => model.associate && model.associate(this.connection.models));
  }

  mongo(){
    this.mongoConnetion = mongoose.connect(
      process.env.MONGO_URL,
      {useNewUrlParser: true, useFindAndModify: true }
    )
  }
  
}

export default new Database();