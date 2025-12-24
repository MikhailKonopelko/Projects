import ProjectRepository from './repositories/ProjectRepository.js';
import ProgrammerRepository from './repositories/ProgrammerRepository.js';
import ProjectService from './services/ProjectService.js';
import CalculationService from './services/CalculationService.js';
import DataProcessingService from './services/DataProcessingService.js';

class ServiceLocator {
  constructor() {
    this._repositories = {};
    
    this._services = {};
    
    this._models = null;
  }

  initialize(models) {
    if (!models) {
      throw new Error('Models object is required for ServiceLocator initialization');
    }
    this._models = models;
    
    this._repositories = {};
    this._services = {};
  }

  getProjectRepository() {
    if (!this._models) {
      throw new Error('ServiceLocator must be initialized with models first');
    }
    
    if (!this._repositories.projectRepository) {
      this._repositories.projectRepository = new ProjectRepository(this._models.Project);
    }
    
    return this._repositories.projectRepository;
  }

  getProgrammerRepository() {
    if (!this._models) {
      throw new Error('ServiceLocator must be initialized with models first');
    }
    
    if (!this._repositories.programmerRepository) {
      this._repositories.programmerRepository = new ProgrammerRepository(this._models.Programmer);
    }
    
    return this._repositories.programmerRepository;
  }

  getProjectService() {
    if (!this._services.projectService) {
      const projectRepository = this.getProjectRepository();
      const programmerRepository = this.getProgrammerRepository();
      this._services.projectService = new ProjectService(projectRepository, programmerRepository);
    }
    
    return this._services.projectService;
  }

  getCalculationService() {
    if (!this._services.calculationService) {
      const programmerRepository = this.getProgrammerRepository();
      this._services.calculationService = new CalculationService(programmerRepository);
    }
    
    return this._services.calculationService;
  }

  getDataProcessingService() {
    if (!this._services.dataProcessingService) {
      const projectRepository = this.getProjectRepository();
      const programmerRepository = this.getProgrammerRepository();
      this._services.dataProcessingService = new DataProcessingService(
        projectRepository,
        programmerRepository
      );
    }
    
    return this._services.dataProcessingService;
  }

  clear() {
    this._repositories = {};
    this._services = {};
  }

  get(serviceName) {
    const serviceMap = {
      'project': () => this.getProjectService(),
      'calculation': () => this.getCalculationService(),
      'dataProcessing': () => this.getDataProcessingService(),
      'projectRepository': () => this.getProjectRepository(),
      'programmerRepository': () => this.getProgrammerRepository()
    };

    const serviceFactory = serviceMap[serviceName];
    if (!serviceFactory) {
      throw new Error(`Service '${serviceName}' not found. Available: ${Object.keys(serviceMap).join(', ')}`);
    }

    return serviceFactory();
  }
}

export default new ServiceLocator();







