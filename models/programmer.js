'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Programmer extends Model {
    static associate(models) {
      Programmer.belongsTo(models.Project, {
        foreignKey: 'projectId',
        as: 'project'
      });
    }
  }
  Programmer.init({
    projectId: DataTypes.INTEGER,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    middleName: DataTypes.STRING,
    position: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE,
    hourlyRate: DataTypes.FLOAT,
    fullTime: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Programmer',
    tableName: 'Programmers',
    freezeTableName: true
  });
  return Programmer;
};
