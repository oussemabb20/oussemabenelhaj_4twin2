import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department } from '../models';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DepartmentService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Depatment`;

  getAll(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.apiUrl}/getAllDepartment`);
  }

  getById(id: number): Observable<Department> {
    return this.http.get<Department>(`${this.apiUrl}/getDepartment/${id}`);
  }

  create(department: Department): Observable<Department> {
    return this.http.post<Department>(`${this.apiUrl}/createDepartment`, department);
  }

  update(department: Department): Observable<Department> {
    return this.http.put<Department>(`${this.apiUrl}/updateDepartment`, department);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteDepartment/${id}`);
  }
}
