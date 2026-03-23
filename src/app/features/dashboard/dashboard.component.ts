import { DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FundService } from '../../core/services/fund.service';
import { CopCurrencyPipe } from '../../core/pipes/cop-currency.pipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CopCurrencyPipe, DatePipe, RouterLink],
  template: `
    <section class="space-y-8">
      <!-- Header -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-transparent bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text mb-3">
          Panel de Control Financiero
        </h1>
        <p class="text-secondary-600 text-lg">Tu resumen completo de inversiones BTG Pactual</p>
        <div class="w-32 h-1 bg-gradient-to-r from-primary-500 to-primary-700 rounded-full mx-auto mt-6"></div>
      </div>

      <!-- KPI cards -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <!-- Saldo disponible -->
        <div class="card card-glow border-primary-200 bg-gradient-to-br from-primary-50/50 to-white hover:from-primary-100/50 transition-all duration-300 group">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-primary-100 flex items-center justify-center group-hover:bg-primary-200 transition-colors">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"/>
              </svg>
            </div>
            <div>
              <p class="kpi-label text-primary-700">Saldo Disponible</p>
            </div>
          </div>
          <p class="kpi-value text-primary-900 mb-2">{{ fundSvc.balance() | copCurrency }}</p>
          <p class="kpi-sub text-primary-600">Listo para invertir</p>
        </div>

        <!-- Total invertido -->
        <div class="card border-accent-200 bg-gradient-to-br from-accent-50/50 to-white hover:from-accent-100/50 transition-all duration-300 group">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-accent-100 flex items-center justify-center group-hover:bg-accent-200 transition-colors">
              <svg class="w-6 h-6 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
              </svg>
            </div>
            <div>
              <p class="kpi-label text-accent-700">Capital Invertido</p>
            </div>
          </div>
          <p class="kpi-value text-accent-900 mb-2">{{ fundSvc.totalInvested() | copCurrency }}</p>
          <p class="kpi-sub text-accent-600">{{ fundSvc.subscribedFunds().length }} posiciones activas</p>
        </div>

        <!-- Patrimonio total -->
        <div class="card border-success-200 bg-gradient-to-br from-success-50/50 to-white hover:from-success-100/50 transition-all duration-300 group">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-xl bg-success-100 flex items-center justify-center group-hover:bg-success-200 transition-colors">
              <svg class="w-6 h-6 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
            </div>
            <div>
              <p class="kpi-label text-success-700">Patrimonio Total</p>
            </div>
          </div>
          <p class="kpi-value text-success-900 mb-2">
            {{ (fundSvc.balance() + fundSvc.totalInvested()) | copCurrency }}
          </p>
          <p class="kpi-sub text-success-600">Valor total de tu portafolio</p>
        </div>
      </div>

      <!-- Posiciones activas -->
      @if (fundSvc.subscribedFunds().length > 0) {
        <div class="card bg-gradient-to-br from-white to-secondary-50/30 border-secondary-200">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-xl font-semibold text-secondary-800 flex items-center gap-3">
              <svg class="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
              </svg>
              Tus Inversiones Activas
            </h2>
            <span class="px-4 py-2 bg-primary-100 text-primary-800 text-sm font-semibold rounded-full border border-primary-200">
              {{ fundSvc.subscribedFunds().length }} fondos
            </span>
          </div>
          <div class="space-y-6">
            @for (fund of fundSvc.subscribedFunds(); track fund.id) {
              <div class="flex items-center justify-between p-6 bg-secondary-50/50 rounded-2xl border border-secondary-200 hover:bg-secondary-100/50 hover:border-secondary-300 transition-all duration-200">
                <div class="flex items-center gap-5">
                  <span class="badge" [class.badge-fpv]="fund.category === 'FPV'" [class.badge-fic]="fund.category === 'FIC'">
                    {{ fund.category }}
                  </span>
                  <div>
                    <p class="text-lg font-semibold text-secondary-900 mb-1">{{ fund.name }}</p>
                    <p class="text-secondary-600">
                      Invertido el {{ fund.subscribedAt | date:'dd/MM/yyyy' }} a las {{ fund.subscribedAt | date:'HH:mm' }}
                    </p>
                  </div>
                </div>
                <div class="text-right">
                  <p class="text-2xl font-bold text-success-700 mb-2">
                    {{ fund.subscribedAmount | copCurrency }}
                  </p>
                  <p class="text-sm text-success-600 bg-success-100 px-3 py-1 rounded-lg inline-block font-medium">
                    {{ fund.returnRate }}% E.A.
                  </p>
                </div>
              </div>
            }
          </div>
          <div class="mt-8 pt-6 border-t border-secondary-200">
            <a routerLink="/funds" class="btn-primary bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300">
              Gestionar Inversiones
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
              </svg>
            </a>
          </div>
        </div>
      } @else {
        <div class="card flex flex-col items-center justify-center py-20 text-center bg-gradient-to-br from-secondary-50/50 to-white border-secondary-200">
          <div class="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center mb-8 border border-primary-200">
            <svg class="w-12 h-12 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <h3 class="text-2xl font-bold text-secondary-900 mb-3">¡Comienza tu viaje de inversión!</h3>
          <p class="text-secondary-600 text-lg mb-8 max-w-lg">No tienes posiciones abiertas aún. Explora nuestras opciones de fondos y comienza a construir tu portafolio de manera inteligente.</p>
          <a routerLink="/funds" class="btn-primary bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300 border-0">
            Descubrir Oportunidades
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
            </svg>
          </a>
        </div>
      }
    </section>
  `,
})
export class DashboardComponent {
  readonly fundSvc = inject(FundService);
}
