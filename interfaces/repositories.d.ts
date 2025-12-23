import { IProject, IProgrammer } from '../types/models';

export interface IProjectRepository {
  
  findAll(): Promise<IProject[]>;

  findById(id: number): Promise<IProject | null>;
}

export interface IProgrammerRepository {

  findAll(): Promise<IProgrammer[]>;

  findByProjectId(projectId: number): Promise<IProgrammer[]>;

  findById(id: number): Promise<IProgrammer | null>;
}
