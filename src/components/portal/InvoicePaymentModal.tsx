import React, { useState } from 'react';
import { ClientInvoice } from '../../types';
import { payClientInvoice } from '../../lib/portalService';
import { 
  X, 
  CreditCard, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  DollarSign, 
  ArrowRight,
  Receipt,
  Download,
  AlertCircle
} from 'lucide-react';

interface InvoicePaymentModalProps {
  invoice: ClientInvoice | null;
  onClose: () => void;
  onPaymentSuccess?: () => void;
}

export const InvoicePaymentModal: React.FC<InvoicePaymentModalProps> = ({
  invoice,
  onClose,
  onPaymentSuccess
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ach' | 'wire'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 9024');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('884');
  const [cardHolder, setCardHolder] = useState('Elena Rostova');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!invoice) return null;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setProcessing(true);

    try {
      const methodLabel = paymentMethod === 'card' 
        ? `Corporate Card (*${cardNumber.slice(-4)})` 
        : paymentMethod === 'ach' 
        ? 'ACH Direct Debit (JPMorgan Chase)' 
        : 'Fedwire Priority Settlement';

      await payClientInvoice(invoice.id, methodLabel);
      setSuccess(true);
      if (onPaymentSuccess) onPaymentSuccess();
    } catch (err: any) {
      console.error('Payment failure:', err);
      setError(err.message || 'Payment processing failed. Please verify billing information.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 bg-slate-100 hover:bg-slate-200 text-slate-500 rounded-full flex items-center justify-center transition"
        >
          <X className="w-5 h-5" />
        </button>

        {success ? (
          /* Payment Success State */
          <div className="p-8 text-center space-y-6 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
                Payment Authorized & Verified
              </span>
              <h3 className="text-2xl font-bold font-serif text-slate-900 mt-2">
                ${invoice.amount.toLocaleString()} USD Paid
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Invoice Reference: <span className="font-mono font-semibold text-slate-700">{invoice.invoiceNumber}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Transaction ID:</span>
                <span className="font-mono text-slate-800 font-semibold">tx_acc_{Date.now().toString().slice(-8)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Settled To:</span>
                <span className="text-slate-800 font-semibold">Accounticca Advisory Practice LLC</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Date & Time:</span>
                <span className="text-slate-800 font-semibold">{new Date().toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600 pt-2 border-t border-slate-200 font-semibold">
                <span>Status in Firestore:</span>
                <span className="text-emerald-600 flex items-center space-x-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Synchronized (PAID)</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
              >
                Return to Client Portal
              </button>
            </div>
          </div>
        ) : (
          /* Payment Form */
          <div>
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-900 to-slate-900 text-white p-6">
              <div className="flex items-center space-x-2 text-xs text-blue-200 uppercase font-semibold tracking-wider mb-1">
                <Receipt className="w-3.5 h-3.5" />
                <span>Secure Settlement Gateway</span>
              </div>
              <h3 className="text-xl font-bold font-serif">
                Settle Invoice {invoice.invoiceNumber}
              </h3>
              <div className="mt-3 flex items-baseline justify-between pt-3 border-t border-white/10">
                <span className="text-xs text-blue-200">Total Payable Amount:</span>
                <span className="text-2xl font-bold text-white font-serif">
                  ${invoice.amount.toLocaleString()} <span className="text-sm font-normal text-blue-200">USD</span>
                </span>
              </div>
            </div>

            {/* Body Form */}
            <form onSubmit={handlePay} className="p-6 space-y-5">
              
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Payment Method Selector */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">Select Payment Rail</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition ${
                      paymentMethod === 'card' 
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Corporate Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ach')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition ${
                      paymentMethod === 'ach' 
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <span>ACH Transfer</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wire')}
                    className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center justify-center space-y-1.5 transition ${
                      paymentMethod === 'wire' 
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700 ring-2 ring-blue-500/20' 
                        : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <DollarSign className="w-4 h-4" />
                    <span>FedWire</span>
                  </button>
                </div>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'card' && (
                <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Cardholder Name</label>
                    <input
                      type="text"
                      required
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                    <input
                      type="text"
                      required
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Expiry</label>
                      <input
                        type="text"
                        required
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Security CVC</label>
                      <input
                        type="text"
                        required
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        placeholder="CVC"
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'ach' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <p className="font-semibold text-slate-800">Connected Corporate Account:</p>
                  <p className="text-slate-600 font-mono">JPMorgan Chase Commercial Banking (****8812)</p>
                  <p className="text-[11px] text-slate-400">Direct debit authorization verified under Accounticca Master Agreement.</p>
                </div>
              )}

              {paymentMethod === 'wire' && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-2">
                  <p className="font-semibold text-slate-800">FedWire Priority Instructions:</p>
                  <p className="text-slate-600 font-mono text-[11px]">Beneficiary: Accounticca Advisory Practice LLC<br />Routing: 021000021<br />Account: 9942018442</p>
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/25 transition active:scale-98 disabled:opacity-60 flex items-center justify-center space-x-2"
              >
                {processing ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authorize Payment (${invoice.amount.toLocaleString()} USD)</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center space-x-2 text-[10px] text-slate-400">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>PCI-DSS Level 1 & SOC-2 Bank Encryption</span>
              </div>

            </form>
          </div>
        )}

      </div>
    </div>
  );
};
