/**
 * Repository/DAO interfaces for data access layer
 */

import { IProject, IProgrammer } from '../types/models';

/**
 * Repository interface for Project data access operations
 */
export interface IProjectRepository {
  /**
   * Finds all projects
   * @returns Promise resolving to an array of projects
   */
  findAll(): Promise<IProject[]>;

  /**
   * Finds a project by ID
   * @param id - The project ID
   * @returns Promise resolving to a project or null
   */
  findById(id: number): Promise<IProject | null>;
}

/**
 * Repository interface for Programmer data access operations
 */
export interface IProgrammerRepository {
  /**
   * Finds all programmers
   * @returns Promise resolving to an array of programmers
   */
  findAll(): Promise<IProgrammer[]>;

  /**
   * Finds programmers by project ID
   * @param projectId - The project ID
   * @returns Promise resolving to an array of programmers
   */
  findByProjectId(projectId: number): Promise<IProgrammer[]>;

  /**
   * Finds a programmer by ID
   * @param id - The programmer ID
   * @returns Promise resolving to a programmer or null
   */
  findById(id: number): Promise<IProgrammer | null>;
}





