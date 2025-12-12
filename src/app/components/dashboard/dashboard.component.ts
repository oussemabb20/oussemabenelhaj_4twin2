import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { StudentService, DepartmentService, CourseService, EnrollmentService } from '../../services';
import { LoadingSpinnerComponent } from '../../shared';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  template: `
    <div class="page animate-fade-in">
      <header class="page-header">
        <div>
          <p class="greeting">Welcome back 👋</p>
          <h1>Dashboard</h1>
        </div>
        <a routerLink="/students/new" class="btn btn-primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><path d="M12 5v14m-7-7h14"/></svg>
          New Student
        </a>
      </header>

      <app-loading-spinner *ngIf="loading"></app-loading-spinner>

      <ng-container *ngIf="!loading">
        <section class="metrics">
          <article class="metric-card" *ngFor="let m of metrics" [style.--accent]="m.color">
            <div class="metric-icon"><div [innerHTML]="m.icon"></div></div>
            <div class="metric-body">
              <span class="metric-value">{{ m.value }}</span>
              <span class="metric-label">{{ m.label }}</span>
            </div>
            <a [routerLink]="m.link" class="metric-link">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
            </a>
          </article>
        </section>

        <section class="grid-2">
          <article class="card chart-card">
            <header class="card-header">
              <h3>Enrollment Overview</h3>
              <span class="badge">{{ stats.enrollments }} total</span>
            </header>
            <div class="chart-body">
              <div class="ring-chart">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="var(--slate-800)" stroke-width="12"/>
                  <circle *ngFor="let seg of segments" cx="60" cy="60" r="52" fill="none" [attr.stroke]="seg.color" stroke-width="12" 
                    [attr.stroke-dasharray]="seg.dash" [attr.stroke-dashoffset]="seg.offset" stroke-linecap="round" style="transition: all 0.6s ease"/>
                </svg>
                <div class="ring-center">
                  <span class="ring-value">{{ stats.enrollments }}</span>
                  <span class="ring-label">Total</span>
                </div>
              </div>
              <ul class="legend">
                <li *ngFor="let s of statusData">
                  <span class="legend-dot" [style.background]="s.color"></span>
                  <span class="legend-name">{{ s.name }}</span>
                  <span class="legend-count">{{ s.count }}</span>
                </li>
              </ul>
            </div>
          </article>

          <article class="card actions-card">
            <header class="card-header"><h3>Quick Actions</h3></header>
            <div class="actions-grid">
              <a routerLink="/students/new" class="action-btn">
                <div class="action-icon" style="--bg: linear-gradient(135deg, #818cf8, #6366f1)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 14v3m-1.5-1.5h3"/></svg>
                </div>
                <span>Add Student</span>
              </a>
              <a routerLink="/courses/new" class="action-btn">
                <div class="action-icon" style="--bg: linear-gradient(135deg, #2dd4bf, #14b8a6)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg>
                </div>
                <span>Add Course</span>
              </a>
              <a routerLink="/departments/new" class="action-btn">
                <div class="action-icon" style="--bg: linear-gradient(135deg, #fbbf24, #f59e0b)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>
                </div>
                <span>Add Department</span>
              </a>
              <a routerLink="/enrollments/new" class="action-btn">
                <div class="action-icon" style="--bg: linear-gradient(135deg, #f472b6, #ec4899)">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/></svg>
                </div>
                <span>Add Enrollment</span>
              </a>
            </div>
          </article>
        </section>
      </ng-container>
    </div>
  `,
  styles: [`
    .page { padding: var(--space-8); max-width: 1440px; margin: 0 auto; }
    .page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-8); flex-wrap: wrap; gap: var(--space-4); }
    .greeting { color: var(--text-secondary); font-size: 0.9375rem; margin-bottom: var(--space-1); }

    .metrics { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-6); margin-bottom: var(--space-8); }

    .metric-card {
      position: relative;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xl);
      padding: var(--space-6);
      display: flex;
      align-items: center;
      gap: var(--space-4);
      transition: all var(--transition-base);
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 3px;
        background: var(--accent);
      }

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 12px 24px -8px rgba(0,0,0,0.3);
        border-color: var(--slate-600);
      }
    }

    .metric-icon {
      width: 52px;
      height: 52px;
      background: var(--accent);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      ::ng-deep svg { width: 26px; height: 26px; color: white; }
    }

    .metric-body { flex: 1; }
    .metric-value { display: block; font-size: 1.75rem; font-weight: 700; line-height: 1.2; }
    .metric-label { font-size: 0.875rem; color: var(--text-secondary); }

    .metric-link {
      position: absolute;
      top: var(--space-4);
      right: var(--space-4);
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--text-muted);
      border-radius: var(--radius-md);
      transition: all var(--transition-fast);
      svg { width: 18px; height: 18px; }
      &:hover { background: var(--bg-elevated); color: var(--primary-400); }
    }

    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-6); }

    .card { background: var(--bg-surface); border: 1px solid var(--border-subtle); border-radius: var(--radius-xl); }
    .card-header { display: flex; justify-content: space-between; align-items: center; padding: var(--space-5) var(--space-6); border-bottom: 1px solid var(--border-subtle); }
    .card-header h3 { font-size: 1rem; }
    .badge { background: var(--bg-elevated); padding: var(--space-1) var(--space-3); border-radius: var(--radius-full); font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); }

    .chart-body { padding: var(--space-6); display: flex; align-items: center; gap: var(--space-8); }

    .ring-chart { position: relative; width: 140px; height: 140px; flex-shrink: 0; }
    .ring-chart svg { width: 100%; height: 100%; transform: rotate(-90deg); }
    .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .ring-value { font-size: 1.5rem; font-weight: 700; }
    .ring-label { font-size: 0.6875rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; }

    .legend { list-style: none; flex: 1; display: flex; flex-direction: column; gap: var(--space-3); }
    .legend li { display: flex; align-items: center; gap: var(--space-3); }
    .legend-dot { width: 8px; height: 8px; border-radius: 50%; }
    .legend-name { flex: 1; font-size: 0.875rem; color: var(--text-secondary); }
    .legend-count { font-weight: 600; font-size: 0.875rem; }

    .actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4); padding: var(--space-6); }

    .action-btn {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--space-3);
      padding: var(--space-6) var(--space-4);
      background: var(--bg-base);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-lg);
      transition: all var(--transition-base);
      text-align: center;

      &:hover {
        border-color: var(--primary-500);
        transform: translateY(-2px);
        box-shadow: 0 8px 16px -4px rgba(0,0,0,0.2);
      }

      span { font-size: 0.875rem; font-weight: 500; color: var(--text-primary); }
    }

    .action-icon {
      width: 48px;
      height: 48px;
      background: var(--bg);
      border-radius: var(--radius-lg);
      display: flex;
      align-items: center;
      justify-content: center;
      svg { width: 24px; height: 24px; color: white; }
    }

    @media (max-width: 1200px) { .metrics { grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 768px) {
      .page { padding: var(--space-4); }
      .metrics { grid-template-columns: 1fr; }
      .grid-2 { grid-template-columns: 1fr; }
      .chart-body { flex-direction: column; }
      .actions-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  private studentService = inject(StudentService);
  private departmentService = inject(DepartmentService);
  private courseService = inject(CourseService);
  private enrollmentService = inject(EnrollmentService);

  loading = true;
  stats = { students: 0, departments: 0, courses: 0, enrollments: 0 };
  metrics: any[] = [];
  statusData: any[] = [];
  segments: any[] = [];

  ngOnInit(): void { this.load(); }

  load(): void {
    forkJoin({
      students: this.studentService.getAll(),
      departments: this.departmentService.getAll(),
      courses: this.courseService.getAll(),
      enrollments: this.enrollmentService.getAll()
    }).subscribe({
      next: (d) => {
        this.stats = { students: d.students.length, departments: d.departments.length, courses: d.courses.length, enrollments: d.enrollments.length };
        this.buildMetrics();
        this.buildChart(d.enrollments);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  buildMetrics(): void {
    this.metrics = [
      { value: this.stats.students, label: 'Students', color: 'linear-gradient(135deg, #818cf8, #6366f1)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><circle cx="17" cy="11" r="3"/><path d="M21 21v-1.5a3 3 0 0 0-3-3h-1"/></svg>', link: '/students' },
      { value: this.stats.departments, label: 'Departments', color: 'linear-gradient(135deg, #fbbf24, #f59e0b)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6"/></svg>', link: '/departments' },
      { value: this.stats.courses, label: 'Courses', color: 'linear-gradient(135deg, #2dd4bf, #14b8a6)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/></svg>', link: '/courses' },
      { value: this.stats.enrollments, label: 'Enrollments', color: 'linear-gradient(135deg, #f472b6, #ec4899)', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/></svg>', link: '/enrollments' }
    ];
  }

  buildChart(enrollments: any[]): void {
    const colors: Record<string, string> = { ACTIVE: '#4ade80', COMPLETED: '#38bdf8', DROPPED: '#fbbf24', FAILED: '#f87171', WITHDRAWN: '#94a3b8' };
    const counts: Record<string, number> = { ACTIVE: 0, COMPLETED: 0, DROPPED: 0, FAILED: 0, WITHDRAWN: 0 };
    enrollments.forEach(e => { if (counts[e.status] !== undefined) counts[e.status]++; });
    const total = enrollments.length || 1;
    const circ = 2 * Math.PI * 52;
    let offset = 0;

    this.statusData = Object.entries(counts).map(([k, v]) => ({ name: k.charAt(0) + k.slice(1).toLowerCase(), count: v, color: colors[k] }));
    this.segments = this.statusData.map(s => {
      const len = (s.count / total) * circ;
      const seg = { color: s.color, dash: `${len} ${circ}`, offset: -offset };
      offset += len;
      return seg;
    });
  }
}
