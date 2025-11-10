/**
 * Service interfaces for data processing logic
 */

import { IProject, IProgrammer } from '../types/models';

/**
 * Service for project-related data operations
 */
export interface IProjectService {
  /**
   * Retrieves all projects from the database
   * @returns Promise resolving to an array of projects
   */
  getAllProjects(): Promise<IProject[]>;

  /**
   * Retrieves all programmers assigned to a specific project
   * @param projectId - The ID of the project
   * @returns Promise resolving to an array of programmers
   */
  getProgrammersByProject(projectId: number): Promise<IProgrammer[]>;
}

/**
 * Service for calculation-related operations
 */
export interface ICalculationService {
  /**
   * Calculates the total cost of a project based on programmer hourly rates and work hours
   * @param projectId - The ID of the project
   * @returns Promise resolving to the total project cost
   */
  calculateProjectCost(projectId: number): Promise<number>;

  /**
   * Calculates the salary for a programmer based on work period and hourly rate
   * @param programmer - The programmer object
   * @returns The calculated salary (with taxes)
   */
  calculateSalary(programmer: IProgrammer): number;

  /**
   * Calculates the total project value based on all programmer salaries
   * @param projectId - The ID of the project
   * @returns Promise resolving to the total project value
   */
  calculateProjectValue(projectId: number): Promise<number>;
}

/**
 * Main service interface combining all data processing services
 */
export interface IDataProcessingService extends IProjectService, ICalculationService {}


