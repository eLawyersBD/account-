import React from 'react';
import { PACKAGES_DATA } from '../data/consultancyData';
import { CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

interface PackagesSectionProps {
  onSelectPackage: (packageName: string) => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({ onSelectPackage }) => {
  return (
    <section id="packages" className="py-24 bg-slate-50 text-slate-900 relative border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Tailored Consultancy Plans</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Business Consultancy Packages
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Choose a structured advisory package designed for your business stage, or request a custom-tailored enterprise solution.
          </p>
        </AnimatedSection>

        {/* Packages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PACKAGES_DATA.map((pkg, idx) => (
            <AnimatedSection
              key={pkg.id}
              animation={pkg.popular ? "zoom-in" : "fade-up"}
              delay={idx * 150}
              duration={650}
              className="h-full"
            >
              <div
                className={`rounded-2xl p-8 flex flex-col justify-between relative transition-all duration-300 shadow-xl h-full ${
                  pkg.popular
                    ? 'bg-white border-2 border-blue-600 shadow-xl shadow-blue-500/10 lg:scale-105 z-10'
                    : 'bg-white border border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1 rounded-full shadow-md">
                    Most Popular for SMEs
                  </div>
                )}

                <div className="space-y-6">
                  <div>
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">{pkg.targetAudience}</span>
                    <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">{pkg.name}</h3>
                    <p className="text-slate-600 text-sm mt-2 leading-relaxed">{pkg.description}</p>
                  </div>

                  <div className="border-t border-slate-200 pt-6 space-y-3">
                    <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Includes:</div>
                    <ul className="space-y-3">
                      {pkg.features.map((feat, featureIdx) => (
                        <li key={featureIdx} className="flex items-start space-x-3 text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-200">
                  <button
                    onClick={() => onSelectPackage(pkg.name)}
                    className={`w-full py-3.5 rounded-full font-bold text-sm transition flex items-center justify-center space-x-2 ${
                      pkg.popular
                        ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-200'
                    }`}
                  >
                    <span>Inquire About {pkg.name}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

              </div>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
};
