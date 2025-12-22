import { Department } from './department.model';

export interface Student {
  idStudent?: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  department?: Department;
}

// Alias for backward compatibility with camelCase usage
export type { Student as StudentModel };
