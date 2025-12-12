import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="logo">
          <div class="logo-mark">
            <svg viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#logo-gradient)"/>
              <path d="M8 22V10l8-4 8 4v12l-8 4-8-4z" stroke="white" stroke-width="1.5" fill="none"/>
              <path d="M8 10l8 4 8-4M16 14v12" stroke="white" stroke-width="1.5"/>
              <defs>
                <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
                  <stop stop-color="#818cf8"/>
                  <stop offset="1" stop-color="#6366f1"/>
                </linearGradient>
              </defs>
            </svg>
          </div>
          <span class="logo-text">EduFlow</span>
        </a>

        <button class="mobile-toggle" (click)="isOpen = !isOpen" [class.active]="isOpen">
          <span></span><span></span><span></span>
        </button>

        <div class="nav-menu" [class.open]="isOpen">
          <a routerLink="/dashboard" routerLinkActive="active" class="nav-link" (click)="isOpen = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <rect x="3" y="3" width="7" height="9" rx="1"/>
              <rect x="14" y="3" width="7" height="5" rx="1"/>
              <rect x="14" y="12" width="7" height="9" rx="1"/>
              <rect x="3" y="16" width="7" height="5" rx="1"/>
            </svg>
            <span>Dashboard</span>
          </a>
          <a routerLink="/students" routerLinkActive="active" class="nav-link" (click)="isOpen = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="9" cy="7" r="4"/>
              <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
              <circle cx="17" cy="11" r="3"/>
              <path d="M21 21v-1.5a3 3 0 0 0-3-3h-1"/>
            </svg>
            <span>Students</span>
          </a>
          <a routerLink="/departments" routerLinkActive="active" class="nav-link" (click)="isOpen = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6M9 9h.01M15 9h.01M9 13h.01M15 13h.01"/>
            </svg>
            <span>Departments</span>
          </a>
          <a routerLink="/courses" routerLinkActive="active" class="nav-link" (click)="isOpen = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25"/>
            </svg>
            <span>Courses</span>
          </a>
          <a routerLink="/enrollments" routerLinkActive="active" class="nav-link" (click)="isOpen = false">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5.586a1 1 0 0 1 .707.293l5.414 5.414a1 1 0 0 1 .293.707V19a2 2 0 0 1-2 2z"/>
              <path d="M13 3v5a1 1 0 0 0 1 1h5"/>
            </svg>
            <span>Enrollments</span>
          </a>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      position: sticky;
      top: 0;
      z-index: 100;
      background: rgba(15, 23, 42, 0.8);
      backdrop-filter: blur(16px) saturate(180%);
      border-bottom: 1px solid var(--border-subtle);
    }

    .nav-container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 var(--space-8);
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .logo {
      display: flex;
      align-items: center;
      gap: var(--space-3);
      color: var(--text-primary);
      font-weight: 700;
      font-size: 1.25rem;
      letter-spacing: -0.02em;
    }

    .logo-mark svg {
      width: 36px;
      height: 36px;
      display: block;
    }

    .mobile-toggle {
      display: none;
      flex-direction: column;
      justify-content: center;
      gap: 5px;
      width: 40px;
      height: 40px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;

      span {
        display: block;
        width: 100%;
        height: 2px;
        background: var(--text-primary);
        border-radius: 2px;
        transition: all var(--transition-base);
      }

      &.active span:nth-child(1) { transform: rotate(45deg) translate(5px, 5px); }
      &.active span:nth-child(2) { opacity: 0; }
      &.active span:nth-child(3) { transform: rotate(-45deg) translate(5px, -5px); }
    }

    .nav-menu {
      display: flex;
      align-items: center;
      gap: var(--space-1);
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--space-2);
      padding: var(--space-2) var(--space-4);
      color: var(--text-secondary);
      font-size: 0.9375rem;
      font-weight: 500;
      border-radius: var(--radius-lg);
      transition: all var(--transition-fast);

      svg {
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      &:hover {
        color: var(--text-primary);
        background: var(--bg-elevated);
      }

      &.active {
        color: var(--primary-400);
        background: rgba(99, 102, 241, 0.1);
      }
    }

    @media (max-width: 1024px) {
      .nav-container { padding: 0 var(--space-6); }
      .nav-link span { display: none; }
      .nav-link { padding: var(--space-3); }
    }

    @media (max-width: 768px) {
      .nav-container { padding: 0 var(--space-4); }
      .mobile-toggle { display: flex; }
      
      .nav-menu {
        position: fixed;
        top: 72px;
        left: 0;
        right: 0;
        bottom: 0;
        flex-direction: column;
        align-items: stretch;
        gap: var(--space-2);
        padding: var(--space-4);
        background: var(--bg-surface);
        border-top: 1px solid var(--border-subtle);
        transform: translateX(-100%);
        opacity: 0;
        transition: all var(--transition-base);

        &.open {
          transform: translateX(0);
          opacity: 1;
        }
      }

      .nav-link {
        padding: var(--space-4);
        span { display: inline; }
      }
    }
  `]
})
export class NavbarComponent {
  isOpen = false;
}
