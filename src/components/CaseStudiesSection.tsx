import React, { useState } from 'react';
import { CASE_STUDIES } from '../data/consultancyData';
import { CaseStudyItem } from '../types';
import { AnimatedSection } from './AnimatedSection';
import {
  Briefcase,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  AlertTriangle,
  Lightbulb,
  ArrowUpRight,
  Filter,
  X,
  Clock,
  Quote,
  Layers,
  Building2,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CaseStudiesSectionProps {
  onOpenConsultation: (note?: string) => void;
}

export const CaseStudiesSection: React.FC<CaseStudiesSectionProps> = ({ onOpenConsultation }) => {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [activeModalStudy, setActiveModalStudy] = useState<CaseStudyItem | null>(null);

  const filterCategories = [
    { id: 'all', label: 'All Case Studies' },
    { id: 'Technology / SaaS', label: 'Tech & SaaS' },
    { id: 'Manufacturing & Industrial', label: 'Manufacturing' },
    { id: 'E-Commerce & Retail', label: 'E-Commerce' },
    { id: 'Logistics & Fleet', label: 'Logistics' },
    { id: 'Healthcare Services', label: 'Healthcare' },
    { id: 'Professional Services', label: 'Professional Services' }
  ];

  const filteredStudies = selectedIndustry === 'all'
    ? CASE_STUDIES
    : CASE_STUDIES.filter(cs => cs.industry === selectedIndustry);

  return (
    <section id="casestudies" className="py-24 bg-slate-50 text-slate-900 relative border-b border-slate-200 overflow-hidden">
      {/* Background Decorative Accent Gradients */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-slate-200/50 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center space-x-2 bg-blue-50 border border-blue-200 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Proven Advisory Impact</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Client Success Stories & Detailed Case Studies
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Discover how Accounticca partners with startups, SMEs, and corporate enterprises to solve complex financial bottlenecks, automate operations, and achieve measurable growth outcomes.
          </p>
        </AnimatedSection>

        {/* Industry Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          <div className="hidden sm:flex items-center space-x-1.5 text-xs text-slate-500 font-medium mr-2">
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span>Filter by Sector:</span>
          </div>
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedIndustry(cat.id)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 cursor-pointer ${
                selectedIndustry === cat.id
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25 scale-105'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80 shadow-2xs'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStudies.map((cs, idx) => (
            <AnimatedSection
              key={cs.id}
              animation="fade-up"
              delay={idx * 100}
              duration={500}
              className="h-full"
            >
              <div
                className="bg-white border border-slate-200/90 rounded-2xl p-6.5 hover:border-blue-500/60 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-blue-500/10 space-y-6 h-full group relative"
              >
                <div className="space-y-5">
                  
                  {/* Card Header Badges */}
                  <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200/60 px-2.5 py-1 rounded-md uppercase tracking-wide">
                      {cs.industry}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 flex items-center space-x-1 bg-slate-100/80 px-2.5 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{cs.timeframe}</span>
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                      {cs.clientType}
                    </h3>
                    <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0 group-hover:scale-110 transition-transform">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Hero Outcome Highlight Box */}
                  <div className="bg-gradient-to-r from-slate-900 to-blue-950 p-4 rounded-xl text-white shadow-inner flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold block">Key Impact</span>
                      <span className="text-lg font-extrabold font-mono text-emerald-400">{cs.heroMetric}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-slate-300 font-bold block">Validated Result</span>
                      <span className="text-xs font-bold text-blue-200">{cs.keyOutcomeValue}</span>
                    </div>
                  </div>

                  {/* Structured Challenge & Solution Blocks */}
                  <div className="space-y-3">
                    
                    {/* The Challenge */}
                    <div className="bg-rose-50/80 p-3.5 rounded-xl border border-rose-200/70 text-xs">
                      <div className="flex items-center space-x-1.5 mb-1.5 text-rose-700 font-bold text-[11px] uppercase tracking-wider">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                        <span>The Business Challenge:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-normal">{cs.challenge}</p>
                    </div>

                    {/* Accounticca Solution */}
                    <div className="bg-blue-50/80 p-3.5 rounded-xl border border-blue-200/70 text-xs">
                      <div className="flex items-center space-x-1.5 mb-1.5 text-blue-700 font-bold text-[11px] uppercase tracking-wider">
                        <Lightbulb className="w-3.5 h-3.5 shrink-0" />
                        <span>Accounticca Strategy & Solution:</span>
                      </div>
                      <p className="text-slate-700 leading-relaxed font-normal">{cs.solution}</p>
                    </div>

                  </div>

                  {/* Measurable Business Outcomes */}
                  <div className="space-y-2.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-800 uppercase tracking-wider block flex items-center space-x-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Measurable Business Outcomes:</span>
                    </span>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {cs.results.map((res, resIdx) => (
                        <li key={resIdx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-snug">{res}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  {cs.tags && cs.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2 border-t border-slate-100">
                      {cs.tags.map((tag, tagIdx) => (
                        <span key={tagIdx} className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Optional Quote Excerpt */}
                  {cs.clientQuote && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 italic text-[11px] text-slate-600 relative">
                      <Quote className="w-3 h-3 text-blue-500 inline mr-1" />
                      <span>"{cs.clientQuote.quote}"</span>
                      <p className="not-italic font-bold text-slate-800 text-[10px] mt-1 text-right">— {cs.clientQuote.author}</p>
                    </div>
                  )}

                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 border-t border-slate-100 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setActiveModalStudy(cs)}
                      className="py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Full Case Details</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
                    </button>
                    <button
                      onClick={() => onOpenConsultation(`Achieve results similar to ${cs.clientType} (${cs.industry})`)}
                      className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition flex items-center justify-center space-x-1 cursor-pointer"
                    >
                      <span>Achieve Results</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Detailed Modal Dialog */}
        <AnimatePresence>
          {activeModalStudy && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-200"
              >
                <button
                  onClick={() => setActiveModalStudy(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 bg-slate-100 p-2 rounded-full cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="space-y-6">
                  {/* Modal Header */}
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-md uppercase">
                        {activeModalStudy.industry}
                      </span>
                      <span className="text-xs text-slate-500">{activeModalStudy.timeframe}</span>
                    </div>
                    <h3 className="text-2xl font-serif font-bold text-slate-900">{activeModalStudy.clientType}</h3>
                  </div>

                  {/* Impact Summary Banner */}
                  <div className="bg-slate-900 text-white p-5 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 uppercase font-semibold">Primary Metric Shift</span>
                      <p className="text-2xl font-extrabold text-emerald-400 font-mono">{activeModalStudy.heroMetric}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 uppercase font-semibold">Validated Outcome</span>
                      <p className="text-base font-bold text-blue-200">{activeModalStudy.keyOutcomeValue}</p>
                    </div>
                  </div>

                  {/* Challenge Deep Dive */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600" />
                      <span>The Operational & Financial Bottleneck</span>
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-rose-50/60 p-4 rounded-xl border border-rose-200/80">
                      {activeModalStudy.challenge}
                    </p>
                  </div>

                  {/* Solution Deep Dive */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-blue-600" />
                      <span>Accounticca Advisory Roadmap & Implementation</span>
                    </h4>
                    <p className="text-sm text-slate-600 leading-relaxed bg-blue-50/60 p-4 rounded-xl border border-blue-200/80">
                      {activeModalStudy.solution}
                    </p>
                  </div>

                  {/* Outcome Breakdown */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-slate-900 text-sm flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Quantified Business Results</span>
                    </h4>
                    <div className="space-y-2 bg-slate-50 p-4 rounded-xl border border-slate-200">
                      {activeModalStudy.results.map((r, idx) => (
                        <div key={idx} className="flex items-start space-x-2 text-xs text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quote if present */}
                  {activeModalStudy.clientQuote && (
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-200/60 italic text-xs text-slate-700">
                      <p>"{activeModalStudy.clientQuote.quote}"</p>
                      <p className="not-italic font-bold text-slate-900 text-right mt-2">
                        — {activeModalStudy.clientQuote.author}, <span className="text-slate-500 font-normal">{activeModalStudy.clientQuote.role}</span>
                      </p>
                    </div>
                  )}

                  {/* Modal CTA */}
                  <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-4">
                    <button
                      onClick={() => setActiveModalStudy(null)}
                      className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 cursor-pointer"
                    >
                      Close Window
                    </button>
                    <button
                      onClick={() => {
                        const note = `Consultation request based on ${activeModalStudy.clientType} (${activeModalStudy.industry})`;
                        setActiveModalStudy(null);
                        onOpenConsultation(note);
                      }}
                      className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-600/25 flex items-center space-x-2 cursor-pointer"
                    >
                      <span>Book Consultation for Similar Growth</span>
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
