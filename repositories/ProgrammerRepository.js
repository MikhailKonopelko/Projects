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
  async findAll() {
    return await this.Programmer.findAll();
  }

  /**
   * Finds programmers by project ID
   * @param {number} projectId - The project ID
   * @returns {Promise<IProgrammer[]>} Promise resolving to an array of programmers
   */
  async findByProjectId(projectId) {
    return await this.Programmer.findAll({ where: { projectId } });
  }

  /**
   * Finds a programmer by ID
   * @param {number} id - The programmer ID
   * @returns {Promise<IProgrammer|null>} Promise resolving to a programmer or null
   */
  async findById(id) {
    return await this.Programmer.findByPk(id);
  }
}

module.exports = ProgrammerRepository;

