import React from 'react';
import { INDUSTRIES_DATA } from '../data/consultancyData';
import { AnimatedSection } from './AnimatedSection';
import { Rocket, ShoppingCart, Factory, Smile, Truck, Scale, Building2, CheckCircle2 } from 'lucide-react';

export const IndustriesSection: React.FC = () => {
  const getIndustryIcon = (iconName: string) => {
    switch (iconName) {
      case 'Rocket': return <Rocket className="w-6 h-6 text-blue-600" />;
      case 'ShoppingCart': return <ShoppingCart className="w-6 h-6 text-blue-600" />;
      case 'Factory': return <Factory className="w-6 h-6 text-blue-600" />;
      case 'Smile': return <Smile className="w-6 h-6 text-blue-600" />;
      case 'Truck': return <Truck className="w-6 h-6 text-blue-600" />;
      case 'Scale': return <Scale className="w-6 h-6 text-blue-600" />;
      default: return <Building2 className="w-6 h-6 text-blue-600" />;
    }
  };

  return (
    <section id="industries" className="py-24 bg-white text-slate-900 relative border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <span>Industry Expertise</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Supporting Businesses Across Industries
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Every sector has unique operational and financial nuances. Our consultants bring cross-industry domain expertise tailored to your specific ecosystem.
          </p>
        </AnimatedSection>

        {/* Industries Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {INDUSTRIES_DATA.map((ind, index) => (
            <AnimatedSection
              key={ind.id}
              animation="fade-up"
              delay={(index % 3) * 100}
              duration={600}
            >
              <div
                className="bg-white border border-slate-200 rounded-2xl hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 space-y-0 group h-full overflow-hidden"
              >
                <img
                  src={`https://picsum.photos/seed/${ind.id}/400/200`}
                  alt={ind.title}
                  className="w-full h-40 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center group-hover:bg-blue-50 group-hover:border-blue-200 transition">
                    {getIndustryIcon(ind.icon)}
                  </div>

                  <div>
                    <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-blue-600 transition mb-2">
                      {ind.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {ind.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-200 flex items-center space-x-2 text-xs text-blue-600 font-medium">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{ind.keyMetrics}</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

      </div>
    </section>
  );
};
