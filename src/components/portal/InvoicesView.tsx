import React, { useState } from 'react';
import { ClientInvoice } from '../../types';
import { 
  Receipt, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  CreditCard, 
  Download, 
  Filter, 
  ArrowUpRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface InvoicesViewProps {
  invoices: ClientInvoice[];
  onOpenPaymentModal: (invoice: ClientInvoice) => void;
}

export const InvoicesView: React.FC<InvoicesViewProps> = ({
  invoices,
  onOpenPaymentModal
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'paid' | 'overdue'>('all');
  const [expandedInvoiceId, setExpandedInvoiceId] = useState<string | null>(null);

  // Financial calculations
  const totalBilled = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingCount = invoices.filter(inv => inv.status === 'pending' || inv.status === 'overdue').length;

  const filteredInvoices = invoices.filter(inv => {
    if (filter === 'all') return true;
    if (filter === 'pending') return inv.status === 'pending' || inv.status === 'overdue';
    return inv.status === filter;
  });

  const toggleExpand = (id: string) => {
    setExpandedInvoiceId(prev => prev === id ? null : id);
  };

  const statusConfigs: Record<string, { label: string; bg: string; text: string; icon: any }> = {
    pending: { label: 'Pending Payment', bg: 'bg-amber-50 border-amber-200 text-amber-800', text: 'text-amber-700', icon: Clock },
    paid: { label: 'Settled & Paid', bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', text: 'text-emerald-700', icon: CheckCircle2 },
    overdue: { label: 'Overdue Notice', bg: 'bg-rose-50 border-rose-200 text-rose-800', text: 'text-rose-700', icon: AlertCircle },
    in_review: { label: 'Under Billing Audit', bg: 'bg-blue-50 border-blue-200 text-blue-800', text: 'text-blue-700', icon: Clock },
  };

  return (
    <div className="space-y-6">
      
      {/* Financial Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Outstanding Pending Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white border border-amber-200/80 shadow-xs">
          <div className="flex items-center justify-between text-amber-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Action Required</span>
            <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
            ${totalPending.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">USD</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            {pendingCount} outstanding statement{pendingCount === 1 ? '' : 's'} awaiting client settlement
          </p>
        </div>

        {/* Paid to Date Card */}
        <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white border border-emerald-200/80 shadow-xs">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Paid to Date</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
            ${totalPaid.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">USD</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Fully settled across all verified advisory retainers
          </p>
        </div>

        {/* Total Lifetime Billed Card */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Contract Value</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
              <DollarSign className="w-4 h-4 text-slate-700" />
            </div>
          </div>
          <h3 className="text-3xl font-bold font-serif text-slate-900 tracking-tight">
            ${totalBilled.toLocaleString()} <span className="text-sm font-sans font-normal text-slate-500">USD</span>
          </h3>
          <p className="text-xs text-slate-600 mt-1">
            Total lifetime statements across {invoices.length} invoices
          </p>
        </div>

      </div>

      {/* Main Billing Table & Cards */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Table Filter Bar */}
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-blue-600" />
            <h3 className="text-base font-bold font-serif text-slate-900">Invoices & Statements</h3>
            <span className="text-xs text-slate-400 font-mono">({filteredInvoices.length})</span>
          </div>

          {/* Filter Chips */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-200/70 rounded-xl">
            {(['all', 'pending', 'paid'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition ${
                  filter === f 
                    ? 'bg-white text-slate-900 shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {f === 'all' ? 'All Invoices' : f}
              </button>
            ))}
          </div>
        </div>

        {/* Invoice Rows */}
        <div className="divide-y divide-slate-100">
          {filteredInvoices.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">
              No invoices match the selected filter.
            </div>
          ) : (
            filteredInvoices.map((invoice) => {
              const isExpanded = expandedInvoiceId === invoice.id;
              const statusCfg = statusConfigs[invoice.status] || statusConfigs.pending;
              const StatusIcon = statusCfg.icon;

              return (
                <div key={invoice.id} className="transition-colors hover:bg-slate-50/70">
                  
                  {/* Summary Bar */}
                  <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200/60">
                          {invoice.invoiceNumber}
                        </span>
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${statusCfg.bg}`}>
                          <StatusIcon className="w-3 h-3" />
                          <span>{statusCfg.label}</span>
                        </span>
                        {invoice.projectTitle && (
                          <span className="text-[11px] text-slate-400 truncate max-w-xs">
                            • {invoice.projectTitle}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900">
                        {invoice.description}
                      </h4>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Issued: {invoice.issueDate}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className={invoice.status === 'pending' ? 'text-amber-700 font-semibold' : ''}>
                            Due: {invoice.dueDate}
                          </span>
                        </span>
                        {invoice.paidAt && (
                          <span className="text-emerald-700 font-medium">
                            Paid on: {new Date(invoice.paidAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Amount and Action Buttons */}
                    <div className="flex items-center justify-between md:justify-end space-x-4 shrink-0">
                      <div className="text-right">
                        <span className="text-slate-400 text-[10px] uppercase font-bold block">Total Due</span>
                        <span className="text-xl sm:text-2xl font-bold font-serif text-slate-900 font-mono">
                          ${invoice.amount.toLocaleString()} <span className="text-xs font-sans font-normal text-slate-500">USD</span>
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        {invoice.status === 'pending' || invoice.status === 'overdue' ? (
                          <button
                            onClick={() => onOpenPaymentModal(invoice)}
                            className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-1.5 active:scale-98"
                          >
                            <CreditCard className="w-3.5 h-3.5" />
                            <span>Pay Invoice</span>
                          </button>
                        ) : (
                          <span className="px-3 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold flex items-center space-x-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Receipt Settled</span>
                          </span>
                        )}

                        <button
                          onClick={() => toggleExpand(invoice.id)}
                          className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition"
                          title="View Line Items"
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                  </div>

                  {/* Expanded Itemized Line Items Drawer */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 bg-slate-50/80 border-t border-slate-100 text-xs space-y-4 animate-fadeIn">
                      <div className="p-4 bg-white rounded-2xl border border-slate-200 space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100 font-bold text-slate-400 text-[11px] uppercase">
                          <span>Service Line Item Breakdown</span>
                          <span>Subtotal</span>
                        </div>

                        <div className="space-y-2">
                          {invoice.items?.map((item) => (
                            <div key={item.id} className="flex justify-between items-center text-slate-700">
                              <div>
                                <p className="font-semibold text-slate-800">{item.description}</p>
                                <p className="text-[10px] text-slate-400">
                                  {item.quantity} unit{item.quantity > 1 ? 's' : ''} @ ${item.rate.toLocaleString()}
                                </p>
                              </div>
                              <span className="font-mono font-bold text-slate-900">
                                ${item.amount.toLocaleString()} USD
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-3 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-900">
                          <span>Total Statement Balance:</span>
                          <span className="font-mono">${invoice.amount.toLocaleString()} USD</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-slate-500 text-[11px]">
                        <span className="flex items-center space-x-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Generated in accordance with Accounticca Master Advisory Covenants</span>
                        </span>
                        {invoice.paymentMethod && (
                          <span className="font-medium text-slate-700">
                            Payment Rail: {invoice.paymentMethod}
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
};
