import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DepartmentService } from '../../../services';
import { Department } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared';

@Component({
  selector: 'app-department-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page animate-fade-in">
      <a routerLink="/departments" class="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 12H5m7 7-7-7 7-7"/></svg>Back to Departments</a>
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <article class="detail-card" *ngIf="!loading && item">
        <header class="card-header">
          <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg></div>
          <div class="info"><h1>{{ item.name }}</h1><span class="id">Department ID: {{ item.idDepartment }}</span></div>
          <a [routerLink]="['/departments', item.idDepartment, 'edit']" class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</a>
        </header>
        <section class="card-body">
          <h3>Department Information</h3>
          <div class="info-grid">
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><div><label>Location</label><span>{{ item.location }}</span></div></div>
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg><div><label>Phone</label><span>{{ item.phone }}</span></div></div>
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2"/></svg><div><label>Department Head</label><span>{{ item.head }}</span></div></div>
          </div>
        </section>
      </article>
    </div>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 900px; margin: 0 auto; }
    .back { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4); &:hover { color: var(--primary-400); } }
    .detail-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .card-header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: var(--space-8); display: flex; align-items: center; gap: var(--space-5); flex-wrap: wrap; }
    .icon { width: 72px; height: 72px; border-radius: var(--radius-xl); background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; svg { width: 36px; height: 36px; color: white; } }
    .info { flex: 1; color: white; h1 { margin: 0 0 var(--space-1); font-size: 1.5rem; } .id { opacity: 0.8; font-size: 0.875rem; } }
    .card-header .btn { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); &:hover { background: rgba(255,255,255,0.25); } }
    .card-body { padding: var(--space-8); h3 { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-5); } }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
    .info-item { display: flex; gap: var(--space-4); svg { width: 20px; height: 20px; color: var(--warning-500); flex-shrink: 0; margin-top: 2px; } label { display: block; font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-1); } span { font-size: 0.9375rem; } }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .card-header { flex-direction: column; text-align: center; } .info-grid { grid-template-columns: 1fr; } }
  `]
})
export class DepartmentDetailComponent implements OnInit {
  private readonly svc = inject(DepartmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  item: Department | null = null;
  loading = true;

  ngOnInit(): void { const id = this.route.snapshot.params['id']; if (id) { this.svc.getById(+id).subscribe({ next: d => { this.item = d; this.loading = false; }, error: () => { void this.router.navigate(['/departments']); } }); } }
}
