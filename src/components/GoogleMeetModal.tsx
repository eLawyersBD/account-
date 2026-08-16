import React, { useState, useEffect } from 'react';
import { X, Video, Copy, Check, ExternalLink, Sparkles, Loader2, Calendar, ShieldCheck, Users, Clock, Mail, CheckCircle2, Bell, Download, Tag, FileText, Filter, Repeat, RotateCw, AlertCircle } from 'lucide-react';
import { googleMeetSignIn, createMeetSpace, initMeetAuth, MeetSpaceResponse } from '../lib/googleMeet';
import { User } from 'firebase/auth';
import { useNotifications } from '../context/NotificationContext';

interface GoogleMeetModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTitle?: string;
}

export const GoogleMeetModal: React.FC<GoogleMeetModalProps> = ({
  isOpen,
  onClose,
  defaultTitle = 'Accounticca Advisory Strategy Session'
}) => {
  const { scheduleReminder, triggerTestReminder } = useNotifications();
  const [activeTab, setActiveTab] = useState<'instant' | 'schedule' | 'past'>('instant');

  // Category tags options
  const TAG_OPTIONS = [
    'Strategy Sync',
    'Financial Audit',
    'Operations',
    'Tax Planning',
    'Systems & ERP'
  ];

  // Priority options
  const PRIORITY_OPTIONS = ['Urgent', 'Standard', 'Low Priority'] as const;

  // Past meetings log list state with realistic historical consultations
  const [pastMeetings, setPastMeetings] = useState([
    {
      id: 'past-1',
      title: 'Q2 Financial Restructuring & Advisory Review',
      tag: 'Financial Audit',
      priority: 'Urgent',
      date: 'Yesterday',
      time: '2:00 PM - 2:45 PM',
      duration: '45 mins',
      host: 'Accounticca Advisory Team',
      attendees: ['client@company.com', 'advisor@accounticca.com'],
      meetUri: 'https://meet.google.com/q2-fin-advisory',
      summary: 'Reviewed Q2 income statements, optimized tax deduction structure, and identified 18% cost reductions in vendor overhead.',
      notes: 'Agenda takeaways: 1. Vendor cost audit approved. 2. Legal tax deduction roadmap initialized.',
      status: 'Completed',
      recurrence: 'Monthly',
      occurrenceInfo: 'Instance 2 of 4'
    },
    {
      id: 'past-2',
      title: 'SME Digital Systems & ERP Integration Discovery',
      tag: 'Systems & ERP',
      priority: 'Standard',
      date: 'Aug 4, 2026',
      time: '11:00 AM - 12:00 PM',
      duration: '60 mins',
      host: 'Technology Consulting Unit',
      attendees: ['it.director@client.com', 'lead.consultant@accounticca.com'],
      meetUri: 'https://meet.google.com/erp-discovery-sys',
      summary: 'Mapped operational workflow bottlenecks and evaluated cloud accounting software alternatives.',
      notes: 'Key Action Item: Start trial implementation of automated accounts receivable pipeline.',
      status: 'Completed',
      recurrence: 'Weekly',
      occurrenceInfo: 'Instance 1 of 4'
    },
    {
      id: 'past-3',
      title: 'Executive Growth & Capital Raising Strategy',
      tag: 'Strategy Sync',
      priority: 'Low Priority',
      date: 'Jul 28, 2026',
      time: '3:30 PM - 4:00 PM',
      duration: '30 mins',
      host: 'Financial Advisory Lead',
      attendees: ['ceo@startup.io', 'partner@accounticca.com'],
      meetUri: 'https://meet.google.com/exec-growth-cap',
      summary: 'Presented 3-year discounted cash flow valuation model and investor pitch deck recommendations.',
      notes: 'Prepared DCF valuation spreadsheet for Board approval ahead of Series A round.',
      status: 'Completed',
      recurrence: 'Bi-weekly',
      occurrenceInfo: 'Instance 3 of 6'
    }
  ]);

  const [filterTag, setFilterTag] = useState<string>('All');

  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isCreatingSpace, setIsCreatingSpace] = useState(false);
  const [createdMeet, setCreatedMeet] = useState<MeetSpaceResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [meetingTitle, setMeetingTitle] = useState(defaultTitle);
  const [instantTag, setInstantTag] = useState('Strategy Sync');
  const [instantNotes, setInstantNotes] = useState('');

  // Scheduling state
  const [scheduleTitle, setScheduleTitle] = useState('Accounticca Executive Advisory Board Review');
  const [selectedTag, setSelectedTag] = useState('Strategy Sync');
  const [selectedPriority, setSelectedPriority] = useState<'Urgent' | 'Standard' | 'Low Priority'>('Standard');
  const [meetingNotes, setMeetingNotes] = useState('');
  const [recurrencePattern, setRecurrencePattern] = useState<'none' | 'weekly' | 'biweekly' | 'monthly'>('none');
  const [recurrenceCount, setRecurrenceCount] = useState<number>(4);
  const [scheduleDate, setScheduleDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [scheduleTime, setScheduleTime] = useState('10:00');
  const [durationMinutes, setDurationMinutes] = useState('45');
  const [guestEmails, setGuestEmails] = useState('client@example.com');
  const [isScheduling, setIsScheduling] = useState(false);
  const [scheduledConfirmation, setScheduledConfirmation] = useState<{
    title: string;
    tag: string;
    priority?: string;
    dateFormatted: string;
    timeFormatted: string;
    duration: string;
    guests: string[];
    meetUri: string;
    notes?: string;
    recurrence?: string;
    totalInstances?: number;
  } | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const unsubscribe = initMeetAuth(
      (currentUser, token) => {
        setUser(currentUser);
        setAccessToken(token);
      },
      () => {
        setUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg(null);
    try {
      const res = await googleMeetSignIn();
      setUser(res.user);
      setAccessToken(res.accessToken);
    } catch (err: any) {
      console.error('Google Meet sign in error:', err);
      setErrorMsg(err?.message || 'Failed to sign in with Google. Please try again.');
    } finally {
      setIsSigningIn(false);
    }
  };

  const getTagBadgeColor = (tag: string) => {
    switch (tag) {
      case 'Financial Audit':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Strategy Sync':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Operations':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Tax Planning':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Systems & ERP':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const getPriorityBadgeColor = (priority?: string) => {
    switch (priority) {
      case 'Urgent':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Low Priority':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'Standard':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-200';
    }
  };

  const handleDownloadCSV = () => {
    const headers = ['ID', 'Title', 'Category Tag', 'Priority', 'Recurrence Pattern', 'Occurrence', 'Date', 'Time', 'Duration', 'Host', 'Attendees', 'Summary', 'Draft Notes', 'Google Meet URI', 'Status'];
    const filteredToExport = filterTag === 'All' ? pastMeetings : pastMeetings.filter((m) => m.tag === filterTag);

    const rows = filteredToExport.map((m) => [
      `"${m.id}"`,
      `"${m.title.replace(/"/g, '""')}"`,
      `"${(m.tag || 'Strategy Sync').replace(/"/g, '""')}"`,
      `"${(m.priority || 'Standard').replace(/"/g, '""')}"`,
      `"${(m.recurrence || 'One-time').replace(/"/g, '""')}"`,
      `"${(m.occurrenceInfo || 'Instance 1 of 1').replace(/"/g, '""')}"`,
      `"${m.date}"`,
      `"${m.time}"`,
      `"${m.duration}"`,
      `"${m.host}"`,
      `"${(m.attendees || []).join('; ')}"`,
      `"${(m.summary || '').replace(/"/g, '""')}"`,
      `"${(m.notes || '').replace(/"/g, '""')}"`,
      `"${m.meetUri}"`,
      `"${m.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Accounticca_Consultation_History_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateSpace = async () => {
    if (!accessToken) {
      setErrorMsg('Please sign in with Google first.');
      return;
    }
    setIsCreatingSpace(true);
    setErrorMsg(null);
    try {
      const space = await createMeetSpace(accessToken);
      setCreatedMeet(space);

      // Save instant room into past meetings log as active
      const newInstantMeeting = {
        id: `inst-${Date.now()}`,
        title: meetingTitle || 'Instant Advisory Consultation',
        tag: instantTag,
        date: 'Today',
        time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
        duration: 'Instant Live Room',
        host: user?.displayName || 'Accounticca Advisor',
        attendees: [user?.email || 'client@example.com'],
        meetUri: space.meetingUri,
        summary: instantNotes ? `Notes: ${instantNotes}` : 'Instant live consultation room provisioned.',
        notes: instantNotes || 'Live session in progress.',
        status: 'Active',
        recurrence: 'One-time',
        occurrenceInfo: 'Instance 1 of 1'
      };

      setPastMeetings((prev) => [newInstantMeeting, ...prev]);
    } catch (err: any) {
      console.error('Error creating Google Meet space:', err);
      setErrorMsg(err?.message || 'Failed to create Google Meet space.');
    } finally {
      setIsCreatingSpace(false);
    }
  };

  const handleScheduleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) {
      setErrorMsg('Please sign in with Google first.');
      return;
    }
    setIsScheduling(true);
    setErrorMsg(null);

    try {
      // Provision Google Meet room for the future event
      const space = await createMeetSpace(accessToken);

      // Parse date & time string
      const [year, month, day] = scheduleDate.split('-').map(Number);
      const [hours, mins] = scheduleTime.split(':').map(Number);

      const guests = guestEmails
        .split(',')
        .map((g) => g.trim())
        .filter(Boolean);

      const primaryEmail = guests[0] || user?.email || 'erp.elawyers@gmail.com';

      // Register local 15-minute Toast notification reminder for initial session
      scheduleReminder({
        title: scheduleTitle || 'Advisory Meeting',
        scheduleDate,
        scheduleTime,
        meetUri: space.meetingUri,
        emailRecipient: primaryEmail,
        priority: selectedPriority,
      });

      const totalInstances = recurrencePattern === 'none' ? 1 : recurrenceCount;
      const recurrenceLabelMap: Record<string, string> = {
        none: 'One-time',
        weekly: 'Weekly',
        biweekly: 'Bi-weekly',
        monthly: 'Monthly',
      };
      const recurrenceLabel = recurrenceLabelMap[recurrencePattern] || 'One-time';
      const seriesId = `series-${Date.now()}`;

      const generatedMeetings = [];

      for (let i = 0; i < totalInstances; i++) {
        const instanceDateObj = new Date(year, month - 1, day, hours, mins);
        if (recurrencePattern === 'weekly') {
          instanceDateObj.setDate(instanceDateObj.getDate() + (i * 7));
        } else if (recurrencePattern === 'biweekly') {
          instanceDateObj.setDate(instanceDateObj.getDate() + (i * 14));
        } else if (recurrencePattern === 'monthly') {
          instanceDateObj.setMonth(instanceDateObj.getMonth() + i);
        }

        const dateFormatted = instanceDateObj.toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        });

        const timeFormatted = instanceDateObj.toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true,
        });

        const instanceNotePrefix = totalInstances > 1 ? `[Recurring ${recurrenceLabel} • Instance ${i + 1} of ${totalInstances}] ` : '';

        generatedMeetings.push({
          id: `sched-${seriesId}-${i + 1}`,
          title: scheduleTitle || 'Advisory Meeting',
          tag: selectedTag,
          priority: selectedPriority,
          date: dateFormatted,
          time: timeFormatted,
          duration: `${durationMinutes} mins`,
          host: user?.displayName || 'Accounticca Executive Team',
          attendees: guests,
          meetUri: space.meetingUri,
          summary: meetingNotes ? `Agenda & Draft Takeaways: ${meetingNotes}` : 'Scheduled virtual consultation session.',
          notes: `${instanceNotePrefix}${meetingNotes || 'Scheduled advisory session.'}`,
          status: i === 0 ? 'Scheduled' : 'Upcoming',
          recurrence: recurrenceLabel,
          occurrenceInfo: `Instance ${i + 1} of ${totalInstances}`,
          seriesId,
        });
      }

      setPastMeetings((prev) => [...generatedMeetings, ...prev]);

      const initialDateObj = new Date(year, month - 1, day, hours, mins);
      const initialDateFormatted = initialDateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
      const initialTimeFormatted = initialDateObj.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });

      setScheduledConfirmation({
        title: scheduleTitle || 'Advisory Meeting',
        tag: selectedTag,
        priority: selectedPriority,
        dateFormatted: initialDateFormatted,
        timeFormatted: initialTimeFormatted,
        duration: `${durationMinutes} mins`,
        guests,
        meetUri: space.meetingUri,
        notes: meetingNotes,
        recurrence: recurrenceLabel,
        totalInstances,
      });

      // Dispatch global activity event to log in Activity Feed
      window.dispatchEvent(
        new CustomEvent('accounticca_log_activity', {
          detail: {
            type: 'meeting',
            title: `Google Meet Scheduled: ${scheduleTitle || 'Advisory Meeting'}`,
            description: `Scheduled ${recurrenceLabel.toLowerCase()} session for ${initialDateFormatted} at ${initialTimeFormatted} (${durationMinutes} mins).`,
            actor: user?.displayName || 'Executive User',
            metadata: `Priority: ${selectedPriority} • Tag: ${selectedTag} • Guests: ${guests.length}`
          }
        })
      );
    } catch (err: any) {
      console.error('Error scheduling meeting:', err);
      setErrorMsg(err?.message || 'Failed to schedule meeting. Please try again.');
    } finally {
      setIsScheduling(false);
    }
  };

  const handleCopyLink = (uri: string) => {
    navigator.clipboard.writeText(uri);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative space-y-5 overflow-hidden max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-xs">
              <Video className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 text-xs font-bold text-emerald-600 uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Google Workspace API</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Google Meet Video Conferencing
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-2xl text-xs font-bold shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setActiveTab('instant')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'instant'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Instant Room</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'schedule'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Schedule Meeting</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('past')}
            className={`flex-1 py-2 rounded-xl transition flex items-center justify-center space-x-1.5 ${
              activeTab === 'past'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Past Meetings Log ({pastMeetings.length})</span>
          </button>
        </div>

        {errorMsg && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3.5 rounded-2xl text-xs font-medium shrink-0">
            {errorMsg}
          </div>
        )}

        {/* Body Content Container */}
        <div className="overflow-y-auto pr-1 space-y-5 flex-1">
          {!accessToken ? (
            /* Step 1: Sign in with Google */
            <div className="text-center py-4 space-y-5">
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-3 text-left">
                <div className="flex items-center space-x-2 text-slate-900 font-semibold text-sm">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Google Meet Conference Space Integration</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Connect your Google Account to instantly generate secure Google Meet video rooms for client consultations, strategy reviews, and team sessions.
                </p>
              </div>

              <button
                onClick={handleSignIn}
                disabled={isSigningIn}
                type="button"
                className="w-full bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-300 rounded-2xl py-3.5 px-4 shadow-sm hover:shadow transition flex items-center justify-center space-x-3 group disabled:opacity-60"
              >
                {isSigningIn ? (
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span className="text-sm">Sign in with Google to enable Meet</span>
              </button>
            </div>
          ) : (
            <>
              {/* Connected User Profile Bar */}
              <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 px-4 py-2.5 rounded-2xl text-xs text-slate-700">
                <div className="flex items-center space-x-2.5 truncate">
                  {user?.photoURL ? (
                    <img src={user.photoURL} alt="User avatar" className="w-6 h-6 rounded-full" />
                  ) : (
                    <Users className="w-4 h-4 text-blue-600" />
                  )}
                  <span className="font-semibold text-slate-900 truncate">{user?.displayName || user?.email}</span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                  Google Connected
                </span>
              </div>

              {activeTab === 'instant' ? (
                /* Instant Meeting Tab */
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Meeting Topic / Title
                    </label>
                    <input
                      type="text"
                      value={meetingTitle}
                      onChange={(e) => setMeetingTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {/* Category Tag Selection */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <Tag className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Category Tag</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {TAG_OPTIONS.map((tag) => (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setInstantTag(tag)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold border transition ${
                            instantTag === tag
                              ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Meeting Notes Textarea */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                      <FileText className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Meeting Notes & Agenda</span>
                    </label>
                    <textarea
                      rows={2}
                      value={instantNotes}
                      onChange={(e) => setInstantNotes(e.target.value)}
                      placeholder="Draft preliminary meeting notes or key discussion points..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  {!createdMeet ? (
                    <button
                      type="button"
                      onClick={handleCreateSpace}
                      disabled={isCreatingSpace}
                      className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 disabled:opacity-60"
                    >
                      {isCreatingSpace ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                          <span>Provisioning Google Meet Room...</span>
                        </>
                      ) : (
                        <>
                          <Video className="w-4 h-4 shrink-0" />
                          <span>Create Google Meet Space</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 shadow-xl">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                          <Video className="w-4 h-4" />
                          <span>Google Meet Space Ready</span>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${getTagBadgeColor(instantTag)}`}>
                          {instantTag}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-slate-400 mb-1">Live Meeting URL:</p>
                        <div className="bg-slate-800 p-3 rounded-xl flex items-center justify-between space-x-2 text-xs font-mono text-emerald-300 border border-slate-700">
                          <span className="truncate">{createdMeet.meetingUri}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(createdMeet.meetingUri)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition shrink-0"
                            title="Copy link"
                          >
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {instantNotes && (
                        <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/80 space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Session Agenda Notes:</span>
                          <p className="text-xs text-slate-200 leading-relaxed">{instantNotes}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-3 pt-1">
                        <a
                          href={createdMeet.meetingUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md"
                        >
                          <span>Launch Google Meet</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={handleCreateSpace}
                          disabled={isCreatingSpace}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                        >
                          New Space
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : activeTab === 'schedule' ? (
                /* Schedule Future Meeting Tab */
                <div className="space-y-4">
                  {!scheduledConfirmation ? (
                    <form onSubmit={handleScheduleSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                          Session Title / Subject *
                        </label>
                        <input
                          type="text"
                          required
                          value={scheduleTitle}
                          onChange={(e) => setScheduleTitle(e.target.value)}
                          placeholder="e.g. Q3 Financial Advisory & Risk Governance Audit"
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      {/* Category Tag & Priority Selection */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                            <Tag className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Category Tag *</span>
                          </label>
                          <select
                            value={selectedTag}
                            onChange={(e) => setSelectedTag(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                          >
                            {TAG_OPTIONS.map((tag) => (
                              <option key={tag} value={tag}>
                                {tag}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                            <AlertCircle className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Priority Level *</span>
                          </label>
                          <select
                            value={selectedPriority}
                            onChange={(e) => setSelectedPriority(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                          >
                            <option value="Urgent">🚨 Urgent</option>
                            <option value="Standard">⚡ Standard</option>
                            <option value="Low Priority">☕ Low Priority</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                            <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Date *</span>
                          </label>
                          <input
                            type="date"
                            required
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                            <Clock className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Time *</span>
                          </label>
                          <input
                            type="time"
                            required
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                            Duration
                          </label>
                          <select
                            value={durationMinutes}
                            onChange={(e) => setDurationMinutes(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                          >
                            <option value="15">15 Minutes</option>
                            <option value="30">30 Minutes</option>
                            <option value="45">45 Minutes</option>
                            <option value="60">60 Minutes (1 Hour)</option>
                            <option value="90">90 Minutes</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                            <Mail className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Guest Email(s) *</span>
                          </label>
                          <input
                            type="text"
                            placeholder="client@company.com"
                            value={guestEmails}
                            onChange={(e) => setGuestEmails(e.target.value)}
                            className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          />
                        </div>
                      </div>

                      {/* Recurrence Frequency & Count */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                            <Repeat className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Recurrence Pattern</span>
                          </label>
                          <select
                            value={recurrencePattern}
                            onChange={(e) => setRecurrencePattern(e.target.value as any)}
                            className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                          >
                            <option value="none">One-time Session (No Repeat)</option>
                            <option value="weekly">Weekly (Every 7 days)</option>
                            <option value="biweekly">Bi-weekly (Every 2 weeks)</option>
                            <option value="monthly">Monthly (Same date each month)</option>
                          </select>
                        </div>

                        {recurrencePattern !== 'none' ? (
                          <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                              <RotateCw className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Repeat Series Count</span>
                            </label>
                            <select
                              value={recurrenceCount}
                              onChange={(e) => setRecurrenceCount(Number(e.target.value))}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white font-medium"
                            >
                              <option value={2}>2 Occurrences</option>
                              <option value={4}>4 Occurrences</option>
                              <option value={6}>6 Occurrences</option>
                              <option value={8}>8 Occurrences</option>
                              <option value={12}>12 Occurrences</option>
                            </select>
                          </div>
                        ) : (
                          <div className="flex items-center text-slate-400 text-xs italic pt-4">
                            <span>Single consultation session</span>
                          </div>
                        )}
                      </div>

                      {/* Meeting Notes Textarea */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center space-x-1">
                          <FileText className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Meeting Notes & Agenda Takeaways</span>
                        </label>
                        <textarea
                          rows={3}
                          value={meetingNotes}
                          onChange={(e) => setMeetingNotes(e.target.value)}
                          placeholder="Draft agenda items, key metrics to analyze, or required preparation notes for attendees..."
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isScheduling}
                        className="w-full py-3.5 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-lg shadow-emerald-600/20 flex items-center justify-center space-x-2 disabled:opacity-60"
                      >
                        {isScheduling ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                            <span>Scheduling & Provisioning Meet Link...</span>
                          </>
                        ) : (
                          <>
                            <Calendar className="w-4 h-4 shrink-0" />
                            <span>Schedule Meeting & Generate Meet Link</span>
                          </>
                        )}
                      </button>
                    </form>
                  ) : (
                    /* Scheduled Event Confirmation Card */
                    <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-4 shadow-xl border border-emerald-500/30">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div className="flex items-center space-x-2 text-xs text-emerald-400 font-bold uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Meeting Scheduled</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getTagBadgeColor(scheduledConfirmation.tag)}`}>
                            {scheduledConfirmation.tag}
                          </span>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border flex items-center space-x-1 ${getPriorityBadgeColor(scheduledConfirmation.priority)}`}>
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            <span>{scheduledConfirmation.priority || 'Standard'}</span>
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-base font-bold text-white font-serif">
                          {scheduledConfirmation.title}
                        </h4>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300 pt-1">
                          <div className="flex items-center space-x-2 bg-slate-800/80 p-2 rounded-lg">
                            <Calendar className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span className="truncate">{scheduledConfirmation.dateFormatted}</span>
                          </div>
                          <div className="flex items-center space-x-2 bg-slate-800/80 p-2 rounded-lg">
                            <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                            <span>{scheduledConfirmation.timeFormatted} ({scheduledConfirmation.duration})</span>
                          </div>
                        </div>

                        {scheduledConfirmation.recurrence && scheduledConfirmation.recurrence !== 'One-time' && (
                          <div className="bg-indigo-950/80 border border-indigo-500/40 p-2.5 rounded-xl flex items-center justify-between text-xs text-indigo-300">
                            <div className="flex items-center space-x-2">
                              <Repeat className="w-4 h-4 text-indigo-400 shrink-0" />
                              <span className="font-semibold">Recurring Series ({scheduledConfirmation.recurrence})</span>
                            </div>
                            <span className="text-[10px] bg-indigo-500/20 text-indigo-200 px-2 py-0.5 rounded-full border border-indigo-400/30 font-mono">
                              {scheduledConfirmation.totalInstances} Instances Generated
                            </span>
                          </div>
                        )}

                        {scheduledConfirmation.guests.length > 0 && (
                          <div className="text-xs text-slate-400 pt-1 flex items-center space-x-1.5">
                            <Users className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            <span>Guests: {scheduledConfirmation.guests.join(', ')}</span>
                          </div>
                        )}
                      </div>

                      {scheduledConfirmation.notes && (
                        <div className="bg-slate-800/90 p-3 rounded-xl border border-slate-700/80 space-y-1">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                            <FileText className="w-3 h-3 text-emerald-400" />
                            <span>Agenda & Draft Notes:</span>
                          </span>
                          <p className="text-xs text-slate-200 leading-relaxed">{scheduledConfirmation.notes}</p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-slate-400 mb-1">Assigned Google Meet Link:</p>
                        <div className="bg-slate-800 p-3 rounded-xl flex items-center justify-between space-x-2 text-xs font-mono text-emerald-300 border border-slate-700">
                          <span className="truncate">{scheduledConfirmation.meetUri}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyLink(scheduledConfirmation.meetUri)}
                            className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 transition shrink-0"
                            title="Copy link"
                          >
                            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* 15-Minute Prior Email Alert Card */}
                      <div className="bg-emerald-950/70 border border-emerald-500/40 rounded-xl p-3.5 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 text-emerald-300 font-bold">
                            <Mail className="w-4 h-4 text-emerald-400 shrink-0 animate-pulse" />
                            <span>15-Minute Prior Email Alert Simulator</span>
                          </div>
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40 font-mono">
                            T-15m Active
                          </span>
                        </div>
                        <p className="text-emerald-200/80 text-[11px] leading-tight">
                          Automated email invite & Meet room link queued for dispatch to <strong className="text-white">{scheduledConfirmation.guests[0] || 'client@example.com'}</strong> exactly 15 minutes before session start time.
                        </p>
                        <div className="flex items-center justify-end pt-1">
                          <button
                            type="button"
                            onClick={() => triggerTestReminder(scheduledConfirmation.title, scheduledConfirmation.meetUri)}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-[11px] transition shadow-md flex items-center space-x-1.5"
                          >
                            <Bell className="w-3.5 h-3.5" />
                            <span>Simulate 15-Min Email Alert Toast</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <a
                          href={scheduledConfirmation.meetUri}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition flex items-center justify-center space-x-2 shadow-md"
                        >
                          <span>Open Google Meet</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                        <button
                          type="button"
                          onClick={() => setScheduledConfirmation(null)}
                          className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                        >
                          Schedule Another
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                /* Past Meetings Tab */
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 font-serif">Virtual Consultation History</h4>
                      <p className="text-xs text-slate-500">Recorded logs, category tags, and notes from Google Meet sessions</p>
                    </div>
                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        type="button"
                        onClick={handleDownloadCSV}
                        className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs transition border border-emerald-200 flex items-center space-x-1.5 shadow-2xs"
                        title="Download consultation logs as CSV file"
                      >
                        <Download className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Download CSV</span>
                      </button>
                      <span className="text-xs bg-slate-100 text-slate-700 font-bold px-2.5 py-1 rounded-full border border-slate-200">
                        {pastMeetings.length} Records
                      </span>
                    </div>
                  </div>

                  {/* Category Tag Filter Pills */}
                  <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
                    <span className="text-slate-400 font-semibold flex items-center space-x-1 shrink-0 mr-1">
                      <Filter className="w-3 h-3" />
                      <span>Filter:</span>
                    </span>
                    {['All', ...TAG_OPTIONS].map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => setFilterTag(tag)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition shrink-0 ${
                          filterTag === tag
                            ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>

                  {/* Meetings List with Slide-In Transition and Subtle Hover Effect */}
                  <div className="space-y-3">
                    {pastMeetings
                      .filter((m) => filterTag === 'All' || m.tag === filterTag)
                      .map((item, index) => (
                        <div
                          key={item.id}
                          style={{ animationDelay: `${index * 70}ms` }}
                          className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 space-y-2.5 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-emerald-300/80 hover:bg-white animate-fadeIn"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center space-x-2 text-[11px] font-semibold text-slate-500 mb-1 flex-wrap gap-1">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTagBadgeColor(item.tag)}`}>
                                  {item.tag}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border flex items-center space-x-1 ${getPriorityBadgeColor(item.priority)}`}>
                                  <AlertCircle className="w-3 h-3 shrink-0" />
                                  <span>{item.priority || 'Standard'}</span>
                                </span>
                                {item.recurrence && item.recurrence !== 'One-time' && (
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 flex items-center space-x-1 shrink-0">
                                    <Repeat className="w-3 h-3 text-indigo-600" />
                                    <span>{item.recurrence} ({item.occurrenceInfo || 'Series'})</span>
                                  </span>
                                )}
                                <span className="flex items-center space-x-1">
                                  <Calendar className="w-3 h-3 text-emerald-600" />
                                  <span>{item.date} • {item.time}</span>
                                </span>
                                <span className="text-slate-300">•</span>
                                <span className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  <span>{item.duration}</span>
                                </span>
                              </div>
                              <h5 className="text-sm font-bold text-slate-900 font-serif leading-snug">{item.title}</h5>
                            </div>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full uppercase shrink-0">
                              {item.status}
                            </span>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed bg-white border border-slate-200/60 p-2.5 rounded-xl shadow-2xs">
                            <span className="font-semibold text-slate-800">Summary Note: </span>
                            {item.summary}
                          </p>

                          {item.notes && (
                            <div className="bg-emerald-50/50 border border-emerald-100 p-2.5 rounded-xl text-xs text-emerald-950 flex items-start space-x-2">
                              <FileText className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold text-emerald-900">Meeting Notes & Agenda: </span>
                                <span>{item.notes}</span>
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                            <span className="truncate">Hosted by: {item.host}</span>
                            <a
                              href={item.meetUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center space-x-1 shrink-0"
                            >
                              <span>Re-open Room</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      ))}

                    {pastMeetings.filter((m) => filterTag === 'All' || m.tag === filterTag).length === 0 && (
                      <div className="text-center py-8 bg-slate-50 border border-slate-200/60 rounded-2xl text-slate-500 text-xs">
                        No meeting records match category tag: <strong>{filterTag}</strong>.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-slate-100 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-full text-slate-500 hover:bg-slate-100 text-xs font-semibold transition"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

