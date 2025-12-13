import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class StudentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/students`;

  getAll(): Observable<Student[]> {
    return this.http.get<Student[]>(`${this.apiUrl}/getAllStudents`);
  }

  getById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.apiUrl}/getStudent/${id}`);
  }

  create(student: Student): Observable<Student> {
    return this.http.post<Student>(`${this.apiUrl}/createStudent`, student);
  }

  update(student: Student): Observable<Student> {
    return this.http.put<Student>(`${this.apiUrl}/updateStudent`, student);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteStudent/${id}`);
  }
}
