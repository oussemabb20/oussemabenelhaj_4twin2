import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService, DepartmentService } from '../../../services';
import { Department } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page animate-fade-in">
      <a routerLink="/students" class="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 12H5m7 7-7-7 7-7"/></svg>Back to Students</a>
      <header class="page-header"><h1>{{ editMode ? 'Edit Student' : 'New Student' }}</h1><p>{{ editMode ? 'Update student information' : 'Add a new student record' }}</p></header>
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <form [formGroup]="form" (ngSubmit)="submit()" *ngIf="!loading" class="form-card">
        <section class="section">
          <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2"/></svg>Personal Info</h3>
          <div class="grid">
            <div class="field"><label>First Name <span>*</span></label><input formControlName="firstName" class="form-control" [class.invalid]="inv('firstName')" placeholder="John"><small *ngIf="inv('firstName')">Required</small></div>
            <div class="field"><label>Last Name <span>*</span></label><input formControlName="lastName" class="form-control" [class.invalid]="inv('lastName')" placeholder="Doe"><small *ngIf="inv('lastName')">Required</small></div>
            <div class="field"><label>Date of Birth <span>*</span></label><input type="date" formControlName="dateOfBirth" class="form-control" [class.invalid]="inv('dateOfBirth')"><small *ngIf="inv('dateOfBirth')">Required</small></div>
            <div class="field"><label>Department</label><select formControlName="departmentId" class="form-control"><option [ngValue]="null">Select department</option><option *ngFor="let d of depts" [ngValue]="d.idDepartment">{{ d.name }}</option></select></div>
          </div>
        </section>
        <section class="section">
          <h3><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" width="20" height="20"><path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg>Contact Info</h3>
          <div class="grid">
            <div class="field"><label>Email <span>*</span></label><input type="email" formControlName="email" class="form-control" [class.invalid]="inv('email')" placeholder="john@example.com"><small *ngIf="inv('email')">Valid email required</small></div>
            <div class="field"><label>Phone <span>*</span></label><input formControlName="phone" class="form-control" [class.invalid]="inv('phone')" placeholder="+1 234 567 890"><small *ngIf="inv('phone')">Required</small></div>
            <div class="field full"><label>Address <span>*</span></label><textarea formControlName="address" class="form-control" [class.invalid]="inv('address')" rows="3" placeholder="Full address"></textarea><small *ngIf="inv('address')">Required</small></div>
          </div>
        </section>
        <footer class="form-footer"><a routerLink="/students" class="btn btn-secondary">Cancel</a><button type="submit" class="btn btn-primary" [disabled]="form.invalid || saving">{{ saving ? 'Saving...' : (editMode ? 'Update' : 'Create') }}</button></footer>
      </form>
    </div>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 900px; margin: 0 auto; }
    .back { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4); &:hover { color: var(--primary-400); } }
    .page-header { margin-bottom: var(--space-6); h1 { margin-bottom: var(--space-1); } p { color: var(--text-secondary); } }
    .form-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .section { padding: var(--space-6); border-bottom: 1px solid var(--border-subtle); h3 { display: flex; align-items: center; gap: var(--space-3); font-size: 1rem; margin-bottom: var(--space-5); svg { color: var(--primary-400); } } }
    .grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-5); }
    .field { &.full { grid-column: 1 / -1; } label { display: block; font-size: 0.875rem; font-weight: 500; color: var(--text-secondary); margin-bottom: var(--space-2); span { color: var(--error-500); } } small { display: block; color: var(--error-500); font-size: 0.8125rem; margin-top: var(--space-2); } }
    .form-footer { display: flex; justify-content: flex-end; gap: var(--space-4); padding: var(--space-5) var(--space-6); background: var(--bg-base); }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .section { padding: var(--space-4); } .grid { grid-template-columns: 1fr; } .form-footer { flex-direction: column-reverse; .btn { width: 100%; } } }
  `]
})
export class StudentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private svc = inject(StudentService);
  private deptSvc = inject(DepartmentService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  form!: FormGroup;
  depts: Department[] = [];
  editMode = false;
  loading = true;
  saving = false;
  id?: number;

  ngOnInit(): void {
    this.form = this.fb.group({ firstName: ['', Validators.required], lastName: ['', Validators.required], email: ['', [Validators.required, Validators.email]], phone: ['', Validators.required], dateOfBirth: ['', Validators.required], address: ['', Validators.required], departmentId: [null] });
    this.deptSvc.getAll().subscribe({ next: d => this.depts = d });
    const id = this.route.snapshot.params['id'];
    if (id && id !== 'new') { this.editMode = true; this.id = +id; this.load(this.id); } else { this.loading = false; }
  }
  load(id: number): void { this.svc.getById(id).subscribe({ next: s => { this.form.patchValue({ ...s, departmentId: s.department?.idDepartment || null }); this.loading = false; }, error: () => this.router.navigate(['/students']) }); }
  inv(f: string): boolean { const c = this.form.get(f); return !!(c && c.invalid && c.touched); }
  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const v = this.form.value;
    const data: any = { firstName: v.firstName, lastName: v.lastName, email: v.email, phone: v.phone, dateOfBirth: v.dateOfBirth, address: v.address };
    if (v.departmentId) data.department = { idDepartment: v.departmentId };
    if (this.editMode && this.id) { data.idStudent = this.id; this.svc.update(data).subscribe({ next: () => this.router.navigate(['/students']), error: () => this.saving = false }); }
    else { this.svc.create(data).subscribe({ next: () => this.router.navigate(['/students']), error: () => this.saving = false }); }
  }
}
