import { withTransaction } from '../utils/withTransaction.js';
import IdentityMap from '../utils/IdentityMap.js';

export default class CalculationService {
  constructor(programmerRepository) {
    if (!programmerRepository) {
      throw new Error('programmerRepository is required');
    }
    this.programmerRepository = programmerRepository;
  }

  async calculateProjectCost(projectId) {
    const sequelize = this.programmerRepository.Programmer.sequelize;
    const programmers = await withTransaction(sequelize, async ({ transaction }) => {
      const identityMap = new IdentityMap();
      return await this.programmerRepository.findByProjectId(projectId, { transaction, identityMap });
    });

    let totalCost = 0;
    for (const dev of programmers) {
      const hours = dev.fullTime ? 160 : 80;
      totalCost += dev.hourlyRate * hours;
    }

    return totalCost;
  }

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
    return Math.round(base * 1.77);
  }

  async calculateProjectValue(projectId) {
    const sequelize = this.programmerRepository.Programmer.sequelize;
    const programmers = await withTransaction(sequelize, async ({ transaction }) => {
      const identityMap = new IdentityMap();
      return await this.programmerRepository.findByProjectId(projectId, { transaction, identityMap });
    });
    let total = 0;
    for (const dev of programmers) {
      total += this.calculateSalary(dev);
    }
    return total * 2;
  }
}
