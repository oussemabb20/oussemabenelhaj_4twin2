import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../services';
import { LoadingSpinnerComponent } from '../../../shared';

@Component({
  selector: 'app-course-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page animate-fade-in">
      <a routerLink="/courses" class="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 12H5m7 7-7-7 7-7"/></svg>Back to Courses</a>
      <header class="page-header"><h1>{{ editMode ? 'Edit Course' : 'New Course' }}</h1><p>{{ editMode ? 'Update course information' : 'Add a new course' }}</p></header>
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="!loading" class="form-card">
        <section class="section">
          <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg>Course Details</h3>
          <div class="grid">
            <div class="field"><label>Name <span>*</span></label><input formControlName="name" class="form-control" [class.invalid]="inv('name')" placeholder="Introduction to Programming"><small *ngIf="inv('name')">Required</small></div>
            <div class="field"><label>Code <span>*</span></label><input formControlName="code" class="form-control" [class.invalid]="inv('code')" placeholder="CS101"><small *ngIf="inv('code')">Required</small></div>
            <div class="field"><label>Credits <span>*</span></label><input type="number" formControlName="credit" class="form-control" [class.invalid]="inv('credit')" min="1"><small *ngIf="inv('credit')">Min 1 credit</small></div>
            <div class="field full"><label>Description <span>*</span></label><textarea formControlName="description" class="form-control" [class.invalid]="inv('description')" rows="4" placeholder="Course description"></textarea><small *ngIf="inv('description')">Required</small></div>
          </div>
        </section>
        <footer class="form-footer"><a routerLink="/courses" class="btn btn-secondary">Cancel</a><button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : (editMode ? 'Update' : 'Create') }}</button></footer>
      </form>
    </div>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 900px; margin: 0 auto; }
    .back { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4); &:hover { color: var(--primary-400); } }
    .page-header { margin-bottom: var(--space-6); h1 { margin-bottom: var(--space-1); } p { color: var(--text-secondary); } }
    .form-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .section { padding: var(--space-6); h3 { display: flex; align-items: center; gap: var(--space-3); font-size: 1rem; margin-bottom: var(--space-5); svg { color: var(--accent-500); } } }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-5); }
    .field { &.full { grid-column: 1 / -1; } label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--space-2); span { color: var(--error-500); } } small { display: block; color: var(--error-500); font-size: 0.8125rem; margin-top: var(--space-2); } }
    .form-footer { display: flex; justify-content: flex-end; gap: var(--space-4); padding: var(--space-5) var(--space-6); background: var(--bg-base); }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .grid { grid-template-columns: 1fr; } .form-footer { flex-direction: column-reverse; .btn { width: 100%; } } }
  `]
})
export class CourseFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly svc = inject(CourseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  form!: FormGroup;
  editMode = false;
  loading = false;
  saving = false;
  id?: number;

  ngOnInit(): void {
    this.form = this.fb.group({ name: ['', Validators.required], code: ['', Validators.required], credit: [3, [Validators.required, Validators.min(1)]], description: ['', Validators.required] });
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'new') { this.editMode = true; this.id = +id; this.load(this.id); }
  }
  load(id: number): void { this.loading = true; this.svc.getById(id).subscribe({ next: d => { this.form.patchValue(d); this.loading = false; }, error: () => { void this.router.navigate(['/courses']); } }); }
  inv(f: string): boolean { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const data = { ...this.form.value };
    if (this.editMode && this.id) { data.idCourse = this.id; this.svc.update(data).subscribe({ next: () => { void this.router.navigate(['/courses']); }, error: () => this.saving = false }); }
    else { this.svc.create(data).subscribe({ next: () => { void this.router.navigate(['/courses']); }, error: () => this.saving = false }); }
  }
}
