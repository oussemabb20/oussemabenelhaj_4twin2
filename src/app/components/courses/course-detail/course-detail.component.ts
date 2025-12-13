import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseService } from '../../../services';
import { Course } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page animate-fade-in">
      <a routerLink="/courses" class="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 12H5m7 7-7-7 7-7"/></svg>Back to Courses</a>
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <article class="detail-card" *ngIf="!loading && item">
        <header class="card-header">
          <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg></div>
          <div class="info"><h1>{{ item.name }}</h1><span class="id">Course ID: {{ item.idCourse }}</span></div>
          <a [routerLink]="['/courses', item.idCourse, 'edit']" class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</a>
        </header>
        <section class="card-body">
          <h3>Course Information</h3>
          <div class="info-grid">
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/></svg><div><label>Code</label><span class="code">{{ item.code }}</span></div></div>
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg><div><label>Credits</label><span class="credits">{{ item.credit }} credits</span></div></div>
            <div class="info-item full"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 6h16M4 12h16M4 18h12"/></svg><div><label>Description</label><span>{{ item.description }}</span></div></div>
          </div>
        </section>
      </article>
    </div>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 900px; margin: 0 auto; }
    .back { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4); &:hover { color: var(--primary-400); } }
    .detail-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .card-header { background: linear-gradient(135deg, #14b8a6 0%, #0d9488 100%); padding: var(--space-8); display: flex; align-items: center; gap: var(--space-5); flex-wrap: wrap; }
    .icon { width: 72px; height: 72px; border-radius: var(--radius-xl); background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; svg { width: 36px; height: 36px; color: white; } }
    .info { flex: 1; color: white; h1 { margin: 0 0 var(--space-1); font-size: 1.5rem; } .id { opacity: 0.8; font-size: 0.875rem; } }
    .card-header .btn { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); &:hover { background: rgba(255,255,255,0.25); } }
    .card-body { padding: var(--space-8); h3 { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-5); } }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
    .info-item { display: flex; gap: var(--space-4); &.full { grid-column: 1 / -1; } svg { width: 20px; height: 20px; color: var(--accent-500); flex-shrink: 0; margin-top: 2px; } label { display: block; font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-1); } span { font-size: 0.9375rem; } }
    .code { display: inline-block; padding: var(--space-1) var(--space-3); background: rgba(45, 212, 191, 0.1); color: var(--accent-400); border-radius: var(--radius-md); font-weight: 600; font-family: monospace; }
    .credits { display: inline-block; padding: var(--space-1) var(--space-3); background: rgba(34, 197, 94, 0.1); color: var(--success-500); border-radius: var(--radius-full); font-weight: 500; }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .card-header { flex-direction: column; text-align: center; } .info-grid { grid-template-columns: 1fr; } }
  `]
})
export class CourseDetailComponent implements OnInit {
  private readonly svc = inject(CourseService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  item: Course | null = null;
  loading = true;

  ngOnInit(): void { const id = this.route.snapshot.params['id']; if (id) { this.svc.getById(+id).subscribe({ next: d => { this.item = d; this.loading = false; }, error: () => { void this.router.navigate(['/courses']); } }); } }
}
