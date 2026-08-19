import React from 'react';
import { ShieldCheck, TrendingUp, Users, Award, ArrowRight, CheckCircle2, Sparkles } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { ImagePlaceholder } from './ImagePlaceholder';

interface HeroProps {
  onOpenConsultation: () => void;
  onOpenMeeting: () => void;
  onOpenHealthAssessment: () => void;
  onOpenClientPortal?: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenConsultation,
  onOpenMeeting,
  onOpenHealthAssessment,
  onOpenClientPortal
}) => {
  return (
    <section id="home" className="group relative bg-slate-50 text-slate-900 border-b border-slate-200 overflow-hidden pt-[48px] pb-[79px]">
      {/* Background Decorative Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-indigo-500/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 group-hover:scale-105 transition-transform duration-500">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Hero Content */}
          <AnimatedSection animation="fade-right" className="lg:col-span-7 space-y-8">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs sm:text-sm font-bold tracking-wider uppercase shadow-2xs">
                <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Part of the E-Lawyers Ecosystem • Beyond Legal Services</span>
              </div>

              {onOpenClientPortal && (
                <button
                  onClick={onOpenClientPortal}
                  className="inline-flex items-center space-x-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-full text-xs font-bold transition shadow-xs cursor-pointer active:scale-95"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Client Portal</span>
                  <ArrowRight className="w-3 h-3 text-blue-300" />
                </button>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-[68px] font-extrabold font-serif tracking-tight text-slate-900 leading-[1.12] lg:leading-[1.08]">
              Build, Manage & Grow Your Business With{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-600">
                Confidence
              </span>
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mt-4">
              Accounticca provides professional business consultancy solutions designed to help entrepreneurs, startups, SMEs, and growing companies build strong foundations, improve operational efficiency, strengthen financial management, and achieve sustainable growth.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 pt-2">
              <button
                onClick={onOpenConsultation}
                className="px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-base transition shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-3 group"
              >
                <span>Get Business Consultation</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button
                onClick={onOpenMeeting}
                className="px-8 py-4 rounded-full bg-white hover:bg-slate-100 border border-slate-200 text-slate-800 font-semibold text-base transition flex items-center justify-center space-x-3 shadow-sm"
              >
                <span>Schedule a Meeting</span>
              </button>
            </div>

            {/* Free Tool Banner Callout */}
            <div className="pt-4">
              <div 
                onClick={onOpenHealthAssessment}
                className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-md hover:border-blue-500/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition">Free Business Health Assessment Scorecard</h3>
                    <p className="text-xs text-slate-500">Evaluate your business across 6 core operational dimensions in 3 minutes.</p>
                  </div>
                </div>
                <span className="text-xs font-semibold text-blue-600 underline whitespace-nowrap pl-2">Start Assessment →</span>
              </div>
            </div>

            {/* Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-200 text-sm text-slate-700">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Financial Advisory</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>Process Optimization</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                <span>SME Growth Strategy</span>
              </div>
            </div>

          </AnimatedSection>

          {/* Hero Visual Card / Stats Grid */}
          <AnimatedSection animation="fade-left" delay={150} className="lg:col-span-5">
            <div className="relative bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/60 hover:shadow-2xl hover:shadow-blue-500/20 transition-shadow duration-300">
              <div className="absolute -top-4 -right-4 bg-blue-600 text-white font-bold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                Growth Partner
              </div>

              <ImagePlaceholder
                src="https://picsum.photos/seed/hero-card/400/200"
                alt="Expert Advisory"
                className="w-full h-32 mb-4"
              />
              <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">Expert Advisory at Every Stage</h3>
              <p className="text-sm text-slate-500 mb-6">From business planning and accounting systems to HR solutions, automation, and scaling.</p>

              <div className="space-y-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Strategic Excellence</h4>
                    <p className="text-xs text-slate-500">Transforming operational challenges into sustainable growth opportunities.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Extended Team Support</h4>
                    <p className="text-xs text-slate-500">Outsourced accounting, reporting, and advisory without internal overhead.</p>
                  </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 flex items-center space-x-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-900">Proven Methodology</h4>
                    <p className="text-xs text-slate-500">Assessment → Strategy → Implementation → Continuous Monitoring.</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                <span>Direct Contact: info@accounticca.com</span>
                <span className="text-blue-600 font-semibold">www.accounticca.com</span>
              </div>

            </div>
          </AnimatedSection>

        </div>
      </div>
    </section>
  );
};
