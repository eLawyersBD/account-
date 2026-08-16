import React, { useState, useEffect } from 'react';
import { Video, Calendar, Clock, ExternalLink, Sparkles, Bell, Play, Plus, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useNotifications, ScheduledReminder } from '../context/NotificationContext';

interface UpcomingMeetingWidgetProps {
  onOpenGoogleMeet?: () => void;
}

export const UpcomingMeetingWidget: React.FC<UpcomingMeetingWidgetProps> = ({ onOpenGoogleMeet }) => {
  const { scheduledReminders, triggerTestReminder } = useNotifications();
  const [now, setNow] = useState(Date.now());

  // Update timer every second
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Find next upcoming meeting from scheduled reminders or fallback default
  const sortedUpcoming = scheduledReminders
    .filter((r) => r.eventTimeMs > now - 30 * 60 * 1000) // Keep until 30m after start
    .sort((a, b) => a.eventTimeMs - b.eventTimeMs);

  const nextReminder: ScheduledReminder | null = sortedUpcoming[0] || null;

  // Default fallback meeting if none scheduled yet
  const defaultEventTimeMs = useEffect ? undefined : undefined;
  
  // We maintain a fallback event time 14 minutes and 45 seconds in the future if no reminder is saved
  const [fallbackTimeMs] = useState(() => Date.now() + (14 * 60 + 45) * 1000);

  const activeMeetingTitle = nextReminder
    ? nextReminder.title
    : 'Accounticca Executive Strategy Consultation';

  const activeMeetUri = nextReminder
    ? nextReminder.meetUri
    : 'https://meet.google.com/acc-advisory-session';

  const activeFormattedDate = nextReminder
    ? nextReminder.formattedDate
    : 'Today';

  const activeFormattedTime = nextReminder
    ? nextReminder.formattedTime
    : new Date(fallbackTimeMs).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  const targetTimeMs = nextReminder ? nextReminder.eventTimeMs : fallbackTimeMs;
  const diffMs = Math.max(0, targetTimeMs - now);

  // Calculate hours, minutes, seconds
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

  const isStartingSoon = diffMs <= 15 * 60 * 1000;
  const isLiveNow = diffMs === 0;

  return (
    <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-5">
      {/* Background glow gradient */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Widget Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-xs">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400">
              <Sparkles className="w-3 h-3" />
              <span>Google Meet Synchronization</span>
            </div>
            <h3 className="text-base font-serif font-bold text-white">Upcoming Video Meeting</h3>
          </div>
        </div>

        {onOpenGoogleMeet && (
          <button
            onClick={onOpenGoogleMeet}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Schedule New</span>
          </button>
        )}
      </div>

      {/* Meeting Title & Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center space-x-1.5">
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {nextReminder ? 'Scheduled Event' : 'Next Advisory Session'}
            </span>
            {diffMs <= 60 * 60 * 1000 && (
              <span className="bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 animate-pulse">
                <AlertTriangle className="w-3 h-3 text-rose-400" />
                <span>&lt;1h High Priority</span>
              </span>
            )}
          </div>
          <span className="text-xs text-slate-400 font-mono flex items-center space-x-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{activeFormattedDate} @ {activeFormattedTime}</span>
          </span>
        </div>

        <h4 className="text-lg font-serif font-bold text-white leading-snug line-clamp-1">
          {activeMeetingTitle}
        </h4>
      </div>

      {/* Countdown Timer Display */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 space-y-2">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
          <span className="flex items-center space-x-1">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Countdown to Session</span>
          </span>
          <span className="text-[10px] text-emerald-400 uppercase font-bold tracking-wider">
            {isLiveNow ? 'Session In Progress' : isStartingSoon ? 'Starting Soon' : 'Upcoming'}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center pt-1">
          <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="block text-2xl font-bold font-mono text-white">
              {String(hours).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Hours</span>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="block text-2xl font-bold font-mono text-emerald-400">
              {String(minutes).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Minutes</span>
          </div>

          <div className="bg-slate-900 border border-slate-800/80 p-2.5 rounded-xl">
            <span className="block text-2xl font-bold font-mono text-emerald-400 animate-pulse">
              {String(seconds).padStart(2, '0')}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold">Seconds</span>
          </div>
        </div>
      </div>

      {/* Join Button & Toast Test Button */}
      <div className="flex items-center gap-3 pt-1">
        <a
          href={activeMeetUri}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2 group"
        >
          <Video className="w-4 h-4 text-white group-hover:scale-110 transition-transform" />
          <span>Join Google Meet Now</span>
          <ExternalLink className="w-3.5 h-3.5 opacity-80" />
        </a>

        <button
          type="button"
          onClick={() => triggerTestReminder(activeMeetingTitle, activeMeetUri)}
          className="px-3.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition shrink-0 flex items-center space-x-1.5"
          title="Trigger 15-minute Toast Reminder preview"
        >
          <Bell className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden sm:inline">Test Reminder</span>
        </button>
      </div>
    </div>
  );
};
