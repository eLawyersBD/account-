import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, MapPin, ShieldCheck, Clock, Users, ArrowUpRight, CheckCircle2, Building, Sparkles } from 'lucide-react';
import { AnimatedSection } from './AnimatedSection';

interface RegionHub {
  id: string;
  name: string;
  location: string;
  coords: { x: number; y: number }; // Percentage for SVG map plot
  advisorsCount: number;
  timezones: string;
  activeClients: number;
  compliance: string[];
  keyIndustries: string[];
  description: string;
}

const REGIONAL_HUBS: RegionHub[] = [
  {
    id: 'na',
    name: 'North America Hub',
    location: 'New York & Silicon Valley',
    coords: { x: 23, y: 35 },
    advisorsCount: 18,
    timezones: 'EST / PST (24/7 Desk)',
    activeClients: 140,
    compliance: ['SEC Regulations', 'SOX Compliance', 'Delaware Corporate Law', 'US GAAP'],
    keyIndustries: ['Enterprise SaaS', 'Fintech', 'Biotech', 'Venture Capital'],
    description: 'Serving US and Canadian scaleups with cross-border tax structuring, SEC filings, and Series A-D fundraising strategy.',
  },
  {
    id: 'eu',
    name: 'Europe & UK Hub',
    location: 'London & Frankfurt',
    coords: { x: 48, y: 28 },
    advisorsCount: 22,
    timezones: 'GMT / CET',
    activeClients: 195,
    compliance: ['GDPR', 'IFRS Standards', 'UK Companies House', 'EU AI Act Governance'],
    keyIndustries: ['Cross-Border E-Commerce', 'Fintech', 'Industrial Tech', 'ESG & Energy'],
    description: 'Providing European expansion blueprints, GDPR data governance, and IFRS-aligned financial reporting.',
  },
  {
    id: 'me',
    name: 'Middle East Hub',
    location: 'Dubai & Riyadh',
    coords: { x: 62, y: 44 },
    advisorsCount: 12,
    timezones: 'GST (UTC+4)',
    activeClients: 85,
    compliance: ['DIFC Law', 'ADGM Regulations', 'ZATCA E-Invoicing', 'Sharia Corporate Governance'],
    keyIndustries: ['Real Estate Tech', 'International Trade', 'Family Office Restructuring', 'Logistics'],
    description: 'Advising Gulf Region enterprises on holding company setups, DIFC court compliance, and sovereign growth funds.',
  },
  {
    id: 'ap',
    name: 'Asia-Pacific Hub',
    location: 'Singapore & Sydney',
    coords: { x: 80, y: 62 },
    advisorsCount: 16,
    timezones: 'SGT / AEST',
    activeClients: 110,
    compliance: ['MAS Regulatory Framework', 'ACRA Singapore', 'ASIC Compliance', 'Cross-Border Treaties'],
    keyIndustries: ['Supply Chain', 'Fintech Payments', 'Web3 Corporate Structuring', 'EdTech'],
    description: 'Key gateway for ASEAN & ANZ market entry, IP holding structures, and Asia-Pacific treasury management.',
  },
];

interface ServiceCoverageMapProps {
  onSelectRegionConsultation?: (regionName: string) => void;
}

export const ServiceCoverageMap: React.FC<ServiceCoverageMapProps> = ({ onSelectRegionConsultation }) => {
  const [activeHub, setActiveHub] = useState<RegionHub>(REGIONAL_HUBS[0]);

  return (
    <section id="coverage" className="py-24 bg-slate-900 text-slate-100 relative border-b border-slate-800 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-full text-blue-400 text-xs font-medium tracking-wide uppercase">
            <Globe className="w-4 h-4 text-blue-400" />
            <span>Global Remote Reach</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white tracking-tight">
            International Advisory Coverage
          </h2>
          <p className="text-slate-400 text-base">
            Accounticca operates remote consulting desks across key financial capitals worldwide — delivering cross-border compliance, multi-currency financial models, and strategic market entry guidance.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Interactive Vector Map Visualizer */}
          <AnimatedSection animation="fade-up" duration={600} className="lg:col-span-7">
            <div className="bg-slate-950/80 border border-slate-800 rounded-3xl p-6 sm:p-8 relative shadow-2xl overflow-hidden group">
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Live Global Network</span>
                </div>
                <span className="text-xs text-slate-400">Click a hub dot to inspect regional capability</span>
              </div>

              {/* Map SVG Canvas */}
              <div className="relative w-full aspect-[16/9] bg-slate-900/40 rounded-2xl border border-slate-800/80 p-4 overflow-hidden">
                
                {/* Stylized Grid Lines Background */}
                <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="grid-pattern" width="30" height="30" patternUnits="userSpaceOnUse">
                      <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#475569" strokeWidth="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                </svg>

                {/* Simplified Continents Silhouette Overlay */}
                <svg className="absolute inset-0 w-full h-full opacity-25 text-slate-600 fill-current" viewBox="0 0 1000 500">
                  {/* North America */}
                  <path d="M150,120 Q200,80 300,100 T350,220 T200,280 T120,200 Z" />
                  {/* Europe */}
                  <path d="M440,100 Q520,70 560,140 T500,220 T420,160 Z" />
                  {/* Asia */}
                  <path d="M580,90 Q750,80 850,150 T880,300 T650,260 Z" />
                  {/* Africa */}
                  <path d="M460,230 Q540,240 560,340 T480,420 T440,300 Z" />
                  {/* South America */}
                  <path d="M250,290 Q320,300 340,420 T260,460 Z" />
                  {/* Australia */}
                  <path d="M780,340 Q880,350 860,440 T760,420 Z" />
                </svg>

                {/* Animated Connecting Vector Lines */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <path
                    d="M 230 175 Q 355 100 480 140"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-40 animate-pulse"
                  />
                  <path
                    d="M 480 140 Q 550 180 620 220"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-40 animate-pulse"
                  />
                  <path
                    d="M 620 220 Q 710 260 800 310"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="opacity-40 animate-pulse"
                  />
                </svg>

                {/* Hub Location Markers */}
                {REGIONAL_HUBS.map((hub) => {
                  const isActive = activeHub.id === hub.id;
                  return (
                    <button
                      key={hub.id}
                      type="button"
                      onClick={() => setActiveHub(hub)}
                      style={{ left: `${hub.coords.x}%`, top: `${hub.coords.y}%` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 group/pin z-20 focus:outline-none"
                    >
                      {/* Pulse Ring */}
                      <span className={`absolute -inset-2 rounded-full transition ${isActive ? 'bg-blue-500/40 animate-ping' : 'bg-slate-700/20 group-hover/pin:bg-blue-400/30'}`} />
                      
                      {/* Dot Marker */}
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition shadow-lg ${
                        isActive
                          ? 'bg-blue-600 border-white text-white scale-125'
                          : 'bg-slate-900 border-slate-500 text-slate-400 group-hover/pin:border-blue-400'
                      }`}>
                        <MapPin className="w-3 h-3" />
                      </div>

                      {/* Tooltip Label */}
                      <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-1 whitespace-nowrap px-2 py-0.5 rounded text-[10px] font-bold transition shadow-md ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-900 text-slate-300 border border-slate-700 group-hover/pin:text-white'
                      }`}>
                        {hub.name.split(' ')[0]}
                      </div>
                    </button>
                  );
                })}

              </div>

              {/* Global Reach Key Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-center">
                <div>
                  <div className="text-xl font-serif font-bold text-white">45+</div>
                  <div className="text-[11px] text-slate-400">Countries Served</div>
                </div>
                <div>
                  <div className="text-xl font-serif font-bold text-white">24/7</div>
                  <div className="text-[11px] text-slate-400">Desk Coverage</div>
                </div>
                <div>
                  <div className="text-xl font-serif font-bold text-white">500+</div>
                  <div className="text-[11px] text-slate-400">Active Retainers</div>
                </div>
                <div>
                  <div className="text-xl font-serif font-bold text-emerald-400">100%</div>
                  <div className="text-[11px] text-slate-400">Cross-Border Audit</div>
                </div>
              </div>

            </div>
          </AnimatedSection>

          {/* Regional Hub Detail Panel */}
          <AnimatedSection animation="fade-up" delay={200} duration={600} className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeHub.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-xl relative"
              >
                {/* Header */}
                <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                  <div>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-widest flex items-center space-x-1">
                      <Building className="w-3.5 h-3.5" />
                      <span>{activeHub.location}</span>
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white mt-1">
                      {activeHub.name}
                    </h3>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold">
                    {activeHub.activeClients}+ Active Clients
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {activeHub.description}
                </p>

                {/* Hub Metrics */}
                <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Users className="w-3.5 h-3.5 text-blue-400" />
                      <span>Senior Advisors</span>
                    </span>
                    <p className="font-bold text-white">{activeHub.advisorsCount} Regional Partners</p>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-blue-400" />
                      <span>Timezones Covered</span>
                    </span>
                    <p className="font-bold text-white">{activeHub.timezones}</p>
                  </div>
                </div>

                {/* Regulatory & Compliance Frameworks */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Regional Compliance Expertise</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeHub.compliance.map((item, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] bg-slate-900 text-slate-300 border border-slate-800 px-2.5 py-1 rounded-lg flex items-center space-x-1"
                      >
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{item}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Primary Sectors */}
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>Focus Industry Verticals</span>
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {activeHub.keyIndustries.map((ind, idx) => (
                      <span key={idx} className="text-[11px] bg-blue-950/40 text-blue-300 border border-blue-900/60 px-2.5 py-1 rounded-lg">
                        {ind}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => onSelectRegionConsultation?.(activeHub.name)}
                    className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 group"
                  >
                    <span>Request Consultation for {activeHub.name.replace(' Hub', '')}</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </AnimatedSection>

        </div>

      </div>
    </section>
  );
};
