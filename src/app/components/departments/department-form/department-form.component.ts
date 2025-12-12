import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../../services';
import { LoadingSpinnerComponent } from '../../../shared';

@Component({
  selector: 'app-department-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page animate-fade-in">
      <a routerLink="/departments" class="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 12H5m7 7-7-7 7-7"/></svg>Back to Departments</a>
      <header class="page-header"><h1>{{ editMode ? 'Edit Department' : 'New Department' }}</h1><p>{{ editMode ? 'Update department information' : 'Add a new department' }}</p></header>
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="!loading" class="form-card">
        <section class="section">
          <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M3 21h18M5 21V7l7-4 7 4v14"/></svg>Department Details</h3>
          <div class="grid">
            <div class="field"><label>Name <span>*</span></label><input formControlName="name" class="form-control" [class.invalid]="inv('name')" placeholder="Computer Science"><small *ngIf="inv('name')">Required</small></div>
            <div class="field"><label>Location <span>*</span></label><input formControlName="location" class="form-control" [class.invalid]="inv('location')" placeholder="Building A, Floor 2"><small *ngIf="inv('location')">Required</small></div>
            <div class="field"><label>Phone <span>*</span></label><input formControlName="phone" class="form-control" [class.invalid]="inv('phone')" placeholder="+1 234 567 890"><small *ngIf="inv('phone')">Required</small></div>
            <div class="field"><label>Department Head <span>*</span></label><input formControlName="head" class="form-control" [class.invalid]="inv('head')" placeholder="Dr. John Smith"><small *ngIf="inv('head')">Required</small></div>
          </div>
        </section>
        <footer class="form-footer"><a routerLink="/departments" class="btn btn-secondary">Cancel</a><button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : (editMode ? 'Update' : 'Create') }}</button></footer>
      </form>
    </div>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 900px; margin: 0 auto; }
    .back { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4); &:hover { color: var(--primary-400); } }
    .page-header { margin-bottom: var(--space-6); h1 { margin-bottom: var(--space-1); } p { color: var(--text-secondary); } }
    .form-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .section { padding: var(--space-6); h3 { display: flex; align-items: center; gap: var(--space-3); font-size: 1rem; margin-bottom: var(--space-5); svg { color: var(--warning-500); } } }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-5); }
    .field { label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--space-2); span { color: var(--error-500); } } small { display: block; color: var(--error-500); font-size: 0.8125rem; margin-top: var(--space-2); } }
    .form-footer { display: flex; justify-content: flex-end; gap: var(--space-4); padding: var(--space-5) var(--space-6); background: var(--bg-base); }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .grid { grid-template-columns: 1fr; } .form-footer { flex-direction: column-reverse; .btn { width: 100%; } } }
  `]
})
export class DepartmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  form!: FormGroup;
  editMode = false;
  loading = false;
  saving = false;
  id?: number;

  ngOnInit(): void {
    this.form = this.fb.group({ name: ['', Validators.required], location: ['', Validators.required], phone: ['', Validators.required], head: ['', Validators.required] });
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'new') { this.editMode = true; this.id = +id; this.load(this.id); }
  }
  load(id: number): void { this.loading = true; this.svc.getById(id).subscribe({ next: d => { this.form.patchValue(d); this.loading = false; }, error: () => this.router.navigate(['/departments']) }); }
  inv(f: string): boolean { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const data = { ...this.form.value };
    if (this.editMode && this.id) { data.idDepartment = this.id; this.svc.update(data).subscribe({ next: () => this.router.navigate(['/departments']), error: () => this.saving = false }); }
    else { this.svc.create(data).subscribe({ next: () => this.router.navigate(['/departments']), error: () => this.saving = false }); }
  }
}
