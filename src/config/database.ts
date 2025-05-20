'use strict';

import { Sequelize } from 'sequelize-typescript';
import seed from '../seeders/create-system-admin';
import { config, dialect } from './config';
const env = 'development';
const configProp = config[env];

class Database {
  public sequelize: Sequelize | undefined;

  constructor() {
    (async () => await this.connectToDatabase())();
  }

  private async connectToDatabase() {
    this.sequelize = new Sequelize({
      database: configProp.database,
      username: configProp.username,
      password: configProp.password,
      host: configProp.host,
      dialect: dialect,
      port: configProp.port,
      models: [__dirname + '/../models'],
    });

    await this.sequelize
      .authenticate()
      .then(() => {
        console.log('Connection has been established successfully.');
      })
      .catch((err) => {
        console.error('Unable to connect to the Database:', err);
      });
    await this.sequelize
      .sync({ force: true })
      .then(() => {
        console.log('Database synced successfully.');
      })
      .catch((err) => {
        console.error('Error syncing database:', err);
      });
    await seed();
  }
}

export default Database;
