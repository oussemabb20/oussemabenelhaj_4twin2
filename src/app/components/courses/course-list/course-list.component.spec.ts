import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CourseListComponent } from './course-list.component';
import { CourseService } from '../../../services';
import { Course } from '../../../models';
import { commonTestImports, createMockCourse } from '../../../testing/test-utils';

describe('CourseListComponent', () => {
  let component: CourseListComponent;
  let fixture: ComponentFixture<CourseListComponent>;
  let courseService: jasmine.SpyObj<CourseService>;

  const mockCourses: Course[] = [
    createMockCourse(),
    createMockCourse({ idCourse: 2, name: 'Math201', code: 'MATH201', credit: 4, description: 'Calculus' })
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CourseService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [CourseListComponent, ...commonTestImports],
      providers: [{ provide: CourseService, useValue: spy }]
    }).compileComponents();

    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    courseService.getAll.and.returnValue(of(mockCourses));
    courseService.delete.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(CourseListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => expect(component).toBeTruthy());

  it('should load courses on init', () => {
    fixture.detectChanges();
    expect(component.items.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should filter courses by name', () => {
    fixture.detectChanges();
    component.search = 'introduction';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should filter courses by code', () => {
    fixture.detectChanges();
    component.search = 'MATH';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should confirm and delete course', () => {
    fixture.detectChanges();
    component.confirmDel(mockCourses[0]);
    expect(component.selected).toEqual(mockCourses[0]);
    expect(component.showDel).toBeTrue();
    component.del();
    expect(courseService.delete).toHaveBeenCalledWith(1);
  });

  it('should handle load error', () => {
    courseService.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
