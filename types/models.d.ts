
export interface IProject {
  id: number;
  name: string;
  client: string;
  startDate: Date;
  endDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProgrammer {
  id: number;
  projectId: number;
  firstName: string;
  lastName: string;
  middleName?: string | null;
  position: string;
  startDate: Date;
  endDate: Date;
  hourlyRate: number;
  fullTime: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}





