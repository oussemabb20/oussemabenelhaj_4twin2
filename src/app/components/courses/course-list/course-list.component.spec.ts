import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { CourseListComponent } from './course-list.component';
import { CourseService } from '../../../services';
import { Course } from '../../../models';

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let courseService: jasmine.SpyObj<CourseService>;

  const mockCourses: Course[] = [
    { idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: 'Intro to CS' },
    { idCourse: 2, name: 'Math201', code: 'MATH201', credit: 4, description: 'Calculus' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CourseService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [CourseListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: CourseService, useValue: spy }]
    }).compileComponents();

    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    courseService.getAll.and.returnValue(of(mockCourses));
    courseService.delete.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load courses on init', () => {
    fixture.detectChanges();
    expect(component.items.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should filter courses by name', () => {
    fixture.detectChanges();
    component.search = 'cs101';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should filter courses by code', () => {
    fixture.detectChanges();
    component.search = 'MATH';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should confirm delete', () => {
    fixture.detectChanges();
    component.confirmDel(mockCourses[0]);
    expect(component.selected).toEqual(mockCourses[0]);
    expect(component.showDel).toBeTrue();
  });

  it('should delete course', () => {
    fixture.detectChanges();
    component.selected = mockCourses[0];
    component.del();
    expect(courseService.delete).toHaveBeenCalledWith(1);
  });

  it('should handle load error', () => {
    courseService.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
