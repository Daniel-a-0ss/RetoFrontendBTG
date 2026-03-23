import { Component, inject, signal, OnInit } from '@angular/core';
import { FundService } from '../../core/services/fund.service';
import { ToastService } from '../../shared/services/toast.service';
import { CopCurrencyPipe } from '../../core/pipes/cop-currency.pipe';
import { Fund } from '../../core/models/fund.model';
import { FundSubscribeComponent } from '../fund-subscribe/fund-subscribe.component';

@Component({
  selector: 'app-fund-list',
  standalone: true,
  imports: [CopCurrencyPipe, FundSubscribeComponent],
  template: `
    <section class="space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-3xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text mb-2">
          Oportunidades de Inversión
        </h1>
        <p class="text-secondary-600 text-lg">Elige el instrumento adecuado y comienza a invertir</p>
        <div class="w-32 h-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full mx-auto mt-4"></div>
      </div>

      <!-- Loading skeleton -->
      @if (loading()) {
        <div class="space-y-4">
          @for (i of [1,2,3,4,5]; track i) {
            <div class="card animate-pulse">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 rounded-xl bg-secondary-200"></div>
                <div class="flex-1 space-y-2">
                  <div class="h-4 bg-secondary-200 rounded w-48"></div>
                  <div class="h-3 bg-secondary-200 rounded w-72"></div>
                </div>
                <div class="h-8 w-28 bg-secondary-200 rounded-lg"></div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Available funds grid -->
      @if (!loading()) {
        @if (funds().length > 0) {
          <div class="grid gap-6">
            @for (fund of funds(); track fund.id) {
              <div class="card group hover:border-primary-300 hover:shadow-card-hover transition-all duration-300 border-secondary-200">
                <div class="flex flex-col lg:flex-row lg:items-center gap-6">
                  <!-- Icon + badge -->
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    <div class="w-14 h-14 shrink-0 rounded-2xl bg-primary-100 flex items-center justify-center border border-primary-200 group-hover:bg-primary-200 transition-colors">
                      <svg class="w-7 h-7 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-3 flex-wrap mb-2">
                        <h3 class="text-lg font-semibold text-secondary-900">{{ fund.name }}</h3>
                        <span class="badge bg-secondary-100 border border-secondary-200 text-secondary-700">
                          ID {{ fund.id }}
                        </span>
                        <span class="badge" [class.badge-fpv]="fund.category === 'FPV'" [class.badge-fic]="fund.category === 'FIC'">
                          {{ fund.category }}
                        </span>
                        <span class="badge bg-accent-100 text-accent-800 border border-accent-200">
                          {{ fund.riskLevel }}
                        </span>
                        @if (isSubscribed(fund.id)) {
                          <span class="badge bg-success-100 text-success-800 border border-success-200">
                            Activo
                          </span>
                        }
                      </div>
                      <p class="text-secondary-600 text-sm">{{ fund.description }}</p>
                    </div>
                  </div>

                  <!-- Metrics -->
                  <div class="flex items-center gap-8 lg:gap-6">
                    <div class="text-center">
                      <p class="text-sm text-primary-700 font-medium uppercase tracking-wide">Monto mínimo</p>
                      <p class="text-xl font-bold text-secondary-900 mt-1">
                        {{ fund.minAmount | copCurrency }}
                      </p>
                    </div>
                    <div class="text-center">
                      <p class="text-sm text-primary-700 font-medium uppercase tracking-wide">Rendimiento</p>
                      <p class="text-xl font-bold text-accent-700 mt-1">{{ fund.returnRate }}% E.A.</p>
                    </div>
                    @if (isSubscribed(fund.id)) {
                      <button
                        type="button"
                        disabled
                        class="btn-secondary text-sm shrink-0 opacity-70 cursor-not-allowed"
                        title="Ya tienes una suscripción activa en este fondo"
                      >
                        Ya suscrito
                      </button>
                    } @else {
                      <button
                        (click)="openModal(fund)"
                        [disabled]="fundSvc.balance() < fund.minAmount"
                        class="btn-primary bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-sm shrink-0 disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-300"
                        [title]="fundSvc.balance() < fund.minAmount ? 'Saldo insuficiente para este fondo' : 'Suscribirse'"
                      >
                        Invertir
                      </button>
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="card text-center py-16 bg-gradient-to-br from-secondary-50/50 to-white border-secondary-200">
            <div class="w-16 h-16 rounded-2xl bg-secondary-100 flex items-center justify-center mb-4 mx-auto">
              <svg class="w-8 h-8 text-secondary-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-.966-5.618-2.479"/>
              </svg>
            </div>
            <p class="text-secondary-900 font-semibold text-lg">No se encontraron fondos disponibles</p>
            <p class="text-secondary-500 text-base mt-2">Verifica la conexión con el catálogo de fondos</p>
          </div>
        }
      }

      <!-- Subscribed funds section -->
      @if (fundSvc.subscribedFunds().length > 0) {
        <div class="card bg-gradient-to-br from-white to-secondary-50/30 border-secondary-200">
          <div class="flex items-center justify-between mb-6">
            <h2 class="text-xl font-semibold text-secondary-800 flex items-center gap-3">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              Mis Suscripciones Activas
            </h2>
            <span class="px-4 py-2 bg-success-100 text-success-800 text-sm font-semibold rounded-full border border-success-200">
              {{ fundSvc.subscribedFunds().length }} fondos
            </span>
          </div>
          <div class="grid gap-4">
            @for (fund of fundSvc.subscribedFunds(); track fund.id) {
              <div class="card border-success-200 bg-gradient-to-r from-success-50/50 to-white">
                <div class="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div class="flex items-center gap-4 flex-1 min-w-0">
                    <div class="w-12 h-12 shrink-0 rounded-xl bg-success-100 border border-success-200 flex items-center justify-center">
                      <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                    <div class="min-w-0">
                      <h3 class="text-lg font-semibold text-secondary-900 truncate">{{ fund.name }}</h3>
                      <p class="text-secondary-600 text-sm">
                        {{ fund.subscribedAmount | copCurrency }} · {{ fund.returnRate }}% E.A.
                      </p>
                    </div>
                  </div>
                  <button
                    (click)="cancelFund(fund.id)"
                    [disabled]="cancellingId() === fund.id"
                    class="btn-danger text-sm shrink-0"
                  >
                    @if (cancellingId() === fund.id) {
                      <span class="flex items-center gap-2">
                        <span class="spinner-sm"></span> Cancelando…
                      </span>
                    } @else {
                      Cancelar suscripción
                    }
                  </button>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <!-- Subscription modal -->
      @if (selectedFund()) {
        <app-fund-subscribe
          [fund]="selectedFund()!"
          (confirmed)="onSubscriptionConfirmed()"
          (cancelled)="closeModal()"
        />
      }
    </section>
  `,
})
export class FundListComponent implements OnInit {
  readonly fundSvc   = inject(FundService);
  readonly toastSvc  = inject(ToastService);

  // La pantalla mantiene una copia local del catálogo para que la lista completa
  // siga visible, incluso cuando el usuario ya tiene fondos activos.
  readonly funds        = signal<Fund[]>([]);
  readonly loading      = signal(true);
  readonly selectedFund = signal<Fund | null>(null);
  readonly cancellingId = signal<string | null>(null);

  ngOnInit(): void {
    this.fundSvc.getFunds().subscribe(funds => {
      this.funds.set(funds);
      this.loading.set(false);
    });
  }

  openModal(fund: Fund): void {
    this.selectedFund.set(fund);
  }

  closeModal(): void {
    this.selectedFund.set(null);
  }

  onSubscriptionConfirmed(): void {
    this.selectedFund.set(null);
  }

  isSubscribed(fundId: string): boolean {
    // Permite cambiar el CTA y el estado visual sin quitar la tarjeta del catálogo.
    return this.fundSvc.subscribedFunds().some(fund => fund.id === fundId);
  }

  cancelFund(fundId: string): void {
    this.cancellingId.set(fundId);
    this.fundSvc.cancel(fundId, 'EMAIL').subscribe({
      next: () => {
        this.cancellingId.set(null);
        this.toastSvc.success('Suscripción cancelada. El monto ha sido reintegrado a tu saldo.');
      },
      error: (err: Error) => {
        this.cancellingId.set(null);
        this.toastSvc.error(err.message);
      },
    });
  }

  riskClass(level: string): string {
    const map: Record<string, string> = {
      Bajo:  'badge-risk-low',
      Medio: 'badge-risk-mid',
      Alto:  'badge-risk-high',
    };
    return map[level] ?? '';
  }
}
