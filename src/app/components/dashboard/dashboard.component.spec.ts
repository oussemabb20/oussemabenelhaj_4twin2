import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { StudentService, DepartmentService, CourseService, EnrollmentService } from '../../services';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let studentService: jasmine.SpyObj<StudentService>;
  let departmentService: jasmine.SpyObj<DepartmentService>;
  let courseService: jasmine.SpyObj<CourseService>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;

  const mockStudents = [{ idStudent: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '123', dateOfBirth: '2000-01-01', address: '123 St' }];
  const mockDepartments = [{ idDepartment: 1, name: 'CS', location: 'Building A', phone: '123', head: 'Dr. Smith' }];
  const mockCourses = [{ idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: 'Intro' }];
  const mockEnrollments: any[] = [
    { idEnrollment: 1, enrollmentDate: '2024-01-01', status: 'ACTIVE', grade: 85 },
    { idEnrollment: 2, enrollmentDate: '2024-01-02', status: 'COMPLETED', grade: 90 }
  ];

  beforeEach(async () => {
    const studentSpy = jasmine.createSpyObj('StudentService', ['getAll']);
    const departmentSpy = jasmine.createSpyObj('DepartmentService', ['getAll']);
    const courseSpy = jasmine.createSpyObj('CourseService', ['getAll']);
    const enrollmentSpy = jasmine.createSpyObj('EnrollmentService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [DashboardComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: StudentService, useValue: studentSpy },
        { provide: DepartmentService, useValue: departmentSpy },
        { provide: CourseService, useValue: courseSpy },
        { provide: EnrollmentService, useValue: enrollmentSpy }
      ]
    }).compileComponents();

    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    enrollmentService = TestBed.inject(EnrollmentService) as jasmine.SpyObj<EnrollmentService>;
  });

  beforeEach(() => {
    studentService.getAll.and.returnValue(of(mockStudents));
    departmentService.getAll.and.returnValue(of(mockDepartments));
    courseService.getAll.and.returnValue(of(mockCourses));
    enrollmentService.getAll.and.returnValue(of(mockEnrollments));

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load data on init', () => {
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
    expect(component.stats.students).toBe(1);
    expect(component.stats.departments).toBe(1);
    expect(component.stats.courses).toBe(1);
    expect(component.stats.enrollments).toBe(2);
  });

  it('should build metrics after loading', () => {
    fixture.detectChanges();
    expect(component.metrics.length).toBe(4);
    expect(component.metrics[0].label).toBe('Students');
    expect(component.metrics[0].value).toBe(1);
  });

  it('should build chart data', () => {
    fixture.detectChanges();
    expect(component.statusData.length).toBe(5);
    expect(component.segments.length).toBe(5);
  });

  it('should handle error on load', () => {
    studentService.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });

  it('should count enrollment statuses correctly', () => {
    fixture.detectChanges();
    const activeStatus = component.statusData.find(s => s.name === 'Active');
    const completedStatus = component.statusData.find(s => s.name === 'Completed');
    expect(activeStatus?.count).toBe(1);
    expect(completedStatus?.count).toBe(1);
  });
});
