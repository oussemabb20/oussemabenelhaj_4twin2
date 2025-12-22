import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EnrollmentService } from '../../../services';
import { Enrollment } from '../../../models';
import { LoadingSpinnerComponent, ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-enrollment-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingSpinnerComponent, ConfirmDialogComponent],
  template: `
    <div class="page animate-fade-in">
      <header class="page-header">
        <div><h1>Enrollments</h1><p>Manage student enrollments</p></div>
        <a routerLink="/enrollments/new" class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 5v14m-7-7h14"/></svg>Add Enrollment</a>
      </header>
      <div class="card">
        <div class="toolbar">
          <div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Search enrollments..." [(ngModel)]="search" (input)="filter()"></div>
          <span class="count">{{ filtered.length }} enrollments</span>
        </div>
        <app-loading-spinner *ngIf="loading"></app-loading-spinner>
        <div class="table-wrap" *ngIf="!loading">
          <table class="table">
            <thead><tr><th>Student</th><th>Course</th><th>Date</th><th>Grade</th><th>Status</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let e of filtered">
                <td><div class="student"><div class="avatar" [style.background]="getColor(e)">{{ initials(e) }}</div><span>{{ e.student?.firstname }} {{ e.student?.lastname }}</span></div></td>
                <td><span class="course-tag">{{ e.course?.name }}</span></td>
                <td>{{ e.enrollmentDate }}</td>
                <td><span class="grade" [class.na]="e.grade === null">{{ e.grade ?? '—' }}</span></td>
                <td><span class="status-badge" [class]="e.status.toLowerCase()">{{ e.status }}</span></td>
                <td><div class="actions"><a [routerLink]="['/enrollments', e.idEnrollment]" class="btn btn-ghost btn-icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></a><a [routerLink]="['/enrollments', e.idEnrollment, 'edit']" class="btn btn-ghost btn-icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></a><button class="btn btn-ghost btn-icon-sm" (click)="confirmDel(e)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div></td>
              </tr>
              <tr *ngIf="filtered.length === 0"><td colspan="6"><div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/></svg><h3>No enrollments found</h3><p>Add your first enrollment</p><a routerLink="/enrollments/new" class="btn btn-primary">Add Enrollment</a></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <app-confirm-dialog [isOpen]="showDel" title="Delete Enrollment" message="Delete this enrollment?" (confirmed)="del()" (cancelled)="showDel = false"></app-confirm-dialog>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 1440px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4); h1 { margin-bottom: var(--space-1); } p { color: var(--text-secondary); } }
    .card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: var(--space-4); }
    .search { display: flex; align-items: center; gap: var(--space-3); background: var(--bg-base); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: var(--space-2) var(--space-4); min-width: 300px; svg { width: 18px; height: 18px; color: var(--text-muted); } input { border: none; background: none; color: var(--text-primary); font-size: 0.9375rem; width: 100%; &::placeholder { color: var(--text-muted); } &:focus { outline: none; } } }
    .count { font-size: 0.875rem; color: var(--text-secondary); }
    .table-wrap { overflow-x: auto; }
    .student { display: flex; align-items: center; gap: var(--space-3); }
    .avatar { width: 36px; height: 36px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.75rem; }
    .course-tag { display: inline-block; padding: var(--space-1) var(--space-3); background: rgba(45, 212, 191, 0.1); color: var(--accent-400); border-radius: var(--radius-md); font-size: 0.8125rem; font-weight: 500; }
    .grade { font-weight: 600; &.na { color: var(--text-muted); font-weight: 400; } }
    .actions { display: flex; gap: var(--space-1); }
    .empty { padding: var(--space-16) var(--space-8); text-align: center; svg { width: 64px; height: 64px; color: var(--text-muted); margin-bottom: var(--space-4); } h3 { margin-bottom: var(--space-2); } p { color: var(--text-secondary); margin-bottom: var(--space-6); } }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .search { min-width: 100%; } }
  `]
})
export class EnrollmentListComponent implements OnInit {
  private readonly svc = inject(EnrollmentService);
  items: Enrollment[] = [];
  filtered: Enrollment[] = [];
  loading = true;
  showDel = false;
  selected: Enrollment | null = null;
  search = '';
  colors = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6'];

  ngOnInit(): void { this.load(); }
  load(): void { this.svc.getAll().subscribe({ next: d => { this.items = d; this.filtered = d; this.loading = false; }, error: () => this.loading = false }); }
  filter(): void { const t = this.search.toLowerCase(); this.filtered = this.items.filter(i => (i.student?.firstname + ' ' + i.student?.lastname + ' ' + i.course?.name).toLowerCase().includes(t)); }
  initials(e: Enrollment): string { return e.student ? ((e.student.firstname?.[0] || '') + (e.student.lastname?.[0] || '')).toUpperCase() : '??'; }
  getColor(e: Enrollment): string { return this.colors[(e.idEnrollment || 0) % this.colors.length]; }
  confirmDel(e: Enrollment): void { this.selected = e; this.showDel = true; }
  del(): void { if (this.selected?.idEnrollment) { this.svc.delete(this.selected.idEnrollment).subscribe({ next: () => { this.items = this.items.filter(i => i.idEnrollment !== this.selected?.idEnrollment); this.filter(); this.showDel = false; }, error: () => this.showDel = false }); } }
}
