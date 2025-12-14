import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { CourseFormComponent } from './course-form.component';
import { CourseService } from '../../../services';
import { commonTestImports, createMockCourse, provideActivatedRoute } from '../../../testing/test-utils';

describe('CourseFormComponent', () => {
  let component: CourseFormComponent;
  let fixture: ComponentFixture<CourseFormComponent>;
  let courseService: jasmine.SpyObj<CourseService>;
  const mockCourse = createMockCourse();

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CourseService', ['getById', 'create', 'update']);

    await TestBed.configureTestingModule({
      imports: [CourseFormComponent, ...commonTestImports],
      providers: [{ provide: CourseService, useValue: spy }, provideActivatedRoute()]
    }).compileComponents();

    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    courseService.create.and.returnValue(of(mockCourse));
    courseService.update.and.returnValue(of(mockCourse));
    courseService.getById.and.returnValue(of(mockCourse));

    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;
  });

  it('should create and initialize form', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.form).toBeTruthy();
    expect(component.editMode).toBeFalse();
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ name: 'CS101', code: 'CS101', credit: 3, description: 'Intro' });
    expect(component.form.valid).toBeTrue();
  });

  it('should check invalid field and create course', () => {
    fixture.detectChanges();
    component.form.get('name')?.markAsTouched();
    expect(component.inv('name')).toBeTrue();
    component.form.patchValue({ name: 'CS101', code: 'CS101', credit: 3, description: 'Intro' });
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(courseService.create).toHaveBeenCalled();
  });
});

describe('CourseFormComponent Edit Mode', () => {
  let component: CourseFormComponent;
  let fixture: ComponentFixture<CourseFormComponent>;
  let courseService: jasmine.SpyObj<CourseService>;
  const mockCourse = createMockCourse();

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CourseService', ['getById', 'create', 'update']);

    await TestBed.configureTestingModule({
      imports: [CourseFormComponent, ...commonTestImports],
      providers: [{ provide: CourseService, useValue: spy }, provideActivatedRoute({ id: '1' })]
    }).compileComponents();

    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    courseService.getById.and.returnValue(of(mockCourse));
    courseService.update.and.returnValue(of(mockCourse));

    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;
  });

  it('should load and update course in edit mode', () => {
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(courseService.update).toHaveBeenCalled();
  });
});
