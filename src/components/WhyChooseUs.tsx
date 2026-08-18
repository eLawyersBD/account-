import React from 'react';
import { Award, Target, Layers, Sliders, Handshake, CheckCircle } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

export const WhyChooseUs: React.FC = () => {
  const reasons = [
    {
      title: 'Experienced Professionals',
      description: 'Our consultants combine practical business experience with professional advisory expertise.',
      icon: <Award className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Business-Focused Approach',
      description: 'We focus strictly on solutions that create measurable business improvement and bottom-line impact.',
      icon: <Target className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Complete Business Understanding',
      description: 'From finance and bookkeeping to operations and HR, we analyze the complete business ecosystem.',
      icon: <Layers className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Customized Solutions',
      description: 'Every business is unique. Our solutions are custom-designed according to your specific goals and budget.',
      icon: <Sliders className="w-6 h-6 text-blue-600" />
    },
    {
      title: 'Long-Term Partnership',
      description: 'We do not just advise and leave; we work as an extended, committed partner of your organization.',
      icon: <Handshake className="w-6 h-6 text-blue-600" />
    }
  ];

  return (
    <section id="why-choose-us" className="py-24 bg-slate-50 text-slate-900 relative border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <span>Why Choose Accounticca</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            More Than Consultancy — We Become Your Growth Partner
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Discover why entrepreneurs, startups, and established enterprises across industries trust Accounticca for their strategic evolution.
          </p>
        </AnimatedSection>

        {/* Reasons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((item, idx) => (
            <AnimatedSection
              key={idx}
              animation="fade-up"
              delay={(idx % 3) * 100}
              duration={600}
            >
              <div
                className="bg-white border border-slate-200 rounded-2xl hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 space-y-0 h-full overflow-hidden"
              >
                <img
                  src={`https://picsum.photos/seed/${idx}/400/200`}
                  alt={item.title}
                  className="w-full h-40 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-6 space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-serif font-bold text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}

          {/* E-Lawyers Partnership Highlight Card */}
          <AnimatedSection animation="fade-up" delay={200} duration={600}>
            <div className="bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-blue-200 rounded-2xl p-6 shadow-md space-y-4 flex flex-col justify-between h-full">
              <div>
                <div className="inline-block bg-blue-600 text-white font-bold text-[10px] uppercase px-2.5 py-1 rounded-full mb-3">
                  E-Lawyers Ecosystem
                </div>
                <h3 className="text-xl font-serif font-bold text-slate-900">Seamless Advisory Integration</h3>
                <p className="text-slate-600 text-sm leading-relaxed mt-2">
                  Need corporate legal structuring or compliance alongside business growth? Seamlessly coordinate with the E-Lawyers ecosystem for complete 360-degree coverage.
                </p>
              </div>
              <div className="flex items-center space-x-2 text-blue-600 text-xs font-semibold">
                <CheckCircle className="w-4 h-4" />
                <span>Unified Business & Legal Synergy</span>
              </div>
            </div>
          </AnimatedSection>
        </div>

      </div>
    </section>
  );
};
