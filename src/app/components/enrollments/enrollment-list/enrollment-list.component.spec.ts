import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { EnrollmentListComponent } from './enrollment-list.component';
import { EnrollmentService } from '../../../services';
import { Enrollment } from '../../../models';

describe('EnrollmentListComponent', () => {
  let component: EnrollmentListComponent;
  let fixture: ComponentFixture<EnrollmentListComponent>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;

  const mockEnrollments: Enrollment[] = [
    { idEnrollment: 1, enrollmentDate: '2024-01-01', status: 'ACTIVE', grade: 85, student: { idStudent: 1, firstName: 'John', lastName: 'Doe', email: '', phone: '', dateOfBirth: '', address: '' }, course: { idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: '' } },
    { idEnrollment: 2, enrollmentDate: '2024-01-02', status: 'COMPLETED', grade: 90, student: { idStudent: 2, firstName: 'Jane', lastName: 'Smith', email: '', phone: '', dateOfBirth: '', address: '' }, course: { idCourse: 2, name: 'Math201', code: 'MATH201', credit: 4, description: '' } }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EnrollmentService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [EnrollmentListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: EnrollmentService, useValue: spy }]
    }).compileComponents();

    enrollmentService = TestBed.inject(EnrollmentService) as jasmine.SpyObj<EnrollmentService>;
    enrollmentService.getAll.and.returnValue(of(mockEnrollments));
    enrollmentService.delete.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(EnrollmentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load enrollments on init', () => {
    fixture.detectChanges();
    expect(component.items.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should filter enrollments by student name', () => {
    fixture.detectChanges();
    component.search = 'john';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should filter enrollments by course name', () => {
    fixture.detectChanges();
    component.search = 'Math';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should return initials', () => {
    const enrollment = mockEnrollments[0];
    expect(component.initials(enrollment)).toBe('JD');
  });

  it('should get color based on id', () => {
    const color = component.getColor(mockEnrollments[0]);
    expect(color).toBeTruthy();
  });

  it('should confirm delete', () => {
    fixture.detectChanges();
    component.confirmDel(mockEnrollments[0]);
    expect(component.selected).toEqual(mockEnrollments[0]);
    expect(component.showDel).toBeTrue();
  });

  it('should delete enrollment', () => {
    fixture.detectChanges();
    component.selected = mockEnrollments[0];
    component.del();
    expect(enrollmentService.delete).toHaveBeenCalledWith(1);
  });

  it('should handle load error', () => {
    enrollmentService.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
