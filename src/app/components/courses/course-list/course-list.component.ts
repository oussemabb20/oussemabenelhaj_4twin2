import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../../services';
import { Course } from '../../../models';
import { LoadingSpinnerComponent, ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-course-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingSpinnerComponent, ConfirmDialogComponent],
  template: `
    <div class="page animate-fade-in">
      <header class="page-header">
        <div><h1>Courses</h1><p>Manage course catalog</p></div>
        <a routerLink="/courses/new" class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 5v14m-7-7h14"/></svg>Add Course</a>
      </header>
      <div class="card">
        <div class="toolbar">
          <div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Search courses..." [(ngModel)]="search" (input)="filter()"></div>
          <span class="count">{{ filtered.length }} courses</span>
        </div>
        <app-loading-spinner *ngIf="loading"></app-loading-spinner>
        <div class="table-wrap" *ngIf="!loading">
          <table class="table">
            <thead><tr><th>Course</th><th>Code</th><th>Credits</th><th>Description</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let c of filtered">
                <td><div class="course"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg></div><div><span class="name">{{ c.name }}</span><span class="id">#{{ c.idCourse }}</span></div></div></td>
                <td><span class="code">{{ c.code }}</span></td>
                <td><span class="credits">{{ c.credit }}</span></td>
                <td class="desc">{{ (c.description || '') | slice:0:40 }}{{ (c.description || '').length > 40 ? '...' : '' }}</td>
                <td><div class="actions"><a [routerLink]="['/courses', c.idCourse]" class="btn btn-ghost btn-icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></a><a [routerLink]="['/courses', c.idCourse, 'edit']" class="btn btn-ghost btn-icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></a><button class="btn btn-ghost btn-icon-sm" (click)="confirmDel(c)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div></td>
              </tr>
              <tr *ngIf="filtered.length === 0"><td colspan="5"><div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg><h3>No courses found</h3><p>Add your first course</p><a routerLink="/courses/new" class="btn btn-primary">Add Course</a></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <app-confirm-dialog [isOpen]="showDel" title="Delete Course" [message]="'Delete ' + selected?.name + '?'" (confirmed)="del()" (cancelled)="showDel = false"></app-confirm-dialog>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 1440px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4); h1 { margin-bottom: var(--space-1); } p { color: var(--text-secondary); } }
    .card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: var(--space-4); }
    .search { display: flex; align-items: center; gap: var(--space-3); background: var(--bg-base); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: var(--space-2) var(--space-4); min-width: 300px; svg { width: 18px; height: 18px; color: var(--text-muted); } input { border: none; background: none; color: var(--text-primary); font-size: 0.9375rem; width: 100%; &::placeholder { color: var(--text-muted); } &:focus { outline: none; } } }
    .count { font-size: 0.875rem; color: var(--text-secondary); }
    .table-wrap { overflow-x: auto; }
    .course { display: flex; align-items: center; gap: var(--space-3); }
    .icon { width: 40px; height: 40px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #2dd4bf, #14b8a6); display: flex; align-items: center; justify-content: center; svg { width: 20px; height: 20px; color: white; } }
    .name { display: block; font-weight: 500; }
    .id { font-size: 0.75rem; color: var(--text-muted); }
    .code { display: inline-block; padding: var(--space-1) var(--space-3); background: rgba(45, 212, 191, 0.1); color: var(--accent-400); border-radius: var(--radius-md); font-size: 0.8125rem; font-weight: 600; font-family: monospace; }
    .credits { display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; background: rgba(34, 197, 94, 0.1); color: var(--success-500); border-radius: var(--radius-full); font-size: 0.8125rem; font-weight: 600; }
    .desc { max-width: 200px; color: var(--text-secondary); font-size: 0.875rem; }
    .actions { display: flex; gap: var(--space-1); }
    .empty { padding: var(--space-16) var(--space-8); text-align: center; svg { width: 64px; height: 64px; color: var(--text-muted); margin-bottom: var(--space-4); } h3 { margin-bottom: var(--space-2); } p { color: var(--text-secondary); margin-bottom: var(--space-6); } }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .search { min-width: 100%; } }
  `]
})
export class CourseListComponent implements OnInit {
  private svc = inject(CourseService);
  items: Course[] = [];
  filtered: Course[] = [];
  loading = true;
  showDel = false;
  selected: Course | null = null;
  search = '';

  ngOnInit(): void { this.load(); }
  load(): void { this.svc.getAll().subscribe({ next: d => { this.items = d; this.filtered = d; this.loading = false; }, error: () => this.loading = false }); }
  filter(): void { const t = this.search.toLowerCase(); this.filtered = this.items.filter(i => i.name.toLowerCase().includes(t) || i.code.toLowerCase().includes(t)); }
  confirmDel(c: Course): void { this.selected = c; this.showDel = true; }
  del(): void { if (this.selected?.idCourse) { this.svc.delete(this.selected.idCourse).subscribe({ next: () => { this.items = this.items.filter(i => i.idCourse !== this.selected?.idCourse); this.filter(); this.showDel = false; }, error: () => this.showDel = false }); } }
}
