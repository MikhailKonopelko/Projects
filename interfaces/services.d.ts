import { IProject, IProgrammer } from '../types/models';

export interface IProjectService {

  getAllProjects(): Promise<IProject[]>;

  getProgrammersByProject(projectId: number): Promise<IProgrammer[]>;
}

export interface ICalculationService {
  
  calculateProjectCost(projectId: number): Promise<number>;

  calculateSalary(programmer: IProgrammer): number;

  calculateProjectValue(projectId: number): Promise<number>;
}

export interface IDataProcessingService extends IProjectService, ICalculationService {}
