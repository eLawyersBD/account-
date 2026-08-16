import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, ShieldCheck, X, ChevronRight, Settings, Check, Lock } from 'lucide-react';

interface CookiePreferences {
  essential: boolean; // Always true
  analytics: boolean;
  marketing: boolean;
}

interface CookieConsentBannerProps {
  onOpenPrivacyModal?: () => void;
  forceOpen?: boolean;
  onCloseForceOpen?: () => void;
}

export const CookieConsentBanner: React.FC<CookieConsentBannerProps> = ({
  forceOpen = false,
  onCloseForceOpen,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check local storage for previous user consent choice
    const savedConsent = localStorage.getItem('accounticca_cookie_consent');
    if (forceOpen) {
      setIsVisible(true);
    } else if (!savedConsent) {
      // Small delayed trigger so user sees hero first
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 1200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [forceOpen]);

  // Listen for global custom event to trigger cookie settings modal/banner from footer
  useEffect(() => {
    const handleOpenEvent = () => {
      setIsVisible(true);
      setShowDetails(true);
    };
    window.addEventListener('open-cookie-settings', handleOpenEvent);
    return () => window.removeEventListener('open-cookie-settings', handleOpenEvent);
  }, []);

  const handleAcceptAll = () => {
    const fullConsent = { essential: true, analytics: true, marketing: true };
    localStorage.setItem('accounticca_cookie_consent', JSON.stringify({
      status: 'accepted',
      preferences: fullConsent,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const handleDecline = () => {
    const essentialOnly = { essential: true, analytics: false, marketing: false };
    localStorage.setItem('accounticca_cookie_consent', JSON.stringify({
      status: 'declined',
      preferences: essentialOnly,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  const handleSavePreferences = () => {
    localStorage.setItem('accounticca_cookie_consent', JSON.stringify({
      status: 'custom',
      preferences,
      timestamp: new Date().toISOString(),
    }));
    setIsVisible(false);
    if (onCloseForceOpen) onCloseForceOpen();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.98 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.98 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-3 inset-x-3 sm:bottom-5 sm:inset-x-5 max-w-4xl mx-auto z-50 pointer-events-auto"
        >
          <div className="bg-slate-900/95 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl shadow-slate-950/80 p-4 sm:p-6 text-slate-200 relative overflow-hidden">
            {/* Top Accent Gradient Border */}
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 via-amber-400 to-emerald-400" />

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              
              {/* Header & Copy */}
              <div className="flex items-start space-x-3.5 flex-1 pr-6">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                  <Cookie className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-serif font-bold text-white tracking-wide">
                      We Value Your Privacy & Data Security
                    </h3>
                    <span className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-full font-medium hidden sm:inline-flex items-center space-x-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>GDPR & CCPA Compliant</span>
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    Accounticca uses essential cookies for site security and optional performance cookies to analyze user traffic and personalize your advisory consultation experience.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDetails(!showDetails)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition flex items-center space-x-1.5"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>{showDetails ? 'Hide Options' : 'Preferences'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDecline}
                  className="flex-1 md:flex-none px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition hover:border-slate-600 text-center"
                >
                  Decline
                </button>

                <button
                  type="button"
                  onClick={handleAcceptAll}
                  className="flex-1 md:flex-none px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md shadow-blue-600/30 transition text-center flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Accept All</span>
                </button>
              </div>

            </div>

            {/* Granular Preference Panel */}
            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden border-t border-slate-800 mt-4 pt-4 space-y-3"
                >
                  <p className="text-xs font-semibold text-slate-300">
                    Customize Cookie Preferences:
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    {/* Essential */}
                    <div className="bg-slate-800/60 border border-slate-700/60 p-3 rounded-xl flex items-start justify-between space-x-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-1.5">
                          <Lock className="w-3.5 h-3.5 text-blue-400" />
                          <span className="text-xs font-bold text-white">Essential</span>
                        </div>
                        <p className="text-[11px] text-slate-400">Strictly needed for navigation & security.</p>
                      </div>
                      <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20 shrink-0">
                        Always On
                      </span>
                    </div>

                    {/* Analytics */}
                    <label className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 p-3 rounded-xl flex items-start justify-between space-x-2 cursor-pointer transition">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white">Analytics & Performance</span>
                        <p className="text-[11px] text-slate-400">Helps us measure site traffic & usage.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.analytics}
                        onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700 shrink-0 mt-0.5"
                      />
                    </label>

                    {/* Marketing */}
                    <label className="bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 p-3 rounded-xl flex items-start justify-between space-x-2 cursor-pointer transition">
                      <div className="space-y-0.5">
                        <span className="text-xs font-bold text-white">Targeted Marketing</span>
                        <p className="text-[11px] text-slate-400">Tailors tailored advisory offerings.</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={preferences.marketing}
                        onChange={(e) => setPreferences({ ...preferences, marketing: e.target.checked })}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 bg-slate-900 border-slate-700 shrink-0 mt-0.5"
                      />
                    </label>

                  </div>

                  <div className="flex justify-end pt-1">
                    <button
                      type="button"
                      onClick={handleSavePreferences}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow-sm"
                    >
                      Save Preferences
                    </button>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
