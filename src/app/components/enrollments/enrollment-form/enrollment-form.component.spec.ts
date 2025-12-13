import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { EnrollmentFormComponent } from './enrollment-form.component';
import { EnrollmentService, StudentService, CourseService } from '../../../services';

describe('EnrollmentFormComponent', () => {
  let component: EnrollmentFormComponent;
  let fixture: ComponentFixture<EnrollmentFormComponent>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;
  let studentService: jasmine.SpyObj<StudentService>;
  let courseService: jasmine.SpyObj<CourseService>;

  const mockEnrollment: any = { idEnrollment: 1, enrollmentDate: '2024-01-01', status: 'ACTIVE', grade: 85, student: { idStudent: 1, firstName: 'John', lastName: 'Doe', email: '', phone: '', dateOfBirth: '', address: '' }, course: { idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: '' } };
  const mockStudents = [{ idStudent: 1, firstName: 'John', lastName: 'Doe', email: '', phone: '', dateOfBirth: '', address: '' }];
  const mockCourses = [{ idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: '' }];

  beforeEach(async () => {
    const enrollmentSpy = jasmine.createSpyObj('EnrollmentService', ['getById', 'create', 'update']);
    const studentSpy = jasmine.createSpyObj('StudentService', ['getAll']);
    const courseSpy = jasmine.createSpyObj('CourseService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [EnrollmentFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: EnrollmentService, useValue: enrollmentSpy },
        { provide: StudentService, useValue: studentSpy },
        { provide: CourseService, useValue: courseSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    enrollmentService = TestBed.inject(EnrollmentService) as jasmine.SpyObj<EnrollmentService>;
    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;

    studentService.getAll.and.returnValue(of(mockStudents));
    courseService.getAll.and.returnValue(of(mockCourses));
    enrollmentService.create.and.returnValue(of(mockEnrollment));
    enrollmentService.update.and.returnValue(of(mockEnrollment));
    enrollmentService.getById.and.returnValue(of(mockEnrollment));

    fixture = TestBed.createComponent(EnrollmentFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form in create mode', () => {
    fixture.detectChanges();
    expect(component.editMode).toBeFalse();
    expect(component.form).toBeTruthy();
  });

  it('should load students and courses on init', () => {
    fixture.detectChanges();
    expect(component.students.length).toBe(1);
    expect(component.courses.length).toBe(1);
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ studentId: 1, courseId: 1, enrollmentDate: '2024-01-01', status: 'ACTIVE' });
    expect(component.form.valid).toBeTrue();
  });

  it('should check invalid field', () => {
    fixture.detectChanges();
    component.form.get('studentId')?.markAsTouched();
    expect(component.inv('studentId')).toBeTrue();
  });

  it('should create enrollment on valid submit', () => {
    fixture.detectChanges();
    component.form.patchValue({ studentId: 1, courseId: 1, enrollmentDate: '2024-01-01', status: 'ACTIVE' });
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(enrollmentService.create).toHaveBeenCalled();
  });
});

describe('EnrollmentFormComponent Edit Mode', () => {
  let component: EnrollmentFormComponent;
  let fixture: ComponentFixture<EnrollmentFormComponent>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;
  let studentService: jasmine.SpyObj<StudentService>;
  let courseService: jasmine.SpyObj<CourseService>;

  const mockEnrollment: any = { idEnrollment: 1, enrollmentDate: '2024-01-01', status: 'ACTIVE', grade: 85, student: { idStudent: 1, firstName: 'John', lastName: 'Doe', email: '', phone: '', dateOfBirth: '', address: '' }, course: { idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: '' } };

  beforeEach(async () => {
    const enrollmentSpy = jasmine.createSpyObj('EnrollmentService', ['getById', 'create', 'update']);
    const studentSpy = jasmine.createSpyObj('StudentService', ['getAll']);
    const courseSpy = jasmine.createSpyObj('CourseService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [EnrollmentFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: EnrollmentService, useValue: enrollmentSpy },
        { provide: StudentService, useValue: studentSpy },
        { provide: CourseService, useValue: courseSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    }).compileComponents();

    enrollmentService = TestBed.inject(EnrollmentService) as jasmine.SpyObj<EnrollmentService>;
    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;

    studentService.getAll.and.returnValue(of([]));
    courseService.getAll.and.returnValue(of([]));
    enrollmentService.getById.and.returnValue(of(mockEnrollment));
    enrollmentService.update.and.returnValue(of(mockEnrollment));

    fixture = TestBed.createComponent(EnrollmentFormComponent);
    component = fixture.componentInstance;
  });

  it('should load enrollment in edit mode', () => {
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
    expect(component.id).toBe(1);
  });

  it('should update enrollment on submit', () => {
    fixture.detectChanges();
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(enrollmentService.update).toHaveBeenCalled();
  });
});
