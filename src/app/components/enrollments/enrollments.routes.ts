import { Routes } from '@angular/router';

export const ENROLLMENT_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./enrollment-list/enrollment-list.component').then(m => m.EnrollmentListComponent)
  },
  {
    path: 'new',
    loadComponent: () => import('./enrollment-form/enrollment-form.component').then(m => m.EnrollmentFormComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./enrollment-detail/enrollment-detail.component').then(m => m.EnrollmentDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./enrollment-form/enrollment-form.component').then(m => m.EnrollmentFormComponent)
  }
];
