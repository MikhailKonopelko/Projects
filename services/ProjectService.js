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
  }

  /**
   * Retrieves all projects from the database
   * @returns {Promise<IProject[]>} Promise resolving to an array of projects
   */
  async getAllProjects() {
    return await this.projectRepository.findAll();
  }

  /**
   * Retrieves all programmers assigned to a specific project
   * @param {number} projectId - The ID of the project
   * @returns {Promise<IProgrammer[]>} Promise resolving to an array of programmers
   */
  async getProgrammersByProject(projectId) {
    return await this.programmerRepository.findByProjectId(projectId);
  }
}

module.exports = ProjectService;

