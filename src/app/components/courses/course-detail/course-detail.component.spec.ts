import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CourseDetailComponent } from './course-detail.component';
import { CourseService } from '../../../services';

describe('CourseDetailComponent', () => {
  let component: CourseDetailComponent;
  let fixture: ComponentFixture<CourseDetailComponent>;
  let courseService: jasmine.SpyObj<CourseService>;
  let router: Router;

  const mockCourse = { idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: 'Intro' };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CourseService', ['getById']);

    await TestBed.configureTestingModule({
      imports: [CourseDetailComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CourseService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    }).compileComponents();

    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    router = TestBed.inject(Router);
    courseService.getById.and.returnValue(of(mockCourse));

    fixture = TestBed.createComponent(CourseDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load course on init', () => {
    fixture.detectChanges();
    expect(component.item).toEqual(mockCourse);
    expect(component.loading).toBeFalse();
  });

  it('should navigate on error', () => {
    courseService.getById.and.returnValue(throwError(() => new Error('Error')));
    spyOn(router, 'navigate');
    fixture.detectChanges();
  });
});
