import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { EnrollmentService } from './enrollment.service';
import { Enrollment } from '../models';
import { environment } from '../../environments/environment';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/Enrollment`;

  const mockEnrollment: Enrollment = {
    idEnrollment: 1,
    enrollmentDate: '2024-01-15',
    grade: 85,
    status: 'ACTIVE',
    student: { idStudent: 1, firstName: 'John', lastName: 'Doe', email: 'john@example.com', phone: '123', dateOfBirth: '2000-01-01', address: '123 St' },
    course: { idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: 'Intro' }
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EnrollmentService]
    });
    service = TestBed.inject(EnrollmentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all enrollments', () => {
    const mockEnrollments: Enrollment[] = [mockEnrollment];
    service.getAll().subscribe(enrollments => {
      expect(enrollments.length).toBe(1);
      expect(enrollments).toEqual(mockEnrollments);
    });
    const req = httpMock.expectOne(`${apiUrl}/getAllEnrollment`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEnrollments);
  });

  it('should get enrollment by id', () => {
    service.getById(1).subscribe(enrollment => {
      expect(enrollment).toEqual(mockEnrollment);
    });
    const req = httpMock.expectOne(`${apiUrl}/getEnrollment/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockEnrollment);
  });

  it('should create enrollment', () => {
    service.create(mockEnrollment).subscribe(enrollment => {
      expect(enrollment).toEqual(mockEnrollment);
    });
    const req = httpMock.expectOne(`${apiUrl}/createEnrollment`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockEnrollment);
    req.flush(mockEnrollment);
  });

  it('should update enrollment', () => {
    service.update(mockEnrollment).subscribe(enrollment => {
      expect(enrollment).toEqual(mockEnrollment);
    });
    const req = httpMock.expectOne(`${apiUrl}/updateEnrollment`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockEnrollment);
    req.flush(mockEnrollment);
  });

  it('should delete enrollment', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/deleteEnrollment/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
