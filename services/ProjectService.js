import { withTransaction } from '../utils/withTransaction.js';
import IdentityMap from '../utils/IdentityMap.js';

export default class ProjectService {
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

  async getAllProjects() {
    const sequelize = this.projectRepository.Project.sequelize;
    return await withTransaction(sequelize, async ({ transaction }) => {
      const identityMap = new IdentityMap();
      return await this.projectRepository.findAll({ transaction, identityMap });
    });
  }

  async getProgrammersByProject(projectId) {
    const sequelize = this.programmerRepository.Programmer.sequelize;
    return await withTransaction(sequelize, async ({ transaction }) => {
      const identityMap = new IdentityMap();
      return await this.programmerRepository.findByProjectId(projectId, { transaction, identityMap });
    });
  }

  async getProjectWithLazyProgrammers(projectId) {
    const sequelize = this.projectRepository.Project.sequelize;
    return await withTransaction(sequelize, async ({ transaction }) => {
      const identityMap = new IdentityMap();
      return await this.projectRepository.findByIdWithLazyProgrammers(projectId, { transaction, identityMap });
    });
  }
}

