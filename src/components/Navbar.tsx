import React, { useState, useRef, useEffect } from 'react';
import { 
  Menu, X, Calendar, PhoneCall, Search, Video, Sparkles, ChevronDown, 
  Rocket, Target, TrendingUp, BookOpen, Cog, Cpu, Users, Megaphone, Building2,
  FileText, BookMarked, Layers, ArrowRight, ShieldCheck, Briefcase, Lock
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AccounticcaLogo } from './AccounticcaLogo';

interface NavbarProps {
  onOpenConsultation: () => void;
  onOpenMeeting: () => void;
  onOpenGoogleMeet?: () => void;
  onOpenWorkspaceSuite?: (tab?: 'drive' | 'sheets' | 'gmail' | 'calendar' | 'forms') => void;
  onOpenSearch?: () => void;
  onOpenClientPortal?: () => void;
  activeSection: string;
  setActiveSection: (section: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenConsultation,
  onOpenMeeting,
  onOpenGoogleMeet,
  onOpenWorkspaceSuite,
  onOpenSearch,
  onOpenClientPortal,
  activeSection,
  setActiveSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'services' | 'resources' | null>(null);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menu: 'services' | 'resources') => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setActiveDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const servicesList = [
    { id: 'startup-consultancy', label: 'Startup Consultancy', icon: Rocket, desc: 'Idea evaluation, roadmapping & launch plan' },
    { id: 'business-planning', label: 'Business Strategy', icon: Target, desc: 'Growth strategies & competitive positioning' },
    { id: 'accounting-financial', label: 'Accounting & Finance', icon: TrendingUp, desc: 'Financial controls, cash flow & forecasting' },
    { id: 'bookkeeping', label: 'Bookkeeping', icon: BookOpen, desc: 'Ledger management & audit-ready records' },
    { id: 'business-process', label: 'Business Process Optimization', icon: Cog, desc: 'SOP development & workflow streamlining' },
    { id: 'business-automation', label: 'Automation Consultancy', icon: Cpu, desc: 'ERP, CRM & software workflow automation' },
    { id: 'hr-organizational', label: 'HR Consultancy', icon: Users, desc: 'Org structure, KPI systems & team frameworks' },
    { id: 'sales-marketing', label: 'Sales & Marketing Strategy', icon: Megaphone, desc: 'Positioning, funnels & client acquisition' },
    { id: 'sme-growth', label: 'SME Growth Solutions', icon: Building2, desc: 'Scaling frameworks & health checkups' },
  ];

  const resourcesList = [
    { id: 'blog', label: 'Blog', icon: BookMarked, desc: 'Executive analysis & governance articles' },
    { id: 'templates', label: 'Templates', icon: FileText, desc: 'Business plan, financial models & launch tools' },
    { id: 'blog', label: 'Business Guides', icon: Layers, desc: 'Step-by-step masterclass scaling blueprints' },
  ];

  const handleNavClick = (id: string, targetCardId?: string) => {
    setActiveSection(id);
    setMobileMenuOpen(false);
    setActiveDropdown(null);

    // If specific card requested
    const targetElementId = targetCardId || id;
    const element = document.getElementById(targetElementId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else {
      const parentElement = document.getElementById(id);
      if (parentElement) {
        parentElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md text-slate-800 border-b border-slate-200/80 shadow-xs transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-3">
          
          {/* Logo & Ecosystem Badge */}
          <div className="shrink-0">
            <AccounticcaLogo onClick={() => handleNavClick('home')} size="md" variant="dark" />
          </div>

          {/* Desktop Navigation Hierarchy */}
          <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1 text-sm font-medium bg-slate-100/80 p-1 rounded-full border border-slate-200/80 shadow-2xs">
            
            {/* Home Link */}
            <button
              onClick={() => handleNavClick('home')}
              className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                activeSection === 'home' ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeSection === 'home' && (
                <motion.span
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/90 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span>Home</span>
            </button>

            {/* About Accountica Link */}
            <button
              onClick={() => handleNavClick('about')}
              className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                activeSection === 'about' ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeSection === 'about' && (
                <motion.span
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/90 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span>About Accountica</span>
            </button>

            {/* Services Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('services')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleNavClick('services')}
                className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 flex items-center space-x-1 ${
                  activeSection === 'services' ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {activeSection === 'services' && (
                  <motion.span
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/90 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>Services</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {/* Services Mega Dropdown Panel */}
              <AnimatePresence>
                {activeDropdown === 'services' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-[580px] xl:w-[620px] bg-white border border-slate-200 rounded-2xl shadow-xl p-4 z-50 grid grid-cols-2 gap-2"
                  >
                    <div className="col-span-2 pb-2 mb-1 border-b border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Core Advisory Services</span>
                      <button
                        onClick={() => handleNavClick('services')}
                        className="text-xs text-blue-600 font-semibold hover:text-blue-700 flex items-center space-x-1"
                      >
                        <span>View All Services</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                    {servicesList.map((srv) => {
                      const IconComp = srv.icon;
                      return (
                        <button
                          key={srv.id}
                          onClick={() => handleNavClick('services', srv.id)}
                          className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-blue-50/70 text-left transition group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition leading-tight">
                              {srv.label}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {srv.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Industries Link */}
            <button
              onClick={() => handleNavClick('industries')}
              className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                activeSection === 'industries' ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeSection === 'industries' && (
                <motion.span
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/90 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span>Industries</span>
            </button>

            {/* Resources Dropdown (Blog, Templates, Business Guides) */}
            <div 
              className="relative"
              onMouseEnter={() => handleMouseEnter('resources')}
              onMouseLeave={handleMouseLeave}
            >
              <button
                onClick={() => handleNavClick('resources')}
                className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 flex items-center space-x-1 ${
                  activeSection === 'resources' || activeSection === 'blog' ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {(activeSection === 'resources' || activeSection === 'blog') && (
                  <motion.span
                    layoutId="activeNavTab"
                    className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/90 -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span>Resources</span>
                <ChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${activeDropdown === 'resources' ? 'rotate-180 text-blue-600' : ''}`} />
              </button>

              {/* Resources Dropdown Panel */}
              <AnimatePresence>
                {activeDropdown === 'resources' && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-72 bg-white border border-slate-200 rounded-2xl shadow-xl p-3 z-50 space-y-1"
                  >
                    <div className="pb-1.5 mb-1 border-b border-slate-100 px-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Knowledge & Tools</span>
                    </div>

                    {resourcesList.map((res, idx) => {
                      const IconComp = res.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => handleNavClick(res.id)}
                          className="flex items-start space-x-3 p-2.5 rounded-xl hover:bg-blue-50/70 w-full text-left transition group"
                        >
                          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200/60 flex items-center justify-center text-blue-600 shrink-0 mt-0.5 group-hover:bg-blue-600 group-hover:text-white transition">
                            <IconComp className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-slate-900 group-hover:text-blue-700 transition">
                              {res.label}
                            </div>
                            <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                              {res.desc}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Case Studies Link */}
            <button
              onClick={() => handleNavClick('casestudies')}
              className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                activeSection === 'casestudies' ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeSection === 'casestudies' && (
                <motion.span
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/90 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span>Case Studies</span>
            </button>

            {/* Contact Link */}
            <button
              onClick={() => handleNavClick('contact')}
              className={`relative px-2.5 xl:px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors duration-200 ${
                activeSection === 'contact' ? 'text-blue-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {activeSection === 'contact' && (
                <motion.span
                  layoutId="activeNavTab"
                  className="absolute inset-0 bg-white rounded-full shadow-xs border border-slate-200/90 -z-10"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <span>Contact</span>
            </button>

          </nav>

          {/* CTAs & Global Search Button */}
          <div className="hidden lg:flex items-center space-x-2 xl:space-x-3 shrink-0">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="px-3 xl:px-3.5 py-2 rounded-full border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-blue-50/50 hover:border-blue-200 text-xs font-semibold transition flex items-center space-x-2 bg-slate-50/50"
                title="Search services, articles, FAQs (Ctrl+K)"
              >
                <Search className="w-4 h-4 text-blue-600" />
                <span className="hidden xl:inline text-slate-500">Search...</span>
                <kbd className="hidden xl:inline-block font-mono text-[10px] text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-2xs">
                  Ctrl+K
                </kbd>
              </button>
            )}

            {onOpenClientPortal && (
              <button
                onClick={onOpenClientPortal}
                className="px-3.5 xl:px-4 py-2 xl:py-2.5 rounded-full border border-blue-200 bg-blue-50/70 hover:bg-blue-100/80 text-blue-900 text-xs xl:text-sm font-bold transition flex items-center space-x-2 shadow-2xs group"
                title="Secure Executive Client Portal"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Lock className="w-3.5 h-3.5 text-blue-700 group-hover:scale-110 transition-transform" />
                <span>Client Portal</span>
              </button>
            )}

            <button
              onClick={onOpenConsultation}
              className="px-4 xl:px-5 py-2 xl:py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs xl:text-sm transition shadow-md shadow-blue-500/20 flex items-center space-x-2 active:scale-98"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Get Consultation</span>
            </button>
          </div>

          {/* Mobile Menu Button & Search Trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            {onOpenClientPortal && (
              <button
                onClick={onOpenClientPortal}
                className="px-2.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-900 text-xs font-bold flex items-center space-x-1"
                title="Client Portal"
              >
                <Lock className="w-3.5 h-3.5 text-blue-700" />
                <span>Portal</span>
              </button>
            )}

            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                aria-label="Search"
              >
                <Search className="w-4 h-4 text-blue-600" />
              </button>
            )}

            <button
              onClick={onOpenConsultation}
              className="px-3 py-1.5 rounded-full bg-blue-600 text-white font-semibold text-xs sm:hidden"
            >
              Consult
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown with Full Tree Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-2 animate-fadeIn shadow-xl max-h-[85vh] overflow-y-auto">
          
          {/* Home */}
          <button
            onClick={() => handleNavClick('home')}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition ${
              activeSection === 'home' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Home
          </button>

          {/* About Accountica */}
          <button
            onClick={() => handleNavClick('about')}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition ${
              activeSection === 'about' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            About Accountica
          </button>

          {/* Services Accordion with 9 Sub-items */}
          <div className="border-t border-b border-slate-100 py-1">
            <button
              onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              <span>Services</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileServicesOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {mobileServicesOpen && (
              <div className="pl-4 pr-1 py-1 space-y-1 bg-slate-50 rounded-xl my-1 border border-slate-200/60">
                {servicesList.map((srv) => (
                  <button
                    key={srv.id}
                    onClick={() => handleNavClick('services', srv.id)}
                    className="w-full text-left px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-white rounded-lg flex items-center space-x-2 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{srv.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Industries */}
          <button
            onClick={() => handleNavClick('industries')}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition ${
              activeSection === 'industries' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Industries
          </button>

          {/* Resources Accordion (Blog, Templates, Business Guides) */}
          <div className="border-t border-b border-slate-100 py-1">
            <button
              onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
              className="w-full flex items-center justify-between px-3 py-2.5 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-lg"
            >
              <span>Resources</span>
              <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${mobileResourcesOpen ? 'rotate-180 text-blue-600' : ''}`} />
            </button>

            {mobileResourcesOpen && (
              <div className="pl-4 pr-1 py-1 space-y-1 bg-slate-50 rounded-xl my-1 border border-slate-200/60">
                {resourcesList.map((res, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleNavClick(res.id)}
                    className="w-full text-left px-2.5 py-2 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:bg-white rounded-lg flex items-center space-x-2 transition"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    <span>{res.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Case Studies */}
          <button
            onClick={() => handleNavClick('casestudies')}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition ${
              activeSection === 'casestudies' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Case Studies
          </button>

          {/* Contact */}
          <button
            onClick={() => handleNavClick('contact')}
            className={`block w-full text-left px-3 py-2.5 rounded-lg text-base font-medium transition ${
              activeSection === 'contact' ? 'bg-blue-50 text-blue-600 font-semibold' : 'text-slate-700 hover:bg-slate-50'
            }`}
          >
            Contact
          </button>

          <div className="pt-4 border-t border-slate-200 flex flex-col space-y-3">
            {onOpenClientPortal && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenClientPortal(); }}
                className="w-full py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold flex items-center justify-center space-x-2 shadow-md shadow-slate-900/20"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Executive Client Portal (Firestore)</span>
              </button>
            )}
            {onOpenWorkspaceSuite && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenWorkspaceSuite(); }}
                className="w-full py-3 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-900 border border-blue-200 text-sm font-bold flex items-center justify-center space-x-2 shadow-2xs"
              >
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>Google Workspace Suite</span>
              </button>
            )}
            {onOpenGoogleMeet && (
              <button
                onClick={() => { setMobileMenuOpen(false); onOpenGoogleMeet(); }}
                className="w-full py-3 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-sm font-semibold flex items-center justify-center space-x-2 shadow-2xs"
              >
                <Video className="w-4 h-4 text-emerald-600" />
                <span>Google Meet Live Conference</span>
              </button>
            )}
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenMeeting(); }}
              className="w-full py-3 rounded-full border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4 text-blue-600" />
              <span>Schedule a Meeting</span>
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenConsultation(); }}
              className="w-full py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Get Business Consultation</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

