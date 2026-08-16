import React from 'react';
import { ShieldCheck, Award, Building2, TrendingUp, Users, CheckCircle2 } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

interface ClientBrand {
  name: string;
  category: string;
  logoSvg: React.ReactNode;
}

export const TrustedByCarousel: React.FC = () => {
  const brands: ClientBrand[] = [
    {
      name: 'Nexus Ventures',
      category: 'Venture Capital',
      logoSvg: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="9" className="stroke-blue-400" />
          <path d="M12 3v18M3 12h18" className="stroke-blue-500" />
          <circle cx="12" cy="12" r="3" className="fill-blue-400" />
        </svg>
      ),
    },
    {
      name: 'Apex Fintech',
      category: 'Banking & Financial',
      logoSvg: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" className="stroke-amber-400" />
        </svg>
      ),
    },
    {
      name: 'CloudScale',
      category: 'Enterprise SaaS',
      logoSvg: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.5 19H9a7 7 0 116.71-9h1.79a4.5 4.5 0 110 9z" className="stroke-cyan-400" />
        </svg>
      ),
    },
    {
      name: 'Vertex Global',
      category: 'International Trade',
      logoSvg: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" className="stroke-indigo-400" />
          <path d="M12 8v8M8 12h8" className="stroke-indigo-300" />
        </svg>
      ),
    },
    {
      name: 'Horizon Health',
      category: 'Healthcare Tech',
      logoSvg: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 12h-4l-3 9L9 3l-3 9H2" className="stroke-emerald-400" />
        </svg>
      ),
    },
    {
      name: 'Elevate Commerce',
      category: 'Retail & E-Com',
      logoSvg: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" className="stroke-purple-400" />
          <line x1="3" y1="6" x2="21" y2="6" className="stroke-purple-300" />
          <path d="M16 10a4 4 0 01-8 0" className="stroke-purple-400" />
        </svg>
      ),
    },
    {
      name: 'Stellar Logistics',
      category: 'Supply Chain',
      logoSvg: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="1" y="3" width="15" height="13" className="stroke-blue-400" />
          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" className="stroke-blue-300" />
          <circle cx="5.5" cy="18.5" r="2.5" className="stroke-amber-400" />
          <circle cx="18.5" cy="18.5" r="2.5" className="stroke-amber-400" />
        </svg>
      ),
    },
    {
      name: 'Aether Robotics',
      category: 'DeepTech & AI',
      logoSvg: (
        <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" className="stroke-amber-400 fill-amber-400/20" />
        </svg>
      ),
    },
  ];

  // Repeat for continuous infinite scrolling marquee effect
  const doubleBrands = [...brands, ...brands];

  return (
    <section className="bg-slate-900 border-y border-slate-800/80 py-10 overflow-hidden relative">
      <AnimatedSection animation="fade-up">
        {/* Background Subtle Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-800/60 pb-5">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-bold text-blue-400">Proven Executive Impact</p>
              <h3 className="text-sm sm:text-base font-serif font-bold text-white">
                Trusted by 500+ High-Growth Enterprises & Family Offices
              </h3>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-400 font-medium">
            <span className="flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>99.4% Client Retention</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              <span>ISO 9001 Certified</span>
            </span>
          </div>
        </div>
      </div>

      {/* Infinite Logo Carousel Container */}
      <div className="relative w-full overflow-hidden group">
        {/* Gradient Fades for Left and Right Edges */}
        <div className="absolute top-0 bottom-0 left-0 w-16 sm:w-32 bg-gradient-to-r from-slate-900 to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 bottom-0 right-0 w-16 sm:w-32 bg-gradient-to-l from-slate-900 to-transparent z-10 pointer-events-none" />

        {/* Marquee Track */}
        <div className="flex space-x-6 sm:space-x-8 animate-marquee group-hover:[animation-play-state:paused] w-max">
          {doubleBrands.map((brand, idx) => (
            <div
              key={idx}
              className="flex items-center space-x-3 bg-slate-800/40 hover:bg-slate-800/80 border border-slate-700/50 hover:border-blue-500/50 px-5 py-3 rounded-2xl transition-all duration-300 cursor-pointer shadow-xs group/item"
            >
              {brand.logoSvg}
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-200 group-hover/item:text-white transition-colors">
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-400 font-medium group-hover/item:text-blue-300 transition-colors">
                  {brand.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      </AnimatedSection>
    </section>
  );
};
