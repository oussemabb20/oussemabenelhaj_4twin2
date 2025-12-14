import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { DepartmentListComponent } from './department-list.component';
import { DepartmentService } from '../../../services';
import { Department } from '../../../models';
import { commonTestImports, createMockDepartment } from '../../../testing/test-utils';

describe('DepartmentListComponent', () => {
  let component: DepartmentListComponent;
  let fixture: ComponentFixture<DepartmentListComponent>;
  let departmentService: jasmine.SpyObj<DepartmentService>;

  const mockDepartments: Department[] = [
    createMockDepartment(),
    createMockDepartment({ idDepartment: 2, name: 'Mathematics', location: 'Building B', head: 'Dr. Jones' })
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DepartmentService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [DepartmentListComponent, ...commonTestImports],
      providers: [{ provide: DepartmentService, useValue: spy }]
    }).compileComponents();

    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    departmentService.getAll.and.returnValue(of(mockDepartments));
    departmentService.delete.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(DepartmentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load departments on init', () => {
    fixture.detectChanges();
    expect(component.items.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should filter departments by name', () => {
    fixture.detectChanges();
    component.search = 'computer';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should filter departments by location', () => {
    fixture.detectChanges();
    component.search = 'Building B';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should confirm and delete department', () => {
    fixture.detectChanges();
    component.confirmDel(mockDepartments[0]);
    expect(component.selected).toEqual(mockDepartments[0]);
    expect(component.showDel).toBeTrue();
    component.del();
    expect(departmentService.delete).toHaveBeenCalledWith(1);
  });

  it('should handle load error', () => {
    departmentService.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
