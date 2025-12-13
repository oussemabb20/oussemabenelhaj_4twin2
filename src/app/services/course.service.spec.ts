import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CourseService } from './course.service';
import { Course } from '../models';
import { environment } from '../../environments/environment';

describe('CourseService', () => {
  let service: CourseService;
  let httpMock: HttpTestingController;
  const apiUrl = `${environment.apiUrl}/Course`;

  const mockCourse: Course = {
    idCourse: 1,
    name: 'Introduction to Programming',
    code: 'CS101',
    credit: 3,
    description: 'Basic programming concepts'
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CourseService]
    });
    service = TestBed.inject(CourseService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all courses', () => {
    const mockCourses: Course[] = [mockCourse];
    service.getAll().subscribe(courses => {
      expect(courses.length).toBe(1);
      expect(courses).toEqual(mockCourses);
    });
    const req = httpMock.expectOne(`${apiUrl}/getAllCourse`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCourses);
  });

  it('should get course by id', () => {
    service.getById(1).subscribe(course => {
      expect(course).toEqual(mockCourse);
    });
    const req = httpMock.expectOne(`${apiUrl}/getCourse/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCourse);
  });

  it('should create course', () => {
    service.create(mockCourse).subscribe(course => {
      expect(course).toEqual(mockCourse);
    });
    const req = httpMock.expectOne(`${apiUrl}/createCourse`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockCourse);
    req.flush(mockCourse);
  });

  it('should update course', () => {
    service.update(mockCourse).subscribe(course => {
      expect(course).toEqual(mockCourse);
    });
    const req = httpMock.expectOne(`${apiUrl}/updateCourse`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockCourse);
    req.flush(mockCourse);
  });

  it('should delete course', () => {
    service.delete(1).subscribe();
    const req = httpMock.expectOne(`${apiUrl}/deleteCourse/1`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);
  });
});
