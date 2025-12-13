import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { DepartmentFormComponent } from './department-form.component';
import { DepartmentService } from '../../../services';

describe('DepartmentFormComponent', () => {
  let component: DepartmentFormComponent;
  let fixture: ComponentFixture<DepartmentFormComponent>;
  let departmentService: jasmine.SpyObj<DepartmentService>;

  const mockDepartment = { idDepartment: 1, name: 'CS', location: 'Building A', phone: '123', head: 'Dr. Smith' };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DepartmentService', ['getById', 'create', 'update']);

    await TestBed.configureTestingModule({
      imports: [DepartmentFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: DepartmentService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    departmentService.create.and.returnValue(of(mockDepartment));
    departmentService.update.and.returnValue(of(mockDepartment));
    departmentService.getById.and.returnValue(of(mockDepartment));

    fixture = TestBed.createComponent(DepartmentFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    fixture.detectChanges();
    expect(component.form).toBeTruthy();
    expect(component.editMode).toBeFalse();
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ name: 'CS', location: 'Building A', phone: '123', head: 'Dr. Smith' });
    expect(component.form.valid).toBeTrue();
  });

  it('should check invalid field', () => {
    fixture.detectChanges();
    component.form.get('name')?.markAsTouched();
    expect(component.inv('name')).toBeTrue();
  });

  it('should create department on valid submit', () => {
    fixture.detectChanges();
    component.form.patchValue({ name: 'CS', location: 'Building A', phone: '123', head: 'Dr. Smith' });
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(departmentService.create).toHaveBeenCalled();
  });
});

describe('DepartmentFormComponent Edit Mode', () => {
  let component: DepartmentFormComponent;
  let fixture: ComponentFixture<DepartmentFormComponent>;
  let departmentService: jasmine.SpyObj<DepartmentService>;

  const mockDepartment = { idDepartment: 1, name: 'CS', location: 'Building A', phone: '123', head: 'Dr. Smith' };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DepartmentService', ['getById', 'create', 'update']);

    await TestBed.configureTestingModule({
      imports: [DepartmentFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: DepartmentService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    }).compileComponents();

    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    departmentService.getById.and.returnValue(of(mockDepartment));
    departmentService.update.and.returnValue(of(mockDepartment));

    fixture = TestBed.createComponent(DepartmentFormComponent);
    component = fixture.componentInstance;
  });

  it('should load department in edit mode', () => {
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
  });

  it('should update department on submit', () => {
    fixture.detectChanges();
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(departmentService.update).toHaveBeenCalled();
  });
});
