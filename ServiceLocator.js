const ProjectRepository = require('./repositories/ProjectRepository');
const ProgrammerRepository = require('./repositories/ProgrammerRepository');
const ProjectService = require('./services/ProjectService');
const CalculationService = require('./services/CalculationService');
const DataProcessingService = require('./services/DataProcessingService');

class ServiceLocator {
  constructor() {
    this._repositories = {};
    
    this._services = {};
    
    this._models = null;
  }

  /**
   * Initialize the Service Locator with Sequelize models
   * This should be called once at application startup
   * @param {Object} models - Sequelize models object (from models/index.js)
   */
  initialize(models) {
    if (!models) {
      throw new Error('Models object is required for ServiceLocator initialization');
    }
    this._models = models;
    
    this._repositories = {};
    this._services = {};
  }

  /**
   * Gets or creates the ProjectRepository instance
   * @returns {IProjectRepository} ProjectRepository instance
   */
  getProjectRepository() {
    if (!this._models) {
      throw new Error('ServiceLocator must be initialized with models first');
    }
    
    if (!this._repositories.projectRepository) {
      this._repositories.projectRepository = new ProjectRepository(this._models.Project);
    }
    
    return this._repositories.projectRepository;
  }

  /**
   * Gets or creates the ProgrammerRepository instance
   * @returns {IProgrammerRepository} ProgrammerRepository instance
   */
  getProgrammerRepository() {
    if (!this._models) {
      throw new Error('ServiceLocator must be initialized with models first');
    }
    
    if (!this._repositories.programmerRepository) {
      this._repositories.programmerRepository = new ProgrammerRepository(this._models.Programmer);
    }
    
    return this._repositories.programmerRepository;
  }

  /**
   * Gets or creates the ProjectService instance
   * @returns {IProjectService} ProjectService instance
   */
  getProjectService() {
    if (!this._services.projectService) {
      const projectRepository = this.getProjectRepository();
      const programmerRepository = this.getProgrammerRepository();
      this._services.projectService = new ProjectService(projectRepository, programmerRepository);
    }
    
    return this._services.projectService;
  }

  /**
   * Gets or creates the CalculationService instance
   * @returns {ICalculationService} CalculationService instance
   */
  getCalculationService() {
    if (!this._services.calculationService) {
      const programmerRepository = this.getProgrammerRepository();
      this._services.calculationService = new CalculationService(programmerRepository);
    }
    
    return this._services.calculationService;
  }

  /**
   * Gets or creates the DataProcessingService instance
   * This is the main service that combines all functionality
   * @returns {IDataProcessingService} DataProcessingService instance
   */
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

  /**
   * Clears all cached services and repositories
   * Useful for testing or reinitialization
   */
  clear() {
    this._repositories = {};
    this._services = {};
  }

  /**
   * Gets a service by name (alternative access method)
   * @param {string} serviceName - Name of the service ('project', 'calculation', 'dataProcessing')
   * @returns {Object} Service instance
   */
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

// Export singleton instance
module.exports = new ServiceLocator();

