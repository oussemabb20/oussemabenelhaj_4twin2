import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { EnrollmentFormComponent } from './enrollment-form.component';
import { EnrollmentService, StudentService, CourseService } from '../../../services';
import { commonTestImports, createMockEnrollment, createMockStudent, createMockCourse, provideActivatedRoute } from '../../../testing/test-utils';

describe('EnrollmentFormComponent', () => {
  let component: EnrollmentFormComponent;
  let fixture: ComponentFixture<EnrollmentFormComponent>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;
  let studentService: jasmine.SpyObj<StudentService>;
  let courseService: jasmine.SpyObj<CourseService>;

  const mockEnrollment: any = createMockEnrollment();
  const mockStudents = [createMockStudent()];
  const mockCourses = [createMockCourse()];

  beforeEach(async () => {
    const enrollmentSpy = jasmine.createSpyObj('EnrollmentService', ['getById', 'create', 'update']);
    const studentSpy = jasmine.createSpyObj('StudentService', ['getAll']);
    const courseSpy = jasmine.createSpyObj('CourseService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [EnrollmentFormComponent, ...commonTestImports],
      providers: [
        { provide: EnrollmentService, useValue: enrollmentSpy },
        { provide: StudentService, useValue: studentSpy },
        { provide: CourseService, useValue: courseSpy },
        provideActivatedRoute()
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

  it('should create and initialize form', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.editMode).toBeFalse();
    expect(component.students.length).toBe(1);
    expect(component.courses.length).toBe(1);
  });

  it('should validate and create enrollment', () => {
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
    component.form.get('studentId')?.markAsTouched();
    expect(component.inv('studentId')).toBeTrue();
    component.form.patchValue({ studentId: 1, courseId: 1, enrollmentDate: '2024-01-01', status: 'ACTIVE' });
    expect(component.form.valid).toBeTrue();
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(enrollmentService.create).toHaveBeenCalled();
  });
});

describe('EnrollmentFormComponent Edit Mode', () => {
  let component: EnrollmentFormComponent;
  let fixture: ComponentFixture<EnrollmentFormComponent>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;

  const mockEnrollment: any = createMockEnrollment();

  beforeEach(async () => {
    const enrollmentSpy = jasmine.createSpyObj('EnrollmentService', ['getById', 'create', 'update']);
    const studentSpy = jasmine.createSpyObj('StudentService', ['getAll']);
    const courseSpy = jasmine.createSpyObj('CourseService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [EnrollmentFormComponent, ...commonTestImports],
      providers: [
        { provide: EnrollmentService, useValue: enrollmentSpy },
        { provide: StudentService, useValue: studentSpy },
        { provide: CourseService, useValue: courseSpy },
        provideActivatedRoute({ id: '1' })
      ]
    }).compileComponents();

    enrollmentService = TestBed.inject(EnrollmentService) as jasmine.SpyObj<EnrollmentService>;
    TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;

    (TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>).getAll.and.returnValue(of([]));
    (TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>).getAll.and.returnValue(of([]));
    enrollmentService.getById.and.returnValue(of(mockEnrollment));
    enrollmentService.update.and.returnValue(of(mockEnrollment));

    fixture = TestBed.createComponent(EnrollmentFormComponent);
    component = fixture.componentInstance;
  });

  it('should load and update enrollment in edit mode', () => {
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(enrollmentService.update).toHaveBeenCalled();
  });
});
