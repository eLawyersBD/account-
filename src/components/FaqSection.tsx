import React, { useState } from 'react';
import { FAQ_DATA } from '../data/consultancyData';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

interface FaqSectionProps {
  openFaqIndex?: number | null;
}

export const FaqSection: React.FC<FaqSectionProps> = ({ openFaqIndex }) => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  React.useEffect(() => {
    if (openFaqIndex !== undefined && openFaqIndex !== null) {
      setOpenIdx(openFaqIndex);
    }
  }, [openFaqIndex]);

  const toggleFaq = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  // Construct Google-compliant JSON-LD FAQPage & ProfessionalService Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': FAQ_DATA.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };

  const businessSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Accounticca - Business Consultancy & Growth Advisory',
    'url': 'https://accounticca.com',
    'logo': 'https://accounticca.com/logo.png',
    'description': 'Accounticca provides professional business consultancy, financial advisory, bookkeeping, and operational growth strategies as an official E-Lawyers ecosystem partner.',
    'parentOrganization': {
      '@type': 'Organization',
      'name': 'E-Lawyers Ecosystem'
    },
    'areaServed': 'Worldwide',
    'serviceType': [
      'Business Startup Consultancy',
      'Business Planning & Strategy',
      'Accounting & Financial Advisory',
      'Bookkeeping Services',
      'Business Process Optimization',
      'Business Automation Consultancy',
      'HR & Organizational Advisory'
    ]
  };

  return (
    <section id="faq" className="py-24 bg-white text-slate-900 relative border-b border-slate-200 overflow-hidden">
      {/* Dynamic JSON-LD SEO Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(businessSchema) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Everything you need to know about Accounticca’s consultancy services, E-Lawyers ecosystem partnership, and advisory process.
          </p>
        </AnimatedSection>

        {/* FAQ Accordion */}
        <div className="space-y-4">
          {FAQ_DATA.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <AnimatedSection key={idx} animation="fade-up" delay={idx * 80} duration={500}>
                <div
                  className="bg-white border border-slate-200 rounded-2xl overflow-hidden transition shadow-sm hover:border-slate-300"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full text-left p-6 flex items-center justify-between space-x-4 hover:bg-slate-50 transition"
                  >
                    <span className="text-base sm:text-lg font-serif font-semibold text-slate-900">{faq.question}</span>
                    <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-center text-blue-600 shrink-0">
                      {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-slate-600 text-sm leading-relaxed border-t border-slate-100 pt-4 animate-fadeIn">
                      {faq.answer}
                    </div>
                  )}
                </div>
              </AnimatedSection>
            );
          })}
        </div>

      </div>
    </section>
  );
};
