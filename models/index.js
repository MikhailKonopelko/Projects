import { fileURLToPath } from 'url';
import path from 'path';
import Sequelize from 'sequelize';
import configJson from '../config/config.json' with { type: 'json' };

import initProject from './project.js';
import initProgrammer from './programmer.js';
import initUser from './user.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const env = process.env.NODE_ENV || 'development';
const config = configJson[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

db.Project = initProject(sequelize, Sequelize.DataTypes);
db.Programmer = initProgrammer(sequelize, Sequelize.DataTypes);
db.User = initUser(sequelize, Sequelize.DataTypes);

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
