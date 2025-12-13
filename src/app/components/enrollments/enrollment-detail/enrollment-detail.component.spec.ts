import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { EnrollmentDetailComponent } from './enrollment-detail.component';
import { EnrollmentService } from '../../../services';

describe('EnrollmentDetailComponent', () => {
  let component: EnrollmentDetailComponent;
  let fixture: ComponentFixture<EnrollmentDetailComponent>;
  let enrollmentService: jasmine.SpyObj<EnrollmentService>;
  let router: Router;

  const mockEnrollment = { idEnrollment: 1, enrollmentDate: '2024-01-01', status: 'ACTIVE' as const, grade: 85 };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('EnrollmentService', ['getById']);

    await TestBed.configureTestingModule({
      imports: [EnrollmentDetailComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: EnrollmentService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    }).compileComponents();

    enrollmentService = TestBed.inject(EnrollmentService) as jasmine.SpyObj<EnrollmentService>;
    router = TestBed.inject(Router);
    enrollmentService.getById.and.returnValue(of(mockEnrollment));

    fixture = TestBed.createComponent(EnrollmentDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load enrollment on init', () => {
    fixture.detectChanges();
    expect(component.item).toEqual(mockEnrollment);
    expect(component.loading).toBeFalse();
  });

  it('should navigate on error', () => {
    enrollmentService.getById.and.returnValue(throwError(() => new Error('Error')));
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });
});
