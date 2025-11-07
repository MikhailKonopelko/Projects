/**
 * Project Repository implementation
 * Implements IProjectRepository interface
 */
class ProjectRepository {
  /**
   * @param {Model} ProjectModel - Sequelize Project model
   */
  constructor(ProjectModel) {
    if (!ProjectModel) {
      throw new Error('ProjectModel is required');
    }
    this.Project = ProjectModel;
  }

  /**
   * Finds all projects
   * @returns {Promise<IProject[]>} Promise resolving to an array of projects
   */
  async findAll() {
    return await this.Project.findAll();
  }

  /**
   * Finds a project by ID
   * @param {number} id - The project ID
   * @returns {Promise<IProject|null>} Promise resolving to a project or null
   */
  async findById(id) {
    return await this.Project.findByPk(id);
  }
}

module.exports = ProjectRepository;

