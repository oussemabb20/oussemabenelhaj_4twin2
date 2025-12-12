import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'students',
    loadChildren: () => import('./components/students/students.routes').then(m => m.STUDENT_ROUTES)
  },
  {
    path: 'departments',
    loadChildren: () => import('./components/departments/departments.routes').then(m => m.DEPARTMENT_ROUTES)
  },
  {
    path: 'courses',
    loadChildren: () => import('./components/courses/courses.routes').then(m => m.COURSE_ROUTES)
  },
  {
    path: 'enrollments',
    loadChildren: () => import('./components/enrollments/enrollments.routes').then(m => m.ENROLLMENT_ROUTES)
  },
  { path: '**', redirectTo: '/dashboard' }
];
