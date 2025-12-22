import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../../services';
import { Student } from '../../../models';
import { LoadingSpinnerComponent, ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingSpinnerComponent, ConfirmDialogComponent],
  template: `
    <div class="page animate-fade-in">
      <header class="page-header">
        <div><h1>Students</h1><p>Manage student records</p></div>
        <a routerLink="/students/new" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 5v14m-7-7h14"/></svg>
          Add Student
        </a>
      </header>

      <div class="card">
        <div class="toolbar">
          <div class="search">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input type="text" placeholder="Search by name or email..." [(ngModel)]="search" (input)="filter()">
          </div>
          <span class="count">{{ filtered.length }} students</span>
        </div>

        <app-loading-spinner *ngIf="loading"></app-loading-spinner>

        <div class="table-wrap" *ngIf="!loading">
          <table class="table">
            <thead><tr><th>Student</th><th>Email</th><th>Phone</th><th>Department</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let s of filtered">
                <td>
                  <div class="user">
                    <div class="avatar" [style.background]="getColor(s)">{{ initials(s) }}</div>
                    <div><span class="name">{{ s.firstname }} {{ s.lastname }}</span><span class="id">#{{ s.idStudent }}</span></div>
                  </div>
                </td>
                <td><a [href]="'mailto:' + s.email">{{ s.email }}</a></td>
                <td>{{ s.phone }}</td>
                <td><span class="tag" *ngIf="s.department">{{ s.department.name }}</span><span class="text-muted" *ngIf="!s.department">—</span></td>
                <td>
                  <div class="actions">
                    <a [routerLink]="['/students', s.idStudent]" class="btn btn-ghost btn-icon-sm" title="View"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></a>
                    <a [routerLink]="['/students', s.idStudent, 'edit']" class="btn btn-ghost btn-icon-sm" title="Edit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></a>
                    <button class="btn btn-ghost btn-icon-sm" (click)="confirmDel(s)" title="Delete"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="filtered.length === 0"><td colspan="5"><div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2"/></svg><h3>No students found</h3><p>Add your first student to get started</p><a routerLink="/students/new" class="btn btn-primary">Add Student</a></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <app-confirm-dialog [isOpen]="showDel" title="Delete Student" [message]="'Delete ' + selected?.firstname + ' ' + selected?.lastname + '?'" (confirmed)="del()" (cancelled)="showDel = false"></app-confirm-dialog>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 1440px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4); h1 { margin-bottom: var(--space-1); } p { color: var(--text-secondary); font-size: 0.9375rem; } }
    .card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: var(--space-4); }
    .search { display: flex; align-items: center; gap: var(--space-3); background: var(--bg-base); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: var(--space-2) var(--space-4); min-width: 300px; svg { width: 18px; height: 18px; color: var(--text-muted); } input { border: none; background: none; color: var(--text-primary); font-size: 0.9375rem; width: 100%; &::placeholder { color: var(--text-muted); } &:focus { outline: none; } } }
    .count { font-size: 0.875rem; color: var(--text-secondary); }
    .table-wrap { overflow-x: auto; }
    .user { display: flex; align-items: center; gap: var(--space-3); }
    .avatar { width: 40px; height: 40px; border-radius: var(--radius-full); display: flex; align-items: center; justify-content: center; color: white; font-weight: 600; font-size: 0.875rem; flex-shrink: 0; }
    .name { display: block; font-weight: 500; }
    .id { font-size: 0.75rem; color: var(--text-muted); }
    .tag { display: inline-block; padding: var(--space-1) var(--space-3); background: rgba(99, 102, 241, 0.1); color: var(--primary-400); border-radius: var(--radius-full); font-size: 0.8125rem; font-weight: 500; }
    .actions { display: flex; gap: var(--space-1); }
    .empty { padding: var(--space-16) var(--space-8); text-align: center; svg { width: 64px; height: 64px; color: var(--text-muted); margin-bottom: var(--space-4); } h3 { margin-bottom: var(--space-2); } p { color: var(--text-secondary); margin-bottom: var(--space-6); } }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .search { min-width: 100%; } .toolbar { flex-direction: column; align-items: stretch; } }
  `]
})
export class StudentListComponent implements OnInit {
  private readonly svc = inject(StudentService);
  items: Student[] = [];
  filtered: Student[] = [];
  loading = true;
  showDel = false;
  selected: Student | null = null;
  search = '';
  colors = ['#6366f1', '#14b8a6', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  ngOnInit(): void { this.load(); }
  load(): void { this.svc.getAll().subscribe({ next: d => { this.items = d; this.filtered = d; this.loading = false; }, error: () => this.loading = false }); }
  filter(): void { const t = this.search.toLowerCase(); this.filtered = this.items.filter(s => (s.firstname + ' ' + s.lastname + ' ' + s.email).toLowerCase().includes(t)); }
  initials(s: Student): string { return ((s.firstname?.[0] || '') + (s.lastname?.[0] || '')).toUpperCase(); }
  getColor(s: Student): string { return this.colors[(s.idStudent || 0) % this.colors.length]; }
  confirmDel(s: Student): void { this.selected = s; this.showDel = true; }
  del(): void { if (this.selected?.idStudent) { this.svc.delete(this.selected.idStudent).subscribe({ next: () => { this.items = this.items.filter(i => i.idStudent !== this.selected?.idStudent); this.filter(); this.showDel = false; }, error: () => this.showDel = false }); } }
}
