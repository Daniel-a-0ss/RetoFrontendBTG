import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastComponent } from './shared/components/toast/toast.component';
import { CopCurrencyPipe } from './core/pipes/cop-currency.pipe';
import { FundService } from './core/services/fund.service';

interface NavItem {
  label: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ToastComponent, CopCurrencyPipe],
  template: `
    <div class="min-h-screen bg-gradient-primary text-secondary-900 font-sans flex flex-col">

      <!-- Top nav -->
      <header class="sticky top-0 z-30 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200/60 shadow-sm backdrop-blur-lg">
        <div class="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <!-- Brand -->
          <div class="flex items-center gap-3 shrink-0">
            <div class="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-sm">
              <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div class="flex flex-col">
              <span class="font-bold text-base tracking-tight text-slate-800">BTG</span>
              <span class="text-xs font-medium text-primary-600 -mt-0.5">Pactual</span>
            </div>
          </div>

          <!-- Nav links -->
          <nav class="flex items-center gap-3">
            @for (item of navItems; track item.path) {
              <a
                [routerLink]="item.path"
                routerLinkActive="nav-link-active"
                class="nav-link group"
              >
                <span class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-slate-500 transition-colors group-hover:text-primary-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path [attr.d]="item.icon" />
                  </svg>
                  <span class="text-sm font-semibold text-slate-700 transition-colors group-hover:text-primary-700">{{ item.label }}</span>
                </span>
              </a>
            }
          </nav>

          <!-- Balance badge -->
          <div class="shrink-0 bg-[#E6F4EA] rounded-full px-4 py-2 border border-success-200 text-[#1B5E20] font-semibold text-sm flex items-center gap-2">
            <span class="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#C8E6C9] text-[#1B5E20]">
              <svg class="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 1v22" />
                <path d="M17 5H9a5 5 0 000 10h6a5 5 0 010 10H7" />
              </svg>
            </span>
            {{ fundSvc.balance() | copCurrency }}
          </div>
        </div>
      </header>

      <!-- Main content -->
      <main class="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <router-outlet />
      </main>

      <!-- Footer -->
      <footer class="border-t border-surface-border py-4 text-center text-xs text-secondary-500 bg-white/50">
        BTG Pactual &copy; {{ currentYear }} — Plataforma de gestión de fondos FPV/FIC
      </footer>
    </div>

    <!-- Global toast outlet -->
    <app-toast />
  `,
})
export class AppComponent {
  readonly fundSvc = inject(FundService);
  readonly currentYear = new Date().getFullYear();

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      path: '/dashboard',
      icon: 'M3 13h8v8H3z M13 3h8v8h-8z',
    },
    {
      label: 'Fondos',
      path: '/funds',
      icon: 'M4 5h16v2H4zm0 6h16v2H4zm0 6h16v2H4z',
    },
    {
      label: 'Historial',
      path: '/transactions',
      icon: 'M7 11a4 4 0 0 1 8 0M12 4v2m0 12v2m9-9h-2m-12 0H3',
    },
  ];
}
