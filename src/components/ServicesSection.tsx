import React, { useState } from 'react';
import { SERVICES_DATA } from '../data/consultancyData';
import { ServiceItem } from '../types';
import { AnimatedSection } from './AnimatedSection';
import { 
  Rocket, Target, TrendingUp, BookOpen, Cog, Cpu, Users, Megaphone, Building2, Briefcase, 
  ArrowRight, Check, X, Sparkles 
} from 'lucide-react';

interface ServicesSectionProps {
  onSelectServiceForConsultation: (serviceName: string) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ onSelectServiceForConsultation }) => {
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  // Construct JSON-LD Structured Data for Accounticca Business Services
  const servicesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Accounticca Strategic Advisory & Consultancy',
    'image': 'https://accounticca-advisory.com/logo.png',
    'url': 'https://accounticca-advisory.com',
    'telephone': '+1-800-ACCOUNTICCA',
    'priceRange': '$$$',
    'address': {
      '@type': 'PostalAddress',
      'streetAddress': '100 Wall Street, Suite 2400',
      'addressLocality': 'New York',
      'addressRegion': 'NY',
      'postalCode': '10005',
      'addressCountry': 'US',
    },
    'hasOfferCatalog': {
      '@type': 'OfferCatalog',
      'name': 'Business Advisory & Financial Consulting Services',
      'itemListElement': SERVICES_DATA.map((service, index) => ({
        '@type': 'Offer',
        'itemOffered': {
          '@type': 'Service',
          'name': service.title,
          'description': service.description,
          'provider': {
            '@type': 'ProfessionalService',
            'name': 'Accounticca Advisory',
          },
        },
        'position': index + 1,
      })),
    },
  };

  const getServiceIconDetails = (iconName: string) => {
    switch (iconName) {
      case 'Rocket':
        return {
          icon: <Rocket className="w-6 h-6 text-blue-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-blue-50/90 border-blue-200/90 text-blue-700',
        };
      case 'Target':
        return {
          icon: <Target className="w-6 h-6 text-indigo-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-indigo-50/90 border-indigo-200/90 text-indigo-700',
        };
      case 'TrendingUp':
        return {
          icon: <TrendingUp className="w-6 h-6 text-emerald-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-emerald-50/90 border-emerald-200/90 text-emerald-700',
        };
      case 'BookOpen':
        return {
          icon: <BookOpen className="w-6 h-6 text-amber-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-amber-50/90 border-amber-200/90 text-amber-700',
        };
      case 'Cog':
        return {
          icon: <Cog className="w-6 h-6 text-purple-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-purple-50/90 border-purple-200/90 text-purple-700',
        };
      case 'Cpu':
        return {
          icon: <Cpu className="w-6 h-6 text-cyan-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-cyan-50/90 border-cyan-200/90 text-cyan-700',
        };
      case 'Users':
        return {
          icon: <Users className="w-6 h-6 text-rose-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-rose-50/90 border-rose-200/90 text-rose-700',
        };
      case 'Megaphone':
        return {
          icon: <Megaphone className="w-6 h-6 text-orange-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-orange-50/90 border-orange-200/90 text-orange-700',
        };
      case 'Building2':
        return {
          icon: <Building2 className="w-6 h-6 text-teal-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-teal-50/90 border-teal-200/90 text-teal-700',
        };
      case 'Briefcase':
      default:
        return {
          icon: <Briefcase className="w-6 h-6 text-violet-600 group-hover:scale-110 transition-transform duration-300" />,
          container: 'bg-violet-50/90 border-violet-200/90 text-violet-700',
        };
    }
  };

  return (
    <section id="services" className="py-24 bg-slate-50 text-slate-900 relative border-b border-slate-200 overflow-hidden">
      {/* Dynamic JSON-LD SEO Schema Markup for Services */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Comprehensive Business Advisory</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Our Core Services
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            From business startup consultancy and financial advisory to process optimization, automation, and SME growth strategies — we provide the expertise your business needs at every stage.
          </p>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES_DATA.map((service, index) => {
            const iconDetails = getServiceIconDetails(service.icon);
            return (
              <AnimatedSection
                key={service.id}
                animation="fade-up"
                delay={(index % 3) * 100}
                duration={600}
                className="h-full"
              >
                <div
                  id={service.id}
                  className="service-card scroll-mt-28 bg-white border border-slate-200/90 rounded-2xl hover:border-blue-500/50 transition-all duration-300 flex flex-col justify-between shadow-xs hover:shadow-xl hover:shadow-blue-500/10 group hover:-translate-y-1.5 h-full overflow-hidden"
                >
                  {/* Service Card Image Header */}
                  {service.imageUrl && (
                    <div className="relative h-44 sm:h-48 w-full overflow-hidden bg-slate-100">
                      <img
                        src={service.imageUrl}
                        alt={service.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-900/20 to-transparent" />
                      
                      <div className="absolute top-3 right-3">
                        <span className="text-[11px] font-bold tracking-wider uppercase text-blue-800 bg-white/90 backdrop-blur-md border border-white/60 px-2.5 py-1 rounded-full shadow-sm">
                          Advisory
                        </span>
                      </div>

                      <div className="absolute bottom-3 left-3">
                        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center transition shadow-md ${iconDetails.container}`}>
                          {iconDetails.icon}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      {!service.imageUrl && (
                        <div className="flex items-center justify-between mb-2">
                          <div className={`w-12 h-12 rounded-xl border flex items-center justify-center transition shadow-2xs ${iconDetails.container}`}>
                            {iconDetails.icon}
                          </div>
                          <span className="text-[11px] font-bold tracking-wider uppercase text-blue-700 bg-blue-50/90 border border-blue-200/80 px-2.5 py-1 rounded-full shadow-2xs">
                            Advisory
                          </span>
                        </div>
                      )}

                      <div>
                        <h3 className="text-xl font-serif font-bold text-slate-900 group-hover:text-blue-700 transition mb-1 leading-snug">
                          {service.title}
                        </h3>
                        <p className="text-xs font-semibold text-blue-600 mb-2">{service.tagline}</p>
                        <p className="text-slate-600 text-xs sm:text-sm leading-relaxed line-clamp-3">
                          {service.description}
                        </p>
                      </div>

                      <div className="space-y-2 pt-2 border-t border-slate-200/80">
                        <div className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">Key Deliverables:</div>
                        <ul className="space-y-1.5 text-xs text-slate-600">
                          {service.features.slice(0, 3).map((feat, idx) => (
                            <li key={idx} className="flex items-center space-x-2">
                              <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                              <span className="truncate">{feat}</span>
                            </li>
                          ))}
                          {service.features.length > 3 && (
                            <li className="text-slate-400 text-[11px] italic pl-5">
                              + {service.features.length - 3} more specialized items
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                      <button
                        onClick={() => setSelectedService(service)}
                        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1 transition"
                      >
                        <span>View Full Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => onSelectServiceForConsultation(service.title)}
                        className="px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white text-xs font-semibold transition"
                      >
                        Inquire
                      </button>
                    </div>
                  </div>

              </div>
            </AnimatedSection>
          );
        })}
        </div>

      </div>

      {/* Service Details Modal */}
      {selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl relative space-y-6">
            
            {selectedService.imageUrl && (
              <div className="relative h-48 sm:h-56 -mx-6 -mt-6 sm:-mx-8 sm:-mt-8 mb-6 overflow-hidden rounded-t-2xl bg-slate-100">
                <img
                  src={selectedService.imageUrl}
                  alt={selectedService.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-transparent" />
                <button
                  onClick={() => setSelectedService(null)}
                  className="absolute top-4 right-4 p-2 bg-slate-900/60 hover:bg-slate-900 text-white rounded-full transition shadow-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            {!selectedService.imageUrl && (
              <button
                onClick={() => setSelectedService(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="flex items-center space-x-4">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition shadow-2xs ${getServiceIconDetails(selectedService.icon).container}`}>
                {getServiceIconDetails(selectedService.icon).icon}
              </div>
              <div>
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Accounticca Service</span>
                <h3 className="text-2xl font-serif font-bold text-slate-900">{selectedService.title}</h3>
                <p className="text-xs text-slate-600 font-medium">{selectedService.tagline}</p>
              </div>
            </div>

            <div className="space-y-4 text-slate-600 text-sm leading-relaxed border-t border-slate-200 pt-4">
              <p>{selectedService.description}</p>
              
              {selectedService.idealFor && (
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <span className="font-semibold text-blue-600">Ideal For: </span>
                  <span className="text-slate-700">{selectedService.idealFor}</span>
                </div>
              )}

              <div>
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Complete Services Include:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {selectedService.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start space-x-2.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                      <Check className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-800">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-end space-x-3">
              <button
                onClick={() => setSelectedService(null)}
                className="px-4 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-medium transition"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const title = selectedService.title;
                  setSelectedService(null);
                  onSelectServiceForConsultation(title);
                }}
                className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition shadow-md shadow-blue-500/20"
              >
                Book Consultation for this Service
              </button>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
