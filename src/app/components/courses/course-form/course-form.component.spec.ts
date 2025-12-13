import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CourseFormComponent } from './course-form.component';
import { CourseService } from '../../../services';

describe('CourseFormComponent', () => {
  let component: CourseFormComponent;
  let fixture: ComponentFixture<CourseFormComponent>;
  let courseService: jasmine.SpyObj<CourseService>;

  const mockCourse = { idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: 'Intro' };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CourseService', ['getById', 'create', 'update']);

    await TestBed.configureTestingModule({
      imports: [CourseFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CourseService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {} } } }
      ]
    }).compileComponents();

    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    courseService.create.and.returnValue(of(mockCourse));
    courseService.update.and.returnValue(of(mockCourse));
    courseService.getById.and.returnValue(of(mockCourse));

    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    fixture.detectChanges();
    expect(component.form).toBeTruthy();
    expect(component.editMode).toBeFalse();
  });

  it('should validate required fields', () => {
    fixture.detectChanges();
    expect(component.form.valid).toBeFalse();
    component.form.patchValue({ name: 'CS101', code: 'CS101', credit: 3, description: 'Intro' });
    expect(component.form.valid).toBeTrue();
  });

  it('should check invalid field', () => {
    fixture.detectChanges();
    component.form.get('name')?.markAsTouched();
    expect(component.inv('name')).toBeTrue();
  });

  it('should create course on valid submit', () => {
    fixture.detectChanges();
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

  const mockCourse = { idCourse: 1, name: 'CS101', code: 'CS101', credit: 3, description: 'Intro' };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('CourseService', ['getById', 'create', 'update']);

    await TestBed.configureTestingModule({
      imports: [CourseFormComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: CourseService, useValue: spy },
        { provide: ActivatedRoute, useValue: { snapshot: { params: { id: '1' } } } }
      ]
    }).compileComponents();

    courseService = TestBed.inject(CourseService) as jasmine.SpyObj<CourseService>;
    courseService.getById.and.returnValue(of(mockCourse));
    courseService.update.and.returnValue(of(mockCourse));

    fixture = TestBed.createComponent(CourseFormComponent);
    component = fixture.componentInstance;
  });

  it('should load course in edit mode', () => {
    fixture.detectChanges();
    expect(component.editMode).toBeTrue();
  });

  it('should update course on submit', () => {
    fixture.detectChanges();
    spyOn(TestBed.inject(Router), 'navigate');
    component.submit();
    expect(courseService.update).toHaveBeenCalled();
  });
});
