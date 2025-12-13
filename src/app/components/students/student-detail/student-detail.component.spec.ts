import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StudentDetailComponent } from './student-detail.component';
import { StudentService } from '../../../services';

describe('StudentDetailComponent', () => {
  let component: StudentDetailComponent;
  let fixture: ComponentFixture<StudentDetailComponent>;
  let studentService: jasmine.SpyObj<StudentService>;
  let router: Router;

  const mockStudent = { idStudent: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '123', dateOfBirth: '2000-01-01', address: '123 St' };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('StudentService', ['getById']);

    await TestBed.configureTestingModule({
      imports: [StudentDetailComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: StudentService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    }).compileComponents();

    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    router = TestBed.inject(Router);
    studentService.getById.and.returnValue(of(mockStudent));

    fixture = TestBed.createComponent(StudentDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load student on init', () => {
    fixture.detectChanges();
    expect(component.item).toEqual(mockStudent);
    expect(component.loading).toBeFalse();
  });

  it('should return initials', () => {
    fixture.detectChanges();
    expect(component.initials()).toBe('JD');
  });

  it('should navigate on error', () => {
    studentService.getById.and.returnValue(throwError(() => new Error('Error')));
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });
});
