import { Model } from 'sequelize';

export default (sequelize, DataTypes) => {
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
    freezeTableName: true,
    validate: {
      validDates() {
        if (this.startDate >= this.endDate) {
          throw new Error('Дата окончания должна быть позже даты начала');
        }
      }
    }
  });

  Programmer.addHook('beforeCreate', async (dev, options) => {
    const project = await sequelize.models.Project.findByPk(dev.projectId);
    if (!project) throw new Error('Проект не найден');

    if (dev.startDate < project.startDate) {
      throw new Error('Дата начала работы программиста не может быть раньше начала проекта');
    }

    if (dev.endDate > project.endDate) {
      throw new Error('Дата окончания работы программиста не может быть позже окончания проекта');
    }
  });

  return Programmer;
};
