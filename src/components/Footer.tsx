import React from 'react';
import { Mail, Globe, ShieldCheck } from 'lucide-react';
import { AccounticcaLogo } from './AccounticcaLogo';

interface FooterProps {
  setActiveSection: (section: string) => void;
  onOpenConsultation: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveSection, onOpenConsultation }) => {
  const handleNav = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="footer" className="bg-gradient-to-b from-slate-900 via-slate-950 to-slate-950 text-slate-300 border-t border-slate-800/80 pt-16 pb-12 relative overflow-hidden">
      {/* Decorative subtle background glow */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-slate-800/80">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-5">
            <AccounticcaLogo onClick={() => handleNav('home')} size="md" variant="light" />

            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              Helping entrepreneurs and organizations build stronger, smarter, and more profitable businesses through structured advisory, financial discipline, and operational excellence.
            </p>

            <div className="space-y-2.5 pt-1 text-xs text-slate-400">
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <a href="mailto:info@accounticca.com" className="hover:text-white transition font-mono">info@accounticca.com</a>
              </div>
              <div className="flex items-center space-x-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-400 shrink-0">
                  <Globe className="w-3.5 h-3.5" />
                </div>
                <a href="https://www.accounticca.com" target="_blank" rel="noreferrer" className="hover:text-white transition font-mono">www.accounticca.com</a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-serif flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Quick Links</span>
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li><button onClick={() => handleNav('about')} className="hover:text-blue-400 transition flex items-center space-x-1"><span>About Us</span></button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-blue-400 transition flex items-center space-x-1"><span>Services</span></button></li>
              <li><button onClick={() => handleNav('finance-act-2026')} className="hover:text-amber-400 transition flex items-center space-x-1 font-semibold text-slate-200"><span>Finance Act 2026 Tax Engine</span></button></li>
              <li><button onClick={() => handleNav('industries')} className="hover:text-blue-400 transition flex items-center space-x-1"><span>Industries</span></button></li>
              <li><button onClick={() => handleNav('resources')} className="hover:text-blue-400 transition flex items-center space-x-1"><span>Resources & Blog</span></button></li>
              <li><button onClick={() => handleNav('casestudies')} className="hover:text-blue-400 transition flex items-center space-x-1"><span>Case Studies</span></button></li>
              <li><button onClick={() => handleNav('contact')} className="hover:text-blue-400 transition flex items-center space-x-1"><span>Contact Us</span></button></li>
            </ul>
          </div>

          {/* Core Services */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-serif flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>Core Services</span>
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition">Startup Consultancy</button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition">Business Strategy</button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition">Accounting & Finance</button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition">Bookkeeping</button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition">Business Process Optimization</button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition">Automation Consultancy</button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition">HR Consultancy</button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition">Sales & Marketing Strategy</button></li>
              <li><button onClick={() => handleNav('services')} className="hover:text-white transition">SME Growth Solutions</button></li>
            </ul>
          </div>

          {/* Ecosystem / CTA */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider font-serif flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span>E-Lawyers Ecosystem</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Accounticca partners with E-Lawyers to provide comprehensive business growth solutions beyond traditional legal services.
            </p>
            <button
              onClick={onOpenConsultation}
              className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-lg shadow-blue-500/20 active:scale-98"
            >
              Get Free Consultation
            </button>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-4 sm:space-y-0">
          <div>
            © {new Date().getFullYear()} Accounticca. All rights reserved. Part of the E-Lawyers Ecosystem.
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-slate-400 transition cursor-pointer" onClick={() => handleNav('home')}>Privacy Policy</span>
            <span className="hover:text-slate-400 transition cursor-pointer" onClick={() => handleNav('home')}>Terms of Service</span>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-cookie-settings'))}
              className="hover:text-blue-400 text-slate-400 transition cursor-pointer"
            >
              Cookie Settings
            </button>
            <button
              onClick={scrollToTop}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-[11px] font-semibold border border-slate-700"
            >
              ↑ Back to Top
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
