const ProjectService = require('./ProjectService');
const CalculationService = require('./CalculationService');

/**
 * Main service implementation combining all data processing services
 * Implements IDataProcessingService interface
 * Uses dependency injection for all dependencies
 */
class DataProcessingService extends ProjectService {
  /**
   * @param {IProjectRepository} projectRepository - Project repository for data access
   * @param {IProgrammerRepository} programmerRepository - Programmer repository for data access
   */
  constructor(projectRepository, programmerRepository) {
    super(projectRepository, programmerRepository);
    this.calculationService = new CalculationService(programmerRepository);
  }

  /**
   * Calculates the total cost of a project based on programmer hourly rates and work hours
   * @param {number} projectId - The ID of the project
   * @returns {Promise<number>} Promise resolving to the total project cost
   */
  async calculateProjectCost(projectId) {
    return this.calculationService.calculateProjectCost(projectId);
  }

  /**
   * Calculates the salary for a programmer based on work period and hourly rate
   * @param {IProgrammer} programmer - The programmer object
   * @returns {number} The calculated salary (with taxes)
   */
  calculateSalary(programmer) {
    return this.calculationService.calculateSalary(programmer);
  }

  /**
   * Calculates the total project value based on all programmer salaries
   * @param {number} projectId - The ID of the project
   * @returns {Promise<number>} Promise resolving to the total project value
   */
  async calculateProjectValue(projectId) {
    return this.calculationService.calculateProjectValue(projectId);
  }
}

module.exports = DataProcessingService;

