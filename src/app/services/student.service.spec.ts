import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { StudentService } from './student.service';
import { Student } from '../models';
import { environment } from '../../environments/environment';

describe('StudentService', () => {
  let service: StudentService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/students`;

  const mockStudent: Student = {
    idStudent: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '123456789',
    dateOfBirth: '2000-01-01',
    address: '123 Main St'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [StudentService]
    });
    service = TestBed.inject(StudentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all students', () => {
    const mockStudents: Student[] = [mockStudent];
    service.getAll().subscribe(students => {
      expect(students.length).toBe(1);
      expect(students).toEqual(mockStudents);
    });
    const req = httpMock.expectOne(`${apiUrl}/getAllStudents`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStudents);
  });

  it('should get student by id', () => {
    service.getById(1).subscribe(student => {
      expect(student).toEqual(mockStudent);
    });
    const req = httpMock.expectOne(`${apiUrl}/getStudent/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockStudent);
  });

  it('should create student', () => {
    service.create(mockStudent).subscribe(student => {
      expect(student).toEqual(mockStudent);
    });
    const req = httpMock.expectOne(`${apiUrl}/createStudent`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockStudent);
    req.flush(mockStudent);
  });

  it('should update student', () => {
    service.update(mockStudent).subscribe(student => {
      expect(student).toEqual(mockStudent);
    });
    const req = httpMock.expectOne(`${apiUrl}/updateStudent`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockStudent);
    req.flush(mockStudent);
  });

  it('should delete student', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/deleteStudent/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
