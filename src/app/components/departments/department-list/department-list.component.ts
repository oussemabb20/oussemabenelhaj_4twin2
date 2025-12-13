import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DepartmentService } from '../../../services';
import { Department } from '../../../models';
import { LoadingSpinnerComponent, ConfirmDialogComponent } from '../../../shared';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, LoadingSpinnerComponent, ConfirmDialogComponent],
  template: `
    <div class="page animate-fade-in">
      <header class="page-header">
        <div><h1>Departments</h1><p>Manage academic departments</p></div>
        <a routerLink="/departments/new" class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 5v14m-7-7h14"/></svg>Add Department</a>
      </header>
      <div class="card">
        <div class="toolbar">
          <div class="search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg><input type="text" placeholder="Search departments..." [(ngModel)]="search" (input)="filter()"></div>
          <span class="count">{{ filtered.length }} departments</span>
        </div>
        <app-loading-spinner *ngIf="loading"></app-loading-spinner>
        <div class="table-wrap" *ngIf="!loading">
          <table class="table">
            <thead><tr><th>Department</th><th>Location</th><th>Phone</th><th>Head</th><th></th></tr></thead>
            <tbody>
              <tr *ngFor="let d of filtered">
                <td><div class="dept"><div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14"/></svg></div><div><span class="name">{{ d.name }}</span><span class="id">#{{ d.idDepartment }}</span></div></div></td>
                <td>{{ d.location }}</td>
                <td>{{ d.phone }}</td>
                <td>{{ d.head }}</td>
                <td><div class="actions"><a [routerLink]="['/departments', d.idDepartment]" class="btn btn-ghost btn-icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg></a><a [routerLink]="['/departments', d.idDepartment, 'edit']" class="btn btn-ghost btn-icon-sm"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></a><button class="btn btn-ghost btn-icon-sm" (click)="confirmDel(d)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg></button></div></td>
              </tr>
              <tr *ngIf="filtered.length === 0"><td colspan="5"><div class="empty"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1"><path d="M3 21h18M5 21V7l7-4 7 4v14"/></svg><h3>No departments found</h3><p>Add your first department</p><a routerLink="/departments/new" class="btn btn-primary">Add Department</a></div></td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <app-confirm-dialog [isOpen]="showDel" title="Delete Department" [message]="'Delete ' + selected?.name + '?'" (confirmed)="del()" (cancelled)="showDel = false"></app-confirm-dialog>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 1440px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-6); flex-wrap: wrap; gap: var(--space-4); h1 { margin-bottom: var(--space-1); } p { color: var(--text-secondary); } }
    .card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .toolbar { display: flex; justify-content: space-between; align-items: center; padding: var(--space-4) var(--space-6); border-bottom: 1px solid var(--border-subtle); flex-wrap: wrap; gap: var(--space-4); }
    .search { display: flex; align-items: center; gap: var(--space-3); background: var(--bg-base); border: 1px solid var(--border-default); border-radius: var(--radius-lg); padding: var(--space-2) var(--space-4); min-width: 300px; svg { width: 18px; height: 18px; color: var(--text-muted); } input { border: none; background: none; color: var(--text-primary); font-size: 0.9375rem; width: 100%; &::placeholder { color: var(--text-muted); } &:focus { outline: none; } } }
    .count { font-size: 0.875rem; color: var(--text-secondary); }
    .table-wrap { overflow-x: auto; }
    .dept { display: flex; align-items: center; gap: var(--space-3); }
    .icon { width: 40px; height: 40px; border-radius: var(--radius-lg); background: linear-gradient(135deg, #fbbf24, #f59e0b); display: flex; align-items: center; justify-content: center; svg { width: 20px; height: 20px; color: white; } }
    .name { display: block; font-weight: 500; }
    .id { font-size: 0.75rem; color: var(--text-muted); }
    .actions { display: flex; gap: var(--space-1); }
    .empty { padding: var(--space-16) var(--space-8); text-align: center; svg { width: 64px; height: 64px; color: var(--text-muted); margin-bottom: var(--space-4); } h3 { margin-bottom: var(--space-2); } p { color: var(--text-secondary); margin-bottom: var(--space-6); } }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .search { min-width: 100%; } }
  `]
})
export class DepartmentListComponent implements OnInit {
  private readonly svc = inject(DepartmentService);
  items: Department[] = [];
  filtered: Department[] = [];
  loading = true;
  showDel = false;
  selected: Department | null = null;
  search = '';

  ngOnInit(): void { this.load(); }
  load(): void { this.svc.getAll().subscribe({ next: d => { this.items = d; this.filtered = d; this.loading = false; }, error: () => this.loading = false }); }
  filter(): void { const t = this.search.toLowerCase(); this.filtered = this.items.filter(i => i.name.toLowerCase().includes(t) || i.location.toLowerCase().includes(t)); }
  confirmDel(d: Department): void { this.selected = d; this.showDel = true; }
  del(): void { if (this.selected?.idDepartment) { this.svc.delete(this.selected.idDepartment).subscribe({ next: () => { this.items = this.items.filter(i => i.idDepartment !== this.selected?.idDepartment); this.filter(); this.showDel = false; }, error: () => this.showDel = false }); } }
}
