import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { StudentListComponent } from './student-list.component';
import { StudentService } from '../../../services';
import { Student } from '../../../models';

describe('StudentListComponent', () => {
  let component: StudentListComponent;
  let fixture: ComponentFixture<StudentListComponent>;
  let studentService: jasmine.SpyObj<StudentService>;

  const mockStudents: Student[] = [
    { idStudent: 1, firstName: 'John', lastName: 'Doe', email: 'john@test.com', phone: '123', dateOfBirth: '2000-01-01', address: '123 St' },
    { idStudent: 2, firstName: 'Jane', lastName: 'Smith', email: 'jane@test.com', phone: '456', dateOfBirth: '2001-02-02', address: '456 Ave' }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('StudentService', ['getAll', 'delete']);

    await TestBed.configureTestingModule({
      imports: [StudentListComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [{ provide: StudentService, useValue: spy }]
    }).compileComponents();

    studentService = TestBed.inject(StudentService) as jasmine.SpyObj<StudentService>;
    studentService.getAll.and.returnValue(of(mockStudents));
    studentService.delete.and.returnValue(of(void 0));

    fixture = TestBed.createComponent(StudentListComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load students on init', () => {
    fixture.detectChanges();
    expect(component.items.length).toBe(2);
    expect(component.filtered.length).toBe(2);
    expect(component.loading).toBeFalse();
  });

  it('should filter students by name', () => {
    fixture.detectChanges();
    component.search = 'john';
    component.filter();
    expect(component.filtered.length).toBe(1);
    expect(component.filtered[0].firstName).toBe('John');
  });

  it('should filter students by email', () => {
    fixture.detectChanges();
    component.search = 'jane@test';
    component.filter();
    expect(component.filtered.length).toBe(1);
  });

  it('should return initials', () => {
    const student: Student = { idStudent: 1, firstName: 'John', lastName: 'Doe', email: '', phone: '', dateOfBirth: '', address: '' };
    expect(component.initials(student)).toBe('JD');
  });

  it('should get color based on id', () => {
    const student: Student = { idStudent: 1, firstName: 'John', lastName: 'Doe', email: '', phone: '', dateOfBirth: '', address: '' };
    const color = component.getColor(student);
    expect(color).toBeTruthy();
  });

  it('should confirm delete', () => {
    fixture.detectChanges();
    component.confirmDel(mockStudents[0]);
    expect(component.selected).toEqual(mockStudents[0]);
    expect(component.showDel).toBeTrue();
  });

  it('should delete student', () => {
    fixture.detectChanges();
    component.selected = mockStudents[0];
    component.del();
    expect(studentService.delete).toHaveBeenCalledWith(1);
  });

  it('should handle load error', () => {
    studentService.getAll.and.returnValue(throwError(() => new Error('Error')));
    fixture.detectChanges();
    expect(component.loading).toBeFalse();
  });
});
