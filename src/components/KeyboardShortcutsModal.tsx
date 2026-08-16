import React from 'react';
import { Search, X, Keyboard, Calendar, PhoneCall, Activity, Sparkles } from 'lucide-react';

interface KeyboardShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerConsultation: () => void;
  onTriggerMeeting: () => void;
  onTriggerHealthAssessment: () => void;
  onTriggerSearch: () => void;
}

export const KeyboardShortcutsModal: React.FC<KeyboardShortcutsModalProps> = ({
  isOpen,
  onClose,
  onTriggerConsultation,
  onTriggerMeeting,
  onTriggerHealthAssessment,
  onTriggerSearch,
}) => {
  if (!isOpen) return null;

  const shortcutsList = [
    { key: 'Ctrl + K / S', description: 'Open Global Search Spotlight', icon: Search, action: onTriggerSearch },
    { key: 'C', description: 'Request Strategic Consultation Modal', icon: PhoneCall, action: onTriggerConsultation },
    { key: 'M', description: 'Reserve Executive Meeting Slot', icon: Calendar, action: onTriggerMeeting },
    { key: 'H', description: 'Open Business Health Assessment', icon: Activity, action: onTriggerHealthAssessment },
    { key: '?', description: 'Toggle Keyboard Shortcuts Guide', icon: Keyboard, action: onClose },
    { key: 'Esc', description: 'Close active modal / window', icon: X, action: onClose },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-white flex items-center space-x-2">
                <span>Keyboard Shortcuts</span>
                <span className="text-[10px] uppercase font-sans font-bold bg-blue-500/20 text-blue-300 border border-blue-400/30 px-2 py-0.5 rounded-full">
                  Quick Access
                </span>
              </h3>
              <p className="text-xs text-slate-400">Navigate Accounticca key features instantly from anywhere</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
            aria-label="Close shortcuts dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Shortcuts List */}
        <div className="p-6 space-y-3 bg-slate-50/50">
          {shortcutsList.map((sc, idx) => {
            const IconComponent = sc.icon;
            return (
              <div
                key={idx}
                onClick={() => {
                  onClose();
                  sc.action();
                }}
                className="flex items-center justify-between p-3.5 bg-white border border-slate-200/90 rounded-2xl hover:border-blue-400 hover:bg-blue-50/50 transition cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-slate-100 group-hover:bg-blue-100 text-slate-600 group-hover:text-blue-700 transition">
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold text-slate-800 group-hover:text-blue-900 transition">
                    {sc.description}
                  </span>
                </div>

                <div className="flex items-center space-x-1">
                  <kbd className="px-2.5 py-1 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white border border-slate-300 group-hover:border-blue-500 rounded-lg text-xs font-mono font-bold text-slate-700 transition shadow-2xs">
                    {sc.key}
                  </kbd>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="p-4 bg-slate-100 border-t border-slate-200 text-center flex items-center justify-between px-6 text-xs text-slate-500">
          <span className="flex items-center space-x-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Press <kbd className="font-mono font-bold text-slate-700 px-1 bg-white rounded border border-slate-300">?</kbd> anywhere to toggle this guide</span>
          </span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
