import React from 'react';
import { EXPERTS_DATA } from '../data/consultancyData';
import { ExpertItem } from '../types';
import { AnimatedSection } from './AnimatedSection';
import { Linkedin, Award, Calendar, Sparkles, CheckCircle2, ExternalLink } from 'lucide-react';

interface ExpertsSectionProps {
  onOpenConsultation?: (note?: string) => void;
}

export const ExpertsSection: React.FC<ExpertsSectionProps> = ({ onOpenConsultation }) => {
  return (
    <section id="experts" className="py-24 bg-slate-900 text-white relative border-b border-slate-800 overflow-hidden">
      {/* Background radial glow effect */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-400/30 px-4 py-1.5 rounded-full text-blue-400 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            <span>Senior Leadership & Advisory</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-white tracking-tight leading-tight">
            Meet Our Senior Advisory Leadership
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Our multidisciplinary team brings senior executive experience across corporate accounting, legal compliance, tax strategy, and operational engineering.
          </p>
        </AnimatedSection>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {EXPERTS_DATA.map((expert, idx) => (
            <AnimatedSection
              key={expert.id}
              animation="fade-up"
              delay={idx * 100}
              className="h-full"
            >
              <div className="bg-slate-800/80 border border-slate-700/80 hover:border-blue-500/50 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl hover:shadow-blue-900/20 transition-all duration-300 flex flex-col justify-between group h-full">
                
                {/* Image Header with Overlay */}
                <div className="relative h-64 overflow-hidden bg-slate-950">
                  <img
                    src={expert.photoUrl}
                    alt={expert.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500 filter contrast-[1.03]"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

                  {/* LinkedIn Badge */}
                  <a
                    href={expert.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${expert.name} LinkedIn Profile`}
                    className="absolute top-4 right-4 bg-slate-900/80 hover:bg-blue-600 text-slate-300 hover:text-white p-2.5 rounded-full backdrop-blur-md border border-slate-700 hover:border-blue-400 transition shadow-lg group/link"
                    title="View LinkedIn Profile"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>

                  {/* Specialty Tag on Photo */}
                  <div className="absolute bottom-3 left-4 right-4">
                    <span className="inline-block bg-blue-950/80 border border-blue-400/30 text-blue-300 text-[11px] font-semibold px-2.5 py-1 rounded-full backdrop-blur-md truncate max-w-full">
                      {expert.specialty}
                    </span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-blue-300 transition">
                      {expert.name}
                    </h3>
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider">
                      {expert.role}
                    </p>
                    
                    <p className="text-xs text-slate-300 leading-relaxed pt-2">
                      {expert.bio}
                    </p>
                  </div>

                  {/* Credentials / Badges */}
                  <div className="space-y-3 pt-4 border-t border-slate-700/60">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1">
                        <Award className="w-3 h-3 text-amber-400" />
                        <span>Credentials & Qualifications</span>
                      </p>
                      <ul className="space-y-1">
                        {expert.credentials.map((cred, cIdx) => (
                          <li key={cIdx} className="text-[11px] text-slate-300 flex items-start space-x-1.5">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{cred}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Book with Expert Button */}
                    {onOpenConsultation && (
                      <button
                        onClick={() => onOpenConsultation(`Consultation request with ${expert.name}`)}
                        className="w-full mt-3 bg-slate-700/60 hover:bg-blue-600 text-slate-200 hover:text-white py-2.5 px-4 rounded-xl text-xs font-semibold border border-slate-600/80 hover:border-blue-400/50 transition flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Call with {expert.name.split(',')[0]}</span>
                      </button>
                    )}
                  </div>

                </div>

              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* E-Lawyers Synergy Trust Callout */}
        <AnimatedSection animation="fade-up" delay={400} className="mt-16 bg-gradient-to-r from-blue-950/60 via-slate-800/80 to-blue-950/60 border border-blue-500/30 rounded-2xl p-6 sm:p-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="text-base sm:text-lg font-serif font-bold text-white flex items-center justify-center sm:justify-start space-x-2">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span>Integrated Corporate Legal & Accounting Advisory</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl">
              All Accounticca senior advisors work in direct lockstep with E-Lawyers legal specialists to guarantee complete structural compliance and risk mitigation.
            </p>
          </div>

          {onOpenConsultation && (
            <button
              onClick={() => onOpenConsultation('Synergy Advisory Request')}
              className="px-5 py-3 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition whitespace-nowrap shadow-lg shadow-blue-600/30 shrink-0"
            >
              Request Advisory Meeting
            </button>
          )}
        </AnimatedSection>

      </div>
    </section>
  );
};
