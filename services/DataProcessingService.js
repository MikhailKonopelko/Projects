import ProjectService from './ProjectService.js';
import CalculationService from './CalculationService.js';

export default class DataProcessingService extends ProjectService {
  constructor(projectRepository, programmerRepository) {
    super(projectRepository, programmerRepository);
    this.calculationService = new CalculationService(programmerRepository);
  }

  async calculateProjectCost(projectId) {
    return this.calculationService.calculateProjectCost(projectId);
  }

  calculateSalary(programmer) {
    return this.calculationService.calculateSalary(programmer);
  }
  
  async calculateProjectValue(projectId) {
    return this.calculationService.calculateProjectValue(projectId);
  }
}

