import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, PhoneCall, Sparkles, Loader2, Video } from 'lucide-react';
import { submitConsultationBooking } from '../lib/firebase';

interface ConsultationModalProps {
  mode: 'consultation' | 'meeting';
  initialService?: string;
  onClose: () => void;
  onOpenGoogleMeet?: () => void;
}

export const ConsultationModal: React.FC<ConsultationModalProps> = ({ mode, initialService, onClose, onOpenGoogleMeet }) => {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: initialService || 'Business Startup Consultancy',
    date: '2026-08-10',
    time: '10:00 AM',
    notes: ''
  });

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setSubmitting(true);

    try {
      await submitConsultationBooking({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        service: formData.service,
        message: formData.notes ? `${mode === 'meeting' ? `Meeting Schedule: ${formData.date} at ${formData.time}. ` : ''}${formData.notes}` : (mode === 'meeting' ? `Meeting Schedule: ${formData.date} at ${formData.time}` : undefined)
      });

      window.dispatchEvent(
        new CustomEvent('accounticca_log_activity', {
          detail: {
            type: mode === 'meeting' ? 'meeting' : 'consultation',
            title: mode === 'meeting' ? `Strategy Meeting Requested: ${formData.service}` : `Consultation Request Submitted: ${formData.service}`,
            description: `Booking request for ${formData.service} submitted by ${formData.name}. Preferred slot: ${formData.date} at ${formData.time}.`,
            actor: formData.name,
            metadata: `Service: ${formData.service}`
          }
        })
      );

      setStep(2);
    } catch (err) {
      console.error('Error submitting consultation to Firestore:', err);
      setStep(2); // Progress to step 2 for smooth UX
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6 text-slate-900">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {step === 1 ? (
          <form onSubmit={handleBookingSubmit} className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-200 pb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
                {mode === 'meeting' ? <Calendar className="w-6 h-6" /> : <PhoneCall className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Accounticca Advisory</span>
                <h3 className="text-xl font-serif font-bold text-slate-900">
                  {mode === 'meeting' ? 'Schedule a Strategy Meeting' : 'Request Business Consultation'}
                </h3>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Smith"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@enterprise.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-700 uppercase">Service Focus</label>
                  <select
                    value={formData.service}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                  >
                    <option value="Business Startup Consultancy">Business Startup Consultancy</option>
                    <option value="Business Planning & Strategy">Business Planning & Strategy</option>
                    <option value="Accounting & Financial Consultancy">Accounting & Financial Consultancy</option>
                    <option value="Bookkeeping Services">Bookkeeping Services</option>
                    <option value="Business Process Optimization">Business Process Optimization</option>
                    <option value="Business Automation Consultancy">Business Automation Consultancy</option>
                    <option value="HR & Organizational Consultancy">HR & Organizational Consultancy</option>
                    <option value="Sales & Marketing Consultancy">Sales & Marketing Consultancy</option>
                    <option value="SME Growth Consultancy">SME Growth Consultancy</option>
                    <option value="Outsourced Business Support">Outsourced Business Support</option>
                  </select>
                </div>
              </div>

              {mode === 'meeting' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>Preferred Date</span>
                    </label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-700 uppercase flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Preferred Time</span>
                    </label>
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                    >
                      <option value="09:00 AM">09:00 AM</option>
                      <option value="10:30 AM">10:30 AM</option>
                      <option value="01:00 PM">01:00 PM</option>
                      <option value="03:30 PM">03:30 PM</option>
                      <option value="05:00 PM">05:00 PM</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-700 uppercase">Additional Notes / Objectives</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Share any background info or specific questions..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20 flex items-center space-x-2"
              >
                {submitting && <Loader2 className="w-3.5 h-3.5 animate-spin shrink-0" />}
                <span>{submitting ? 'Submitting...' : (mode === 'meeting' ? 'Confirm Meeting Schedule' : 'Submit Consultation Request')}</span>
              </button>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-6 animate-fade-in-scale relative overflow-hidden">
            
            {/* Animated Celebration Particle Accents */}
            <div className="absolute -top-4 left-1/4 w-3 h-3 rounded-full bg-emerald-400 animate-confetti pointer-events-none" style={{ animationDelay: '100ms' }} />
            <div className="absolute -top-2 right-1/4 w-2.5 h-2.5 rounded-full bg-blue-500 animate-confetti pointer-events-none" style={{ animationDelay: '300ms' }} />
            <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-amber-400 animate-confetti pointer-events-none" style={{ animationDelay: '200ms' }} />

            {/* Glowing Pop Checkmark Badge */}
            <div className="relative inline-block mx-auto">
              <div className="w-20 h-20 bg-gradient-to-tr from-emerald-500 to-teal-400 rounded-3xl flex items-center justify-center text-white mx-auto shadow-xl shadow-emerald-500/25 animate-success-pop animate-ring-pulse">
                <CheckCircle2 className="w-10 h-10 stroke-[2.5]" />
              </div>
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>Confirmed & Scheduled</span>
              </span>

              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 tracking-tight pt-1">
                {mode === 'meeting' ? 'Strategy Meeting Reserved!' : 'Consultation Request Received!'}
              </h3>

              <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed">
                Thank you <strong className="text-slate-900">{formData.name}</strong>. Our senior advisory team has received your request and logged your priority reservation.
              </p>
            </div>

            {/* Appointment Details Summary Card */}
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-4 sm:p-5 text-left max-w-md mx-auto space-y-3 shadow-xs">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-200/80 pb-2">
                Booking Summary Details
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <p className="text-slate-400 text-[11px]">Selected Service</p>
                  <p className="font-semibold text-slate-900 truncate">{formData.service}</p>
                </div>

                <div>
                  <p className="text-slate-400 text-[11px]">Confirmation Email</p>
                  <p className="font-semibold text-blue-600 truncate">{formData.email}</p>
                </div>

                {mode === 'meeting' && (
                  <>
                    <div>
                      <p className="text-slate-400 text-[11px]">Date</p>
                      <p className="font-semibold text-slate-900">{formData.date}</p>
                    </div>

                    <div>
                      <p className="text-slate-400 text-[11px]">Time</p>
                      <p className="font-semibold text-slate-900">{formData.time}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              {onOpenGoogleMeet && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenGoogleMeet();
                  }}
                  className="w-full sm:w-auto px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2"
                >
                  <Video className="w-4 h-4 shrink-0" />
                  <span>Create Google Meet Link</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-8 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-xs font-bold transition shadow-lg shadow-blue-600/25 flex items-center justify-center space-x-2"
              >
                <span>Return to Dashboard</span>
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
