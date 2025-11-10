/**
 * Service implementation for project-related data operations
 * Implements IProjectService interface
 * Uses dependency injection for data access layer
 */
class ProjectService {
  /**
   * @param {IProjectRepository} projectRepository - Project repository for data access
   * @param {IProgrammerRepository} programmerRepository - Programmer repository for data access
   */
  constructor(projectRepository, programmerRepository) {
    if (!projectRepository) {
      throw new Error('projectRepository is required');
    }
    if (!programmerRepository) {
      throw new Error('programmerRepository is required');
    }
    this.projectRepository = projectRepository;
    this.programmerRepository = programmerRepository;

    // Lazy imports to avoid circular deps
    this._withTransaction = null;
    this._IdentityMap = null;
  }

  /**
   * Retrieves all projects from the database
   * @returns {Promise<IProject[]>} Promise resolving to an array of projects
   */
  async getAllProjects() {
    const sequelize = this.projectRepository.Project.sequelize;
    const { withTransaction } = this._getTxHelper();
    const IdentityMap = this._getIdentityMap();

    return await withTransaction(sequelize, async ({ transaction }) => {
      const identityMap = new IdentityMap();
      return await this.projectRepository.findAll({ transaction, identityMap });
    });
  }

  /**
   * Retrieves all programmers assigned to a specific project
   * @param {number} projectId - The ID of the project
   * @returns {Promise<IProgrammer[]>} Promise resolving to an array of programmers
   */
  async getProgrammersByProject(projectId) {
    const sequelize = this.programmerRepository.Programmer.sequelize;
    const { withTransaction } = this._getTxHelper();
    const IdentityMap = this._getIdentityMap();

    return await withTransaction(sequelize, async ({ transaction }) => {
      const identityMap = new IdentityMap();
      return await this.programmerRepository.findByProjectId(projectId, { transaction, identityMap });
    });
  }

  /**
   * Returns a project with a lazy-loading programmers property
   * Demonstrates Lazy Load pattern for associated entities
   */
  async getProjectWithLazyProgrammers(projectId) {
    const sequelize = this.projectRepository.Project.sequelize;
    const { withTransaction } = this._getTxHelper();
    const IdentityMap = this._getIdentityMap();

    return await withTransaction(sequelize, async ({ transaction }) => {
      const identityMap = new IdentityMap();
      return await this.projectRepository.findByIdWithLazyProgrammers(projectId, { transaction, identityMap });
    });
  }

  _getTxHelper() {
    if (!this._withTransaction) {
      this._withTransaction = require('../utils/withTransaction').withTransaction;
    }
    return { withTransaction: this._withTransaction };
  }

  _getIdentityMap() {
    if (!this._IdentityMap) {
      this._IdentityMap = require('../utils/IdentityMap');
    }
    return this._IdentityMap;
  }
}

module.exports = ProjectService;

