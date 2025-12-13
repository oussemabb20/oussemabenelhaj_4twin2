import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Enrollment } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnrollmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Enrollment`;

  getAll(): Observable<Enrollment[]> {
    return this.http.get<Enrollment[]>(`${this.apiUrl}/getAllEnrollment`);
  }

  getById(id: number): Observable<Enrollment> {
    return this.http.get<Enrollment>(`${this.apiUrl}/getEnrollment/${id}`);
  }

  create(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.post<Enrollment>(`${this.apiUrl}/createEnrollment`, enrollment);
  }

  update(enrollment: Enrollment): Observable<Enrollment> {
    return this.http.put<Enrollment>(`${this.apiUrl}/updateEnrollment`, enrollment);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteEnrollment/${id}`);
  }
}
