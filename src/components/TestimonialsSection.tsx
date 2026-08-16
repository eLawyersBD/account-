import React, { useState, useEffect, useRef } from 'react';
import { TESTIMONIALS_DATA } from '../data/consultancyData';
import { TestimonialItem } from '../types';
import { AnimatedSection } from './AnimatedSection';
import { Star, ChevronLeft, ChevronRight, Quote, Sparkles, Building2, CheckCircle, Pause, Play } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const total = TESTIMONIALS_DATA.length;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  // Autoplay functionality
  useEffect(() => {
    if (isAutoplay) {
      timerRef.current = setInterval(() => {
        handleNext();
      }, 6000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isAutoplay, currentIndex]);

  const currentTestimonial = TESTIMONIALS_DATA[currentIndex];

  return (
    <section id="testimonials" className="py-24 bg-white text-slate-900 relative border-b border-slate-200 overflow-hidden">
      {/* Background ambient lighting subtle decoration */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-50/70 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-50/50 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Client Success Stories</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Trusted by Visionary Founders & Enterprise Leaders
          </h2>
          
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Read how Accounticca’s strategic advisory, financial engineering, and operational systems empower businesses to scale sustainably.
          </p>
        </AnimatedSection>

        {/* Carousel Container */}
        <AnimatedSection animation="fade-up" delay={150} className="max-w-5xl mx-auto">
          <div 
            className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl shadow-slate-200/50 relative overflow-hidden group"
            onMouseEnter={() => setIsAutoplay(false)}
            onMouseLeave={() => setIsAutoplay(true)}
          >
            {/* Watermark Quote Icon */}
            <Quote className="absolute top-6 right-8 w-28 h-28 text-slate-200/40 pointer-events-none -rotate-12" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              {/* Left Column: Client Avatar & Metrics */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-4">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border-2 border-white shadow-md ring-4 ring-blue-500/10 shrink-0 bg-slate-200">
                    <img
                      src={currentTestimonial.avatarUrl}
                      alt={currentTestimonial.clientName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback initials if image fails
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white p-1.5 rounded-lg shadow-sm">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-serif font-bold text-slate-900">
                    {currentTestimonial.clientName}
                  </h3>
                  <p className="text-xs font-semibold text-blue-700">
                    {currentTestimonial.clientRole}
                  </p>
                  <p className="text-xs text-slate-500">
                    {currentTestimonial.company}
                  </p>
                </div>

                <div className="pt-2">
                  <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-full">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{currentTestimonial.outcomeHighlight}</span>
                  </span>
                </div>
              </div>

              {/* Right Column: Rating & Quote Content */}
              <div className="lg:col-span-8 space-y-6 flex flex-col justify-between">
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    {/* Stars */}
                    <div className="flex items-center space-x-1">
                      {[...Array(currentTestimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>

                    <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      {currentTestimonial.industry}
                    </span>
                  </div>

                  <blockquote className="text-slate-800 text-lg sm:text-xl font-serif leading-relaxed italic">
                    "{currentTestimonial.quote}"
                  </blockquote>
                </div>

                {/* Controls & Pagination */}
                <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                  
                  {/* Dots Indicator */}
                  <div className="flex items-center space-x-2">
                    {TESTIMONIALS_DATA.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        aria-label={`Go to slide ${idx + 1}`}
                        className={`transition-all duration-300 rounded-full ${
                          currentIndex === idx
                            ? 'w-8 h-2.5 bg-blue-600'
                            : 'w-2.5 h-2.5 bg-slate-300 hover:bg-slate-400'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Navigation Buttons */}
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => setIsAutoplay(!isAutoplay)}
                      title={isAutoplay ? "Pause slideshow" : "Play slideshow"}
                      className="p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-white border border-transparent hover:border-slate-200 transition text-xs"
                    >
                      {isAutoplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    </button>

                    <button
                      onClick={handlePrev}
                      aria-label="Previous Testimonial"
                      className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-md flex items-center justify-center transition"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleNext}
                      aria-label="Next Testimonial"
                      className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-700 hover:text-blue-600 hover:border-blue-300 hover:shadow-md flex items-center justify-center transition"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </AnimatedSection>

        {/* Thumbnail Selector Grid below Carousel */}
        <AnimatedSection animation="fade-up" delay={250} className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {TESTIMONIALS_DATA.map((t, idx) => (
            <button
              key={t.id}
              onClick={() => setCurrentIndex(idx)}
              className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                currentIndex === idx
                  ? 'bg-blue-50/80 border-blue-400 ring-2 ring-blue-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 opacity-75 hover:opacity-100'
              }`}
            >
              <div>
                <p className="font-serif font-bold text-slate-900 truncate">{t.clientName}</p>
                <p className="text-[10px] text-slate-500 truncate">{t.company}</p>
              </div>
              <span className="text-[10px] font-semibold text-blue-600 mt-2 block truncate">
                {t.outcomeHighlight}
              </span>
            </button>
          ))}
        </AnimatedSection>

      </div>
    </section>
  );
};
