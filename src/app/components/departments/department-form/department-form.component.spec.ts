import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DepartmentFormComponent } from './department-form.component';
import { DepartmentService } from '../../../services';
import { commonTestImports, createMockDepartment, provideActivatedRoute } from '../../../testing/test-utils';

describe('DepartmentFormComponent', () => {
  let component: DepartmentFormComponent;
  let fixture: ComponentFixture<DepartmentFormComponent>;
  let departmentService: jasmine.SpyObj<DepartmentService>;
  const mockDepartment = createMockDepartment();

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DepartmentService', ['getById', 'create', 'update']);

    await TestBed.configureTestingModule({
      imports: [DepartmentFormComponent, ...commonTestImports],
      providers: [{ provide: DepartmentService, useValue: spy }, provideActivatedRoute()]
    }).compileComponents();

    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    departmentService.create.and.returnValue(of(mockDepartment));
    departmentService.update.and.returnValue(of(mockDepartment));
    departmentService.getById.and.returnValue(of(mockDepartment));

    fixture = TestBed.createComponent(DepartmentFormComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize form', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(component.editMode).toBeFalse();
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ name: 'CS', location: 'Building A', phone: '123', head: 'Dr. Smith' });
    expect(component.form.valid).toBeTrue();
  });

  it('should check invalid field and create department', () => {
    fixture.detectChanges();
    component.form.get('name')?.markAsTouched();
    expect(component.inv('name')).toBeTrue();
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
  const mockDepartment = createMockDepartment();

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DepartmentService', ['getById', 'create', 'update']);

    await TestBed.configureTestingModule({
      imports: [DepartmentFormComponent, ...commonTestImports],
      providers: [{ provide: DepartmentService, useValue: spy }, provideActivatedRoute({ id: '1' })]
    }).compileComponents();

    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    departmentService.getById.and.returnValue(of(mockDepartment));
    departmentService.update.and.returnValue(of(mockDepartment));

    fixture = TestBed.createComponent(DepartmentFormComponent);
    component = fixture.componentInstance;
  });

  it('should load and update department in edit mode', () => {
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(departmentService.update).toHaveBeenCalled();
  });
});
