import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DepartmentDetailComponent } from './department-detail.component';
import { DepartmentService } from '../../../services';

describe('DepartmentDetailComponent', () => {
  let component: DepartmentDetailComponent;
  let fixture: ComponentFixture<DepartmentDetailComponent>;
  let departmentService: jasmine.SpyObj<DepartmentService>;
  let router: Router;

  const mockDepartment = { idDepartment: 1, name: 'CS', location: 'Building A', phone: '123', head: 'Dr. Smith' };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('DepartmentService', ['getById']);

    await TestBed.configureTestingModule({
      imports: [DepartmentDetailComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: DepartmentService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    }).compileComponents();

    departmentService = TestBed.inject(DepartmentService) as jasmine.SpyObj<DepartmentService>;
    router = TestBed.inject(Router);
    departmentService.getById.and.returnValue(of(mockDepartment));

    fixture = TestBed.createComponent(DepartmentDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load department on init', () => {
    fixture.detectChanges();
    expect(component.item).toEqual(mockDepartment);
    expect(component.loading).toBeFalse();
  });

  it('should navigate on error', () => {
    departmentService.getById.and.returnValue(throwError(() => new Error('Error')));
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });
});
