class ProgrammerRepository {
  /**
   * @param {Model} ProgrammerModel - Sequelize Programmer model
   */
  constructor(ProgrammerModel) {
    if (!ProgrammerModel) {
      throw new Error('ProgrammerModel is required');
    }
    this.Programmer = ProgrammerModel;
  }

  async findAll(options = {}) {
    const { transaction } = options;
    return await this.Programmer.findAll({ transaction });
  }

  async findByProjectId(projectId, options = {}) {
    const { transaction, identityMap } = options;

    const cacheKey = `project:${projectId}:programmers`;
    if (identityMap && identityMap.has('Collection', cacheKey)) {
      return identityMap.get('Collection', cacheKey);
    }

    const list = await this.Programmer.findAll({ where: { projectId }, transaction });
    if (identityMap) {
      identityMap.set('Collection', cacheKey, list);
      for (const dev of list) {
        identityMap.set('Programmer', dev.id, dev);
      }
    }
    return list;
  }

  async findById(id, options = {}) {
    const { transaction, identityMap } = options;

    if (identityMap && identityMap.has('Programmer', id)) {
      return identityMap.get('Programmer', id);
    }
    const programmer = await this.Programmer.findByPk(id, { transaction });
    if (programmer && identityMap) {
      identityMap.set('Programmer', id, programmer);
    }
    return programmer;
  }
}

module.exports = ProgrammerRepository;
