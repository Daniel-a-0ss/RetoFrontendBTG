import { Component, inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FundService } from '../../core/services/fund.service';
import { CopCurrencyPipe } from '../../core/pipes/cop-currency.pipe';
import { Transaction } from '../../core/models/transaction.model';

@Component({
  selector: 'app-transaction-history',
  standalone: true,
  imports: [CopCurrencyPipe, DatePipe],
  template: `
    <section class="space-y-6">
      <div>
        <h1 class="text-2xl font-bold text-slate-800">Registro de operaciones</h1>
        <p class="text-slate-600 text-sm mt-1">Resumen de suscripciones y retiros</p>
      </div>

      @if (fundSvc.transactions().length === 0) {
        <div class="card flex flex-col items-center justify-center py-16 text-center bg-white border border-slate-200 shadow-sm">
          <div class="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 border border-slate-200">
            <svg class="w-7 h-7 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
          </div>
          <p class="text-slate-800 font-medium">Sin transacciones aún</p>
          <p class="text-slate-500 text-sm mt-1">Las operaciones aparecerán aquí</p>
        </div>
      } @else {
        <!-- Stats row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="card text-center py-3 bg-white border border-slate-200 shadow-sm">
            <p class="text-2xl font-bold text-slate-800">{{ fundSvc.transactions().length }}</p>
            <p class="text-xs text-slate-600 mt-0.5 uppercase tracking-wider">Operaciones totales</p>
          </div>
          <div class="card text-center py-3 bg-gradient-to-br from-primary-50 to-primary-100 border border-primary-200">
            <p class="text-2xl font-bold text-primary-700">{{ countByType('SUBSCRIPTION') }}</p>
            <p class="text-xs text-primary-600 mt-0.5 uppercase tracking-wider">Suscripciones</p>
          </div>
          <div class="card text-center py-3 bg-gradient-to-br from-amber-50 to-amber-100 border border-amber-200">
            <p class="text-2xl font-bold text-amber-700">{{ countByType('CANCELLATION') }}</p>
            <p class="text-xs text-amber-600 mt-0.5 uppercase tracking-wider">Retiros</p>
          </div>
          <div class="card text-center py-3 bg-gradient-to-br from-success-50 to-success-100 border border-success-200">
            <p class="text-sm font-bold text-success-700">{{ totalSubscribed() | copCurrency }}</p>
            <p class="text-xs text-success-600 mt-0.5 uppercase tracking-wider">Monto suscripto</p>
          </div>
        </div>

        <!-- Transactions list -->
        <div class="card overflow-hidden p-0 bg-white border border-slate-200 shadow-sm">
          <div class="divide-y divide-slate-100">
            @for (tx of fundSvc.transactions(); track tx.id) {
              <div class="flex flex-col gap-3 px-4 py-4 hover:bg-slate-50 transition-colors sm:flex-row sm:items-center sm:gap-4 sm:px-5">
                <div class="flex items-start gap-3 sm:flex-1 sm:min-w-0 sm:items-center">
                  <!-- Type indicator -->
                  <div
                    class="w-10 h-10 shrink-0 rounded-xl flex items-center justify-center border"
                    [class.bg-primary-50]="tx.type === 'SUBSCRIPTION'"
                    [class.border-primary-200]="tx.type === 'SUBSCRIPTION'"
                    [class.bg-amber-50]="tx.type === 'CANCELLATION'"
                    [class.border-amber-200]="tx.type === 'CANCELLATION'"
                  >
                    @if (tx.type === 'SUBSCRIPTION') {
                      <svg class="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
                      </svg>
                    } @else {
                      <svg class="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4"/>
                      </svg>
                    }
                  </div>

                  <!-- Info -->
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-medium text-slate-800 break-words sm:truncate">{{ tx.fundName }}</p>
                    <div class="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        class="text-xs font-medium"
                        [class.text-primary-600]="tx.type === 'SUBSCRIPTION'"
                        [class.text-amber-600]="tx.type === 'CANCELLATION'"
                      >
                        {{ tx.type === 'SUBSCRIPTION' ? 'Suscripción' : 'Cancelación' }}
                      </span>
                      <span class="hidden text-slate-400 sm:inline">·</span>
                      <span class="text-xs text-slate-500">
                        {{ tx.notificationMethod === 'EMAIL' ? '✉️ Email' : '📱 SMS' }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Amount + date -->
                <div class="border-t border-slate-100 pt-3 sm:shrink-0 sm:border-t-0 sm:pt-0 sm:text-right">
                  <p
                    class="text-sm font-semibold"
                    [class.text-success-600]="tx.type === 'SUBSCRIPTION'"
                    [class.text-red-500]="tx.type === 'CANCELLATION'"
                  >
                    {{ tx.type === 'CANCELLATION' ? '+' : '-' }}{{ tx.amount | copCurrency }}
                  </p>
                  <p class="text-xs text-slate-500 mt-0.5">{{ tx.createdAt | date:'dd/MM/yy HH:mm' }}</p>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- ID ref note -->
        <p class="text-xs text-slate-500 text-center">
          Los IDs de transacción son generados localmente en esta sesión.
        </p>
      }
    </section>
  `,
})
export class TransactionHistoryComponent {
  readonly fundSvc = inject(FundService);

  countByType(type: Transaction['type']): number {
    return this.fundSvc.transactions().filter(t => t.type === type).length;
  }

  totalSubscribed(): number {
    return this.fundSvc.transactions()
      .filter(t => t.type === 'SUBSCRIPTION')
      .reduce((sum, t) => sum + t.amount, 0);
  }
}
