import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Video, X, ExternalLink, Calendar, Clock, Sparkles, CheckCircle2 } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  meetUri?: string;
  timeString?: string;
  type?: 'reminder' | 'success' | 'info';
  dateFormatted?: string;
  timeFormatted?: string;
  emailSent?: boolean;
  emailRecipient?: string;
}

export interface SimulatedEmailLog {
  id: string;
  subject: string;
  recipient: string;
  timestamp: string;
  meetUri: string;
  body: string;
  status: 'Delivered' | 'Pending (T-15m)';
}

export interface ScheduledReminder {
  id: string;
  title: string;
  eventTimeMs: number;
  reminderTimeMs: number;
  meetUri: string;
  formattedDate: string;
  formattedTime: string;
  triggered: boolean;
  emailRecipient?: string;
  priority?: string;
}

interface NotificationContextType {
  toasts: ToastMessage[];
  scheduledReminders: ScheduledReminder[];
  emailLogs: SimulatedEmailLog[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;
  scheduleReminder: (params: {
    title: string;
    scheduleDate: string; // YYYY-MM-DD
    scheduleTime: string; // HH:MM
    meetUri: string;
    emailRecipient?: string;
    priority?: string;
  }) => { reminderTimeMs: number; eventTimeMs: number; formattedReminderTime: string };
  triggerTestReminder: (title?: string, meetUri?: string, email?: string) => void;
  simulateEmailDispatch: (title: string, recipientEmail: string, meetUri: string) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'accounticca_scheduled_reminders_v1';

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [emailLogs, setEmailLogs] = useState<SimulatedEmailLog[]>([]);
  const [scheduledReminders, setScheduledReminders] = useState<ScheduledReminder[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(scheduledReminders));
    } catch (e) {
      console.error('Failed to save scheduled reminders to localStorage', e);
    }
  }, [scheduledReminders]);

  const addToast = (toastData: Omit<ToastMessage, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newToast: ToastMessage = { ...toastData, id };
    setToasts((prev) => [newToast, ...prev].slice(0, 5)); // Keep max 5 toasts

    // Request desktop notification if available
    if ('Notification' in window && Notification.permission === 'granted' && toastData.type === 'reminder') {
      try {
        new Notification(`Upcoming Meeting: ${toastData.title}`, {
          body: `Starting in 15 minutes! ${toastData.message}`,
          icon: '/favicon.ico',
        });
      } catch (e) {
        console.warn('Browser notification error:', e);
      }
    }
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const simulateEmailDispatch = (title: string, recipientEmail: string, meetUri: string) => {
    const id = `email-${Date.now()}`;
    const newLog: SimulatedEmailLog = {
      id,
      subject: `[Reminder] 15-Min Warning: ${title}`,
      recipient: recipientEmail,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      meetUri,
      body: `Hello, your virtual consultation "${title}" begins in 15 minutes. Click to join: ${meetUri}`,
      status: 'Delivered',
    };
    setEmailLogs((prev) => [newLog, ...prev]);
  };

  const scheduleReminder = ({
    title,
    scheduleDate,
    scheduleTime,
    meetUri,
    emailRecipient = 'erp.elawyers@gmail.com',
    priority = 'Standard',
  }: {
    title: string;
    scheduleDate: string;
    scheduleTime: string;
    meetUri: string;
    emailRecipient?: string;
    priority?: string;
  }) => {
    // Ask for browser notification permission if not decided
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    const [year, month, day] = scheduleDate.split('-').map(Number);
    const [hours, mins] = scheduleTime.split(':').map(Number);
    const eventDate = new Date(year, month - 1, day, hours, mins);
    const eventTimeMs = eventDate.getTime();
    
    // 15 minutes before event
    const FIFTEEN_MINS_MS = 15 * 60 * 1000;
    const reminderTimeMs = eventTimeMs - FIFTEEN_MINS_MS;

    const formattedDate = eventDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const reminderDate = new Date(reminderTimeMs);
    const formattedReminderTime = reminderDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });

    const id = `rem-${Date.now()}`;
    const newReminder: ScheduledReminder = {
      id,
      title,
      eventTimeMs,
      reminderTimeMs,
      meetUri,
      formattedDate,
      formattedTime,
      triggered: false,
      emailRecipient,
      priority,
    };

    setScheduledReminders((prev) => [...prev, newReminder]);

    // Add initial email simulation entry
    simulateEmailDispatch(title, emailRecipient, meetUri);

    // Show initial confirmation toast
    addToast({
      title: 'Meeting Scheduled & Reminder Set',
      message: `Google Meet reminder & email alert configured for 15 mins prior (${formattedReminderTime}).`,
      meetUri,
      type: 'success',
      dateFormatted: formattedDate,
      timeFormatted: formattedTime,
      emailSent: true,
      emailRecipient,
    });

    return { reminderTimeMs, eventTimeMs, formattedReminderTime };
  };

  const triggerTestReminder = (
    title = 'Accounticca Executive Strategy Review',
    meetUri = 'https://meet.google.com/abc-defg-hij',
    email = 'erp.elawyers@gmail.com'
  ) => {
    simulateEmailDispatch(title, email, meetUri);

    addToast({
      title: `Upcoming Meeting in 15 Minutes!`,
      message: `${title} is starting shortly. Email reminder sent to ${email}.`,
      meetUri,
      type: 'reminder',
      dateFormatted: 'Today',
      timeFormatted: 'In 15 Minutes',
      emailSent: true,
      emailRecipient: email,
    });
  };

  // Interval checker for due reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setScheduledReminders((prev) => {
        let updated = false;
        const nextList = prev.map((rem) => {
          if (!rem.triggered && now >= rem.reminderTimeMs) {
            updated = true;
            const recipient = rem.emailRecipient || 'erp.elawyers@gmail.com';
            
            // Dispatch simulated email
            simulateEmailDispatch(rem.title, recipient, rem.meetUri);

            // Trigger Toast!
            addToast({
              title: `Upcoming Meeting in 15 Minutes!`,
              message: `${rem.title} starts at ${rem.formattedTime} (${rem.formattedDate}). Email dispatched to ${recipient}.`,
              meetUri: rem.meetUri,
              type: 'reminder',
              dateFormatted: rem.formattedDate,
              timeFormatted: rem.formattedTime,
              emailSent: true,
              emailRecipient: recipient,
            });
            return { ...rem, triggered: true };
          }
          return rem;
        });
        return updated ? nextList : prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        toasts,
        scheduledReminders,
        emailLogs,
        addToast,
        removeToast,
        scheduleReminder,
        triggerTestReminder,
        simulateEmailDispatch,
      }}
    >
      {children}
      <NotificationToastContainer />
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Toast Container UI
const NotificationToastContainer: React.FC = () => {
  const { toasts, removeToast, triggerTestReminder } = useNotifications();

  return (
    <div
      aria-live="polite"
      className="fixed top-20 right-4 sm:right-6 z-[9999] flex flex-col space-y-3 max-w-sm sm:max-w-md w-full pointer-events-none"
    >
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.9 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`pointer-events-auto border rounded-2xl p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden flex flex-col space-y-2.5 ${
              toast.type === 'reminder'
                ? 'bg-slate-900/95 border-emerald-500/40 text-white ring-2 ring-emerald-500/20'
                : toast.type === 'success'
                ? 'bg-white/95 border-emerald-200 text-slate-900 shadow-emerald-500/10'
                : 'bg-white/95 border-slate-200 text-slate-900'
            }`}
          >
            {/* Top Bar with Icon & Close Button */}
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center space-x-2">
                {toast.type === 'reminder' ? (
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 shrink-0 animate-pulse">
                    <Bell className="w-4 h-4" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div className="flex items-center space-x-1.5 text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                    <Sparkles className="w-3 h-3" />
                    <span>{toast.type === 'reminder' ? 'Google Meet Reminder (15m)' : 'Google Meet Alert'}</span>
                  </div>
                  <h4 className="text-sm font-bold leading-snug">{toast.title}</h4>
                </div>
              </div>

              <button
                type="button"
                onClick={() => removeToast(toast.id)}
                className={`p-1 rounded-lg transition ${
                  toast.type === 'reminder'
                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Body */}
            <p
              className={`text-xs leading-relaxed ${
                toast.type === 'reminder' ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              {toast.message}
            </p>

            {/* Time / Date Tag */}
            {(toast.dateFormatted || toast.timeFormatted) && (
              <div
                className={`flex items-center space-x-2 text-[11px] font-semibold px-2.5 py-1 rounded-lg w-fit ${
                  toast.type === 'reminder'
                    ? 'bg-slate-800 text-emerald-300 border border-slate-700'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>
                  {toast.dateFormatted} {toast.timeFormatted ? `@ ${toast.timeFormatted}` : ''}
                </span>
              </div>
            )}

            {/* Actions */}
            {toast.meetUri && (
              <div className="pt-1 flex items-center space-x-2">
                <a
                  href={toast.meetUri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center space-x-1.5 shadow-md"
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Join Google Meet</span>
                  <ExternalLink className="w-3 h-3 ml-0.5" />
                </a>
                <button
                  type="button"
                  onClick={() => removeToast(toast.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    toast.type === 'reminder'
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  Dismiss
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
