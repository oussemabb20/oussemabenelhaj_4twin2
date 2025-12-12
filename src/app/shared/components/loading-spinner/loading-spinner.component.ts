import { Component } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="loader-container">
      <div class="loader">
        <svg viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="20" fill="none" stroke-width="4" stroke="var(--slate-700)"/>
          <circle cx="25" cy="25" r="20" fill="none" stroke-width="4" stroke="url(#gradient)" stroke-linecap="round" stroke-dasharray="80 200">
            <animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="1s" repeatCount="indefinite"/>
          </circle>
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="var(--primary-400)"/>
              <stop offset="100%" stop-color="var(--accent-400)"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  `,
  styles: [`
    .loader-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--space-16);
    }
    .loader svg {
      width: 48px;
      height: 48px;
    }
  `]
})
export class LoadingSpinnerComponent {}
