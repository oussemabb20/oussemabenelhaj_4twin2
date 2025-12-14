import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

// Common test imports
export const commonTestImports = [HttpClientTestingModule, RouterTestingModule];

// Mock data factories
export const createMockStudent = (overrides = {}) => ({
  idStudent: 1,
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@test.com',
  phone: '123456789',
  dateOfBirth: '2000-01-01',
  address: '123 Main St',
  ...overrides
});

export const createMockCourse = (overrides = {}) => ({
  idCourse: 1,
  name: 'Introduction to Programming',
  code: 'CS101',
  credit: 3,
  description: 'Basic programming concepts',
  ...overrides
});

export const createMockDepartment = (overrides = {}) => ({
  idDepartment: 1,
  name: 'Computer Science',
  location: 'Building A',
  phone: '123456789',
  head: 'Dr. Smith',
  ...overrides
});

export const createMockEnrollment = (overrides = {}) => ({
  idEnrollment: 1,
  enrollmentDate: '2024-01-15',
  grade: 85,
  status: 'ACTIVE' as const,
  student: createMockStudent(),
  course: createMockCourse(),
  ...overrides
});

// Route provider factories
export const provideActivatedRoute = (params: Record<string, string> = {}) => ({
  provide: ActivatedRoute,
  useValue: { snapshot: { params } }
});

// Service spy factories
export const createServiceSpy = <T>(methods: string[]): jasmine.SpyObj<T> => {
  return jasmine.createSpyObj(methods);
};

export const setupServiceSpyReturns = <T>(spy: jasmine.SpyObj<T>, methodReturns: Record<string, any>) => {
  Object.entries(methodReturns).forEach(([method, value]) => {
    (spy as any)[method].and.returnValue(of(value));
  });
};
