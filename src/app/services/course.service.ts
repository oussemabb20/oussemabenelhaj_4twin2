import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Course } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CourseService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Course`;

  getAll(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.apiUrl}/getAllCourse`);
  }

  getById(id: number): Observable<Course> {
    return this.http.get<Course>(`${this.apiUrl}/getCourse/${id}`);
  }

  create(course: Course): Observable<Course> {
    return this.http.post<Course>(`${this.apiUrl}/createCourse`, course);
  }

  update(course: Course): Observable<Course> {
    return this.http.put<Course>(`${this.apiUrl}/updateCourse`, course);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteCourse/${id}`);
  }
}
