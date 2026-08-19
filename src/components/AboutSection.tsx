import React from 'react';
import { Shield, Target, CheckCircle2, Award, Briefcase, Lightbulb } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';
import { ImagePlaceholder } from './ImagePlaceholder';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-24 bg-white text-slate-800 relative border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Who We Are & E-Lawyers */}
          <AnimatedSection animation="fade-right" className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
              <span>About Accounticca</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
              Your Strategic Partner Beyond Legal Services
            </h2>

            <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed">
              Accounticca is a professional business consultancy firm dedicated to helping organizations overcome operational challenges, improve financial performance, and create scalable business models.
            </p>

            <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 mt-1">
                  <Briefcase className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">E-Lawyers Ecosystem Partner</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    As the business consultancy partner of the E-Lawyers ecosystem, Accounticca focuses on the areas beyond legal services — providing entrepreneurs and companies with strategic guidance, financial solutions, management support, and business development expertise.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <p className="text-sm text-slate-600 italic font-medium leading-relaxed">
                "We believe every successful business requires more than just an idea. It requires proper planning, efficient systems, financial discipline, skilled people, and continuous improvement."
              </p>
              <div className="text-xs text-blue-600 font-semibold tracking-wide uppercase">
                — Accounticca Core Philosophy
              </div>
            </div>

          </AnimatedSection>

          {/* Right Column: Mission & Core Pillars */}
          <AnimatedSection animation="fade-left" delay={150} className="lg:col-span-6 space-y-6">
            <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-xl shadow-slate-200/50 space-y-6">
              <ImagePlaceholder
                src="https://picsum.photos/seed/about-card/600/300"
                alt="About Accounticca"
                className="w-full h-48"
              />
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900">Our Mission</h3>
                  <p className="text-sm text-blue-600 font-medium">To transform business challenges into growth opportunities.</p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-6 space-y-4">
                <h4 className="text-sm font-semibold text-slate-900 uppercase tracking-wider">What Drives Our Approach:</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm mb-1">
                      <Lightbulb className="w-4 h-4" />
                      <span>Proper Planning</span>
                    </div>
                    <p className="text-xs text-slate-500">Structured roadmaps, business plans, and financial projection modeling.</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm mb-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Efficient Systems</span>
                    </div>
                    <p className="text-xs text-slate-500">Process optimization, SOPs, and modern business automation tools.</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm mb-1">
                      <Award className="w-4 h-4" />
                      <span>Financial Discipline</span>
                    </div>
                    <p className="text-xs text-slate-500">Accurate bookkeeping, cash flow control, and management reporting.</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
                    <div className="flex items-center space-x-2 text-blue-600 font-semibold text-sm mb-1">
                      <Shield className="w-4 h-4" />
                      <span>Skilled Teams</span>
                    </div>
                    <p className="text-xs text-slate-500">Organizational structure design, KPIs, and HR performance systems.</p>
                  </div>
                </div>

              </div>

            </div>
          </AnimatedSection>

        </div>

      </div>
    </section>
  );
};
