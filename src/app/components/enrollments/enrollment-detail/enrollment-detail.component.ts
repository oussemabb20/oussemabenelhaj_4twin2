import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EnrollmentService } from '../../../services';
import { Enrollment } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared';

@Component({
  selector: 'app-enrollment-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page animate-fade-in">
      <a routerLink="/enrollments" class="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 12H5m7 7-7-7 7-7"/></svg>Back to Enrollments</a>
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <article class="detail-card" *ngIf="!loading && item">
        <header class="card-header">
          <div class="icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/></svg></div>
          <div class="info"><h1>Enrollment #{{ item.idEnrollment }}</h1><span class="status-badge" [class]="item.status.toLowerCase()">{{ item.status }}</span></div>
          <a [routerLink]="['/enrollments', item.idEnrollment, 'edit']" class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</a>
        </header>
        <section class="card-body">
          <h3>Enrollment Information</h3>
          <div class="info-grid">
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="8" r="5"/><path d="M3 21v-2a7 7 0 0 1 7-7h4a7 7 0 0 1 7 7v2"/></svg><div><label>Student</label><span>{{ item.student?.firstname }} {{ item.student?.lastname }}</span></div></div>
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg><div><label>Course</label><span>{{ item.course?.name }}</span></div></div>
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><div><label>Enrollment Date</label><span>{{ item.enrollmentDate }}</span></div></div>
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4 12 14.01l-3-3"/></svg><div><label>Grade</label><span class="grade" [class.na]="item.grade === null">{{ item.grade ?? 'Not graded' }}</span></div></div>
          </div>
        </section>
      </article>
    </div>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 900px; margin: 0 auto; }
    .back { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4); &:hover { color: var(--primary-400); } }
    .detail-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .card-header { background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); padding: var(--space-8); display: flex; align-items: center; gap: var(--space-5); flex-wrap: wrap; }
    .icon { width: 72px; height: 72px; border-radius: var(--radius-xl); background: rgba(255,255,255,0.15); display: flex; align-items: center; justify-content: center; svg { width: 36px; height: 36px; color: white; } }
    .info { flex: 1; color: white; h1 { margin: 0 0 var(--space-2); font-size: 1.5rem; } }
    .card-header .status-badge { background: rgba(255,255,255,0.2); color: white; &::before { background: white; } }
    .card-header .btn { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); &:hover { background: rgba(255,255,255,0.25); } }
    .card-body { padding: var(--space-8); h3 { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-5); } }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
    .info-item { display: flex; gap: var(--space-4); svg { width: 20px; height: 20px; color: #f472b6; flex-shrink: 0; margin-top: 2px; } label { display: block; font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-1); } span { font-size: 0.9375rem; } }
    .grade { font-weight: 600; &.na { color: var(--text-muted); font-weight: 400; } }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .card-header { flex-direction: column; text-align: center; } .info-grid { grid-template-columns: 1fr; } }
  `]
})
export class EnrollmentDetailComponent implements OnInit {
  private readonly svc = inject(EnrollmentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  item: Enrollment | null = null;
  loading = true;

  ngOnInit(): void { const id = this.route.snapshot.params['id']; if (id) { this.svc.getById(+id).subscribe({ next: d => { this.item = d; this.loading = false; }, error: () => { void this.router.navigate(['/enrollments']); } }); } }
}
