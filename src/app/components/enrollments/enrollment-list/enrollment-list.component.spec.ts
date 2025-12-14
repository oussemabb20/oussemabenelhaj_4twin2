import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { EnrollmentListComponent } from './enrollment-list.component';
import { EnrollmentService } from '../../../services';
import { Enrollment } from '../../../models';
import { commonTestImports, createMockEnrollment } from '../../../testing/test-utils';

describe('EnrollmentListComponent', () => {
  let component: EnrollmentListComponent;
  let fixture: ComponentFixture<EnrollmentListComponent>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;

  const mockEnrollments: Enrollment[] = [
    createMockEnrollment(),
    createMockEnrollment({ idEnrollment: 2, status: 'COMPLETED', grade: 90, student: { idStudent: 2, firstName: 'Jane', lastName: 'Smith', email: '', phone: '', dateOfBirth: '', address: '' }, course: { idCourse: 2, name: 'Math201', code: 'MATH201', credit: 4, description: '' } })
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EnrollmentService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [EnrollmentListComponent, ...commonTestImports],
      providers: [{ provide: EnrollmentService, useValue: spy }]
    }).compileComponents();

    enrollmentService = TestBed.inject(EnrollmentService) as jasmine.SpyObj<EnrollmentService>;
    enrollmentService.getAll.and.returnValue(of(mockEnrollments));
    enrollmentService.delete.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(EnrollmentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load enrollments on init', () => {
    fixture.detectChanges();
    expect(component.items.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should filter by student name', () => {
    fixture.detectChanges();
    component.search = 'john';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should return initials and color', () => {
    expect(component.initials(mockEnrollments[0])).toBe('JD');
    expect(component.getColor(mockEnrollments[0])).toBeTruthy();
  });

  it('should confirm and delete enrollment', () => {
    fixture.detectChanges();
    component.confirmDel(mockEnrollments[0]);
    expect(component.showDel).toBeTrue();
    component.del();
    expect(enrollmentService.delete).toHaveBeenCalledWith(1);
  });

  it('should handle load error', () => {
    enrollmentService.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
