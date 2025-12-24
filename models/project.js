import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
  class Project extends Model {
    static associate(models) {
      Project.hasMany(models.Programmer, {
        foreignKey: 'projectId',
        as: 'programmers'
      });
    }
  }
  Project.init({
    name: DataTypes.STRING,
    client: DataTypes.STRING,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Project',
    tableName: 'Projects',
    freezeTableName: true
  });
  return Project;
};
