import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { DepartmentListComponent } from './department-list.component';
import { DepartmentService } from '../../../services';
import { Department } from '../../../models';

describe('DepartmentListComponent', () => {
  let component: DepartmentListComponent;
  let fixture: ComponentFixture<DepartmentListComponent>;
  let departmentService: jasmine.SpyObj<DepartmentService>;

  const mockDepartments: Department[] = [
    { idDepartment: 1, name: 'Computer Science', location: 'Building A', phone: '123', head: 'Dr. Smith' },
    { idDepartment: 2, name: 'Mathematics', location: 'Building B', phone: '456', head: 'Dr. Jones' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DepartmentService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [DepartmentListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: DepartmentService, useValue: spy }]
    }).compileComponents();

    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    departmentService.getAll.and.returnValue(of(mockDepartments));
    departmentService.delete.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(DepartmentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

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

  it('should confirm delete', () => {
    fixture.detectChanges();
    component.confirmDel(mockDepartments[0]);
    expect(component.selected).toEqual(mockDepartments[0]);
    expect(component.showDel).toBeTrue();
  });

  it('should delete department', () => {
    fixture.detectChanges();
    component.selected = mockDepartments[0];
    component.del();
    expect(departmentService.delete).toHaveBeenCalledWith(1);
  });

  it('should handle load error', () => {
    departmentService.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
