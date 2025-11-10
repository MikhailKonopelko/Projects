/**
 * Programmer Repository implementation
 * Implements IProgrammerRepository interface
 */
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

  /**
   * Finds all programmers
   * @returns {Promise<IProgrammer[]>} Promise resolving to an array of programmers
   */
  async findAll(options = {}) {
    const { transaction } = options;
    return await this.Programmer.findAll({ transaction });
  }

  /**
   * Finds programmers by project ID
   * @param {number} projectId - The project ID
   * @returns {Promise<IProgrammer[]>} Promise resolving to an array of programmers
   */
  async findByProjectId(projectId, options = {}) {
    const { transaction, identityMap } = options;

    // Cache the collection by a composite key
    const cacheKey = `project:${projectId}:programmers`;
    if (identityMap && identityMap.has('Collection', cacheKey)) {
      return identityMap.get('Collection', cacheKey);
    }

    const list = await this.Programmer.findAll({ where: { projectId }, transaction });
    if (identityMap) {
      identityMap.set('Collection', cacheKey, list);
      // Also cache individual programmers
      for (const dev of list) {
        identityMap.set('Programmer', dev.id, dev);
      }
    }
    return list;
  }

  /**
   * Finds a programmer by ID
   * @param {number} id - The programmer ID
   * @returns {Promise<IProgrammer|null>} Promise resolving to a programmer or null
   */
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

