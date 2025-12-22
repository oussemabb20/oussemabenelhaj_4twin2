import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { StudentService } from '../../../services';
import { Student } from '../../../models';
import { LoadingSpinnerComponent } from '../../../shared';

@Component({
  selector: 'app-student-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page animate-fade-in">
      <a routerLink="/students" class="back"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="20" height="20"><path d="M19 12H5m7 7-7-7 7-7"/></svg>Back to Students</a>
      <app-loading-spinner *ngIf="loading"></app-loading-spinner>
      <article class="detail-card" *ngIf="!loading && item">
        <header class="card-header">
          <div class="avatar">{{ initials() }}</div>
          <div class="info"><h1>{{ item.firstname }} {{ item.lastname }}</h1><span class="id">Student ID: {{ item.idStudent }}</span></div>
          <a [routerLink]="['/students', item.idStudent, 'edit']" class="btn btn-primary"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</a>
        </header>
        <section class="card-body">
          <h3>Contact Information</h3>
          <div class="info-grid">
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 8l7.89 5.26a2 2 0 0 0 2.22 0L21 8M5 19h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2z"/></svg><div><label>Email</label><span>{{ item.email }}</span></div></div>
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg><div><label>Phone</label><span>{{ item.phone }}</span></div></div>
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg><div><label>Date of Birth</label><span>{{ item.dateOfBirth }}</span></div></div>
            <div class="info-item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14"/></svg><div><label>Department</label><span>{{ item.department?.name || 'Not assigned' }}</span></div></div>
            <div class="info-item full"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg><div><label>Address</label><span>{{ item.address }}</span></div></div>
          </div>
        </section>
      </article>
    </div>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 900px; margin: 0 auto; }
    .back { display: inline-flex; align-items: center; gap: var(--space-2); color: var(--text-secondary); font-size: 0.875rem; margin-bottom: var(--space-4); &:hover { color: var(--primary-400); } }
    .detail-card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); overflow: hidden; }
    .card-header { background: linear-gradient(135deg, var(--primary-600) 0%, var(--primary-700) 100%); padding: var(--space-8); display: flex; align-items: center; gap: var(--space-5); flex-wrap: wrap; }
    .avatar { width: 72px; height: 72px; border-radius: var(--radius-full); background: rgba(255,255,255,0.15); color: white; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 700; flex-shrink: 0; }
    .info { flex: 1; color: white; h1 { margin: 0 0 var(--space-1); font-size: 1.5rem; } .id { opacity: 0.8; font-size: 0.875rem; } }
    .card-header .btn { background: rgba(255,255,255,0.15); border: 1px solid rgba(255,255,255,0.2); &:hover { background: rgba(255,255,255,0.25); } }
    .card-body { padding: var(--space-8); h3 { font-size: 0.875rem; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-5); } }
    .info-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-6); }
    .info-item { display: flex; gap: var(--space-4); &.full { grid-column: 1 / -1; } svg { width: 20px; height: 20px; color: var(--primary-400); flex-shrink: 0; margin-top: 2px; } label { display: block; font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: var(--space-1); } span { font-size: 0.9375rem; } }
    @media (max-width: 768px) { .page { padding: var(--space-4); } .card-header { flex-direction: column; text-align: center; } .info-grid { grid-template-columns: 1fr; } }
  `]
})
export class StudentDetailComponent implements OnInit {
  private readonly svc = inject(StudentService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  item: Student | null = null;
  loading = true;

  ngOnInit(): void { const id = this.route.snapshot.params['id']; if (id) { this.svc.getById(+id).subscribe({ next: d => { this.item = d; this.loading = false; }, error: () => { void this.router.navigate(['/students']); } }); } }
  initials(): string { return this.item ? ((this.item.firstname?.[0] || '') + (this.item.lastname?.[0] || '')).toUpperCase() : ''; }
}
