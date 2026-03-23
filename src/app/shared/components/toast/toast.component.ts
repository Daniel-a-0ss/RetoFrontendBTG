import { Component, inject } from '@angular/core';
import { ToastService, Toast } from '../../services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    <div
      class="fixed top-4 right-4 z-50 flex flex-col gap-3 w-80 max-w-[calc(100vw-2rem)] pointer-events-none"
      aria-live="polite"
      aria-atomic="false"
      aria-relevant="additions text"
    >
      @for (toast of toastSvc.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm transition-all animate-slide-in"
          [class]="toastClass(toast)"
          [attr.role]="toastRole(toast)"
        >
          <span class="text-lg leading-none mt-0.5" aria-hidden="true">{{ toastIcon(toast) }}</span>
          <p class="flex-1 text-sm font-medium leading-snug">{{ toast.message }}</p>
          <button
            (click)="toastSvc.dismiss(toast.id)"
            class="shrink-0 opacity-60 hover:opacity-100 transition-opacity text-xs leading-none mt-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent rounded-sm"
            aria-label="Cerrar"
          >✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slide-in {
      from { transform: translateX(110%); opacity: 0; }
      to   { transform: translateX(0);   opacity: 1; }
    }
    .animate-slide-in { animation: slide-in 250ms ease-out both; }
  `],
})
export class ToastComponent {
  readonly toastSvc = inject(ToastService);

  toastClass(toast: Toast): string {
    const base = 'border ';
    const map: Record<string, string> = {
      success: base + 'bg-success-50 border-success-200 text-success-800',
      error:   base + 'bg-red-50 border-red-200 text-red-800',
      warning: base + 'bg-amber-50 border-amber-200 text-amber-800',
      info:    base + 'bg-primary-50 border-primary-200 text-primary-800',
    };
    return map[toast.type] ?? map['info'];
  }

  toastIcon(toast: Toast): string {
    const map: Record<string, string> = {
      success: '✔',
      error:   '✖',
      warning: '⚠',
      info:    'ℹ',
    };
    return map[toast.type] ?? 'ℹ';
  }

  toastRole(toast: Toast): 'alert' | 'status' {
    return toast.type === 'error' || toast.type === 'warning' ? 'alert' : 'status';
  }
}
