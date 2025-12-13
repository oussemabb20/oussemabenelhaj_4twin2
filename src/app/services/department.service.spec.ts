import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DepartmentService } from './department.service';
import { Department } from '../models';
import { environment } from '../../environments/environment';

describe('DepartmentService', () => {
  let service: DepartmentService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/Depatment`;

  const mockDepartment: Department = {
    idDepartment: 1,
    name: 'Computer Science',
    location: 'Building A',
    phone: '123456789',
    head: 'Dr. Smith'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DepartmentService]
    });
    service = TestBed.inject(DepartmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all departments', () => {
    const mockDepartments: Department[] = [mockDepartment];
    service.getAll().subscribe(departments => {
      expect(departments.length).toBe(1);
      expect(departments).toEqual(mockDepartments);
    });
    const req = httpMock.expectOne(`${apiUrl}/getAllDepartment`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartments);
  });

  it('should get department by id', () => {
    service.getById(1).subscribe(department => {
      expect(department).toEqual(mockDepartment);
    });
    const req = httpMock.expectOne(`${apiUrl}/getDepartment/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockDepartment);
  });

  it('should create department', () => {
    service.create(mockDepartment).subscribe(department => {
      expect(department).toEqual(mockDepartment);
    });
    const req = httpMock.expectOne(`${apiUrl}/createDepartment`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockDepartment);
    req.flush(mockDepartment);
  });

  it('should update department', () => {
    service.update(mockDepartment).subscribe(department => {
      expect(department).toEqual(mockDepartment);
    });
    const req = httpMock.expectOne(`${apiUrl}/updateDepartment`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockDepartment);
    req.flush(mockDepartment);
  });

  it('should delete department', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/deleteDepartment/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
