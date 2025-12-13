import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EnrollmentService, StudentService, CourseService } from '../../../services';
import { Student, Course, EnrollmentStatus } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared';

@Component({
  selector: 'app-enrollment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page animate-fade-in">
      <a routerLink="/enrollments" class="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 12H5m7 7-7-7 7-7"/></svg>Back to Enrollments</a>
      <header class="page-header"><h1>{{ editMode ? 'Edit Enrollment' : 'New Enrollment' }}</h1><p>{{ editMode ? 'Update enrollment information' : 'Enroll a student in a course' }}</p></header>
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="!loading" class="form-card">
        <section class="section">
          <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/></svg>Enrollment Details</h3>
          <div class="grid">
            <div class="field"><label>Student <span>*</span></label><select formControlName="studentId" class="form-control" [class.invalid]="inv('studentId')"><option [ngValue]="null">Select student</option><option *ngFor="let s of students" [ngValue]="s.idStudent">{{ s.firstName }} {{ s.lastName }}</option></select><small *ngIf="inv('studentId')">Required</small></div>
            <div class="field"><label>Course <span>*</span></label><select formControlName="courseId" class="form-control" [class.invalid]="inv('courseId')"><option [ngValue]="null">Select course</option><option *ngFor="let c of courses" [ngValue]="c.idCourse">{{ c.name }} ({{ c.code }})</option></select><small *ngIf="inv('courseId')">Required</small></div>
            <div class="field"><label>Enrollment Date <span>*</span></label><input type="date" formControlName="enrollmentDate" class="form-control" [class.invalid]="inv('enrollmentDate')"><small *ngIf="inv('enrollmentDate')">Required</small></div>
            <div class="field"><label>Status <span>*</span></label><select formControlName="status" class="form-control"><option *ngFor="let s of statuses" [value]="s">{{ s }}</option></select></div>
            <div class="field"><label>Grade (optional)</label><input type="number" formControlName="grade" class="form-control" min="0" max="100" step="0.1" placeholder="0-100"></div>
          </div>
        </section>
        <footer class="form-footer"><a routerLink="/enrollments" class="btn btn-secondary">Cancel</a><button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : (editMode ? 'Update' : 'Create') }}</button></footer>
      </form>
    </div>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 900px; margin: 0 auto; }
    .back { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4); &:hover { color: var(--primary-400); } }
    .page-header { margin-bottom: var(--space-6); h1 { margin-bottom: var(--space-1); } p { color: var(--text-secondary); } }
    .form-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .section { padding: var(--space-6); h3 { display: flex; align-items: center; gap: var(--space-3); font-size: 1rem; margin-bottom: var(--space-5); svg { color: var(--primary-400); } } }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-5); }
    .field { label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--space-2); span { color: var(--error-500); } } small { display: block; color: var(--error-500); font-size: 0.8125rem; margin-top: var(--space-2); } }
    .form-footer { display: flex; justify-content: flex-end; gap: var(--space-4); padding: var(--space-5) var(--space-6); background: var(--bg-base); }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .grid { grid-template-columns: 1fr; } .form-footer { flex-direction: column-reverse; .btn { width: 100%; } } }
  `]
})
export class EnrollmentFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(EnrollmentService);
  private readonly studentSvc = inject(StudentService);
  private readonly courseSvc = inject(CourseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  form!: FormGroup;
  students: Student[] = [];
  courses: Course[] = [];
  statuses: EnrollmentStatus[] = ['ACTIVE', 'COMPLETED', 'DROPPED', 'FAILED', 'WITHDRAWN'];
  editMode = false;
  loading = true;
  saving = false;
  id?: number;

  ngOnInit(): void {
    this.form = this.fb.group({ studentId: [null, Validators.required], courseId: [null, Validators.required], enrollmentDate: ['', Validators.required], status: ['ACTIVE', Validators.required], grade: [null] });
    this.studentSvc.getAll().subscribe({ next: d => this.students = d });
    this.courseSvc.getAll().subscribe({ next: d => this.courses = d });
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'new') { this.editMode = true; this.id = +id; this.load(this.id); } else { this.loading = false; }
  }
  load(id: number): void { this.svc.getById(id).subscribe({ next: e => { this.form.patchValue({ studentId: e.student?.idStudent || null, courseId: e.course?.idCourse || null, enrollmentDate: e.enrollmentDate, status: e.status, grade: e.grade }); this.loading = false; }, error: () => { void this.router.navigate(['/enrollments']); } }); }
  inv(f: string): boolean { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const v = this.form.value;
    const data: any = { enrollmentDate: v.enrollmentDate, status: v.status, grade: v.grade, student: { idStudent: v.studentId }, course: { idCourse: v.courseId } };
    if (this.editMode && this.id) { data.idEnrollment = this.id; this.svc.update(data).subscribe({ next: () => { void this.router.navigate(['/enrollments']); }, error: () => this.saving = false }); }
    else { this.svc.create(data).subscribe({ next: () => { void this.router.navigate(['/enrollments']); }, error: () => this.saving = false }); }
  }
}
