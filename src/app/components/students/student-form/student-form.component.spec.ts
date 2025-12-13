import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StudentFormComponent } from './student-form.component';
import { StudentService, DepartmentService } from '../../../services';

describe('StudentFormComponent', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentService: jasmine.SpyObj<StudentService>;
  let departmentService: jasmine.SpyObj<DepartmentService>;
  let router: Router;

  const mockStudent = { idStudent: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '123', dateOfBirth: '2000-01-01', address: '123 St' };
  const mockDepartments = [{ idDepartment: 1, name: 'CS', location: 'A', phone: '123', head: 'Dr. Smith' }];

  beforeEach(async () => {
    const studentSpy = jasmine.createSpyObj('StudentService', ['getById', 'create', 'update']);
    const deptSpy = jasmine.createSpyObj('DepartmentService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: StudentService, useValue: studentSpy },
        { provide: DepartmentService, useValue: deptSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    router = TestBed.inject(Router);
    departmentService.getAll.and.returnValue(of(mockDepartments));
    studentService.create.and.returnValue(of(mockStudent));
    studentService.update.and.returnValue(of(mockStudent));
    studentService.getById.and.returnValue(of(mockStudent));

    fixture = TestBed.createComponent(StudentFormComponent);
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

  it('should load departments on init', () => {
    fixture.detectChanges();
    expect(component.depts.length).toBe(1);
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '123', dateOfBirth: '2000-01-01', address: '123 St' });
    expect(component.form.valid).toBeTrue();
  });

  it('should check invalid field', () => {
    fixture.detectChanges();
    component.form.get('firstName')?.markAsTouched();
    expect(component.inv('firstName')).toBeTrue();
  });

  it('should not submit invalid form', () => {
    fixture.detectChanges();
    component.submit();
    expect(studentService.create).not.toHaveBeenCalled();
  });

  it('should create student on valid submit', () => {
    fixture.detectChanges();
    component.form.patchValue({ firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '123', dateOfBirth: '2000-01-01', address: '123 St' });
    spyOn(router, 'navigate');
    component.submit();
    expect(studentService.create).toHaveBeenCalled();
  });
});

describe('StudentFormComponent Edit Mode', () => {
  let component: StudentFormComponent;
  let fixture: ComponentFixture<StudentFormComponent>;
  let studentService: jasmine.SpyObj<StudentService>;
  let departmentService: jasmine.SpyObj<DepartmentService>;

  const mockStudent = { idStudent: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '123', dateOfBirth: '2000-01-01', address: '123 St' };

  beforeEach(async () => {
    const studentSpy = jasmine.createSpyObj('StudentService', ['getById', 'create', 'update']);
    const deptSpy = jasmine.createSpyObj('DepartmentService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [StudentFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: StudentService, useValue: studentSpy },
        { provide: DepartmentService, useValue: deptSpy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    }).compileComponents();

    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    departmentService.getAll.and.returnValue(of([]));
    studentService.getById.and.returnValue(of(mockStudent));
    studentService.update.and.returnValue(of(mockStudent));

    fixture = TestBed.createComponent(StudentFormComponent);
    component = fixture.componentInstance;
  });

  it('should load student in edit mode', () => {
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
    expect(component.id).toBe(1);
  });

  it('should update student on submit', () => {
    fixture.detectChanges();
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(studentService.update).toHaveBeenCalled();
  });
});
