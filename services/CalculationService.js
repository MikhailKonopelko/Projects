/**
 * Service implementation for calculation-related operations
 * Implements ICalculationService interface
 * Uses dependency injection for data access layer
 */
class CalculationService {
  /**
   * @param {IProgrammerRepository} programmerRepository - Programmer repository for data access
   */
  constructor(programmerRepository) {
    if (!programmerRepository) {
      throw new Error('programmerRepository is required');
    }
    this.programmerRepository = programmerRepository;
  }

  /**
   * Calculates the total cost of a project based on programmer hourly rates and work hours
   * @param {number} projectId - The ID of the project
   * @returns {Promise<number>} Promise resolving to the total project cost
   */
  async calculateProjectCost(projectId) {
    const programmers = await this.programmerRepository.findByProjectId(projectId);

    let totalCost = 0;
    for (const dev of programmers) {
      const hours = dev.fullTime ? 160 : 80;
      totalCost += dev.hourlyRate * hours;
    }

    return totalCost;
  }

  /**
   * Calculates the salary for a programmer based on work period and hourly rate
   * @param {IProgrammer} programmer - The programmer object
   * @returns {number} The calculated salary (with taxes)
   */
  calculateSalary(programmer) {
    const start = new Date(programmer.startDate);
    const end = new Date(programmer.endDate);
    let workDays = 0;

    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) workDays++;
    }

    const hoursPerDay = programmer.fullTime ? 8 : 4;
    const base = workDays * hoursPerDay * programmer.hourlyRate;
    return Math.round(base * 1.77); // с налогами
  }

  /**
   * Calculates the total project value based on all programmer salaries
   * @param {number} projectId - The ID of the project
   * @returns {Promise<number>} Promise resolving to the total project value
   */
  async calculateProjectValue(projectId) {
    const programmers = await this.programmerRepository.findByProjectId(projectId);
    let total = 0;
    for (const dev of programmers) {
      total += this.calculateSalary(dev);
    }
    return total * 2;
  }
}

module.exports = CalculationService;

