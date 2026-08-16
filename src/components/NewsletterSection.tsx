import React, { useState } from 'react';
import { AnimatedSection } from './AnimatedSection';
import { Mail, Send, CheckCircle2, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid business email address.');
      return;
    }

    setLoading(true);

    // Simulate instant subscription API call
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
    }, 600);
  };

  return (
    <section className="py-16 bg-slate-900 text-white relative overflow-hidden border-t border-b border-slate-800">
      {/* Subtle background ambient light */}
      <div className="absolute -top-24 right-10 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 left-10 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <AnimatedSection animation="fade-up">
          <div className="bg-gradient-to-r from-slate-800/90 via-slate-800/60 to-slate-900/90 border border-slate-700/80 rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Text content */}
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/30 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-medium tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>Accounticca Executive Insights</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                  Stay Ahead with Strategic Advisory Briefings
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  Join 2,500+ SME founders, CFOs, and executives. Receive weekly curated insights on financial optimization, legal compliance, and business growth strategies.
                </p>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                  <span className="flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>No spam, strictly actionable guides</span>
                  </span>
                  <span className="flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                    <span>Unsubscribe anytime in 1-click</span>
                  </span>
                </div>
              </div>

              {/* Form / Subscription box */}
              <div className="lg:col-span-5">
                {subscribed ? (
                  <div className="bg-emerald-950/40 border border-emerald-500/40 rounded-2xl p-6 text-center space-y-3 animate-fade-in">
                    <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <h4 className="text-lg font-serif font-bold text-white">Subscription Confirmed!</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Thank you for subscribing. We’ve sent a confirmation email to <span className="text-emerald-300 font-medium">{email}</span> with your starter business health checklist.
                    </p>
                    <button
                      onClick={() => {
                        setSubscribed(false);
                        setEmail('');
                      }}
                      className="text-xs text-slate-400 hover:text-white underline pt-2 inline-block transition"
                    >
                      Subscribe another email
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (error) setError('');
                        }}
                        placeholder="Enter your business email"
                        className="w-full pl-11 pr-32 py-4 rounded-full bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/30 transition"
                      />
                      <button
                        type="submit"
                        disabled={loading}
                        className="absolute right-1.5 top-1.5 bottom-1.5 px-6 rounded-full bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-semibold text-xs transition flex items-center space-x-1.5 shadow-md shadow-blue-600/30 disabled:opacity-50"
                      >
                        {loading ? (
                          <span>Subscribing...</span>
                        ) : (
                          <>
                            <span>Subscribe</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    </div>

                    {error && (
                      <p className="text-xs text-rose-400 pl-4 animate-fade-in font-medium">
                        {error}
                      </p>
                    )}

                    <p className="text-[11px] text-slate-400 text-center sm:text-left pl-2">
                      By subscribing, you agree to Accounticca's privacy terms. We protect your data.
                    </p>
                  </form>
                )}
              </div>

            </div>

          </div>
        </AnimatedSection>
      </div>
    </section>
  );
};
