import React, { useState, useEffect } from 'react';
import {
  Activity,
  Calendar,
  FileText,
  ShieldCheck,
  Milestone,
  Video,
  Download,
  UserCheck,
  Filter,
  Search,
  Plus,
  RefreshCw,
  Clock,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  ArrowUpRight,
  Printer,
  ChevronRight,
  TrendingUp,
  Tag
} from 'lucide-react';

export interface ActivityLogItem {
  id: string;
  type: 'meeting' | 'report' | 'assessment' | 'milestone' | 'consultation' | 'general';
  title: string;
  description: string;
  timestamp: string;
  rawDate: Date;
  actor: string;
  badgeText: string;
  badgeColor: string;
  metadata?: string;
}

const DEFAULT_ACTIVITIES: ActivityLogItem[] = [
  {
    id: 'act-1',
    type: 'meeting',
    title: 'Google Meet Strategy Session Scheduled',
    description: 'Scheduled virtual advisory meeting for Q3 Tax Drag & Overhead Review with Senior Partner.',
    timestamp: '12 mins ago',
    rawDate: new Date(Date.now() - 12 * 60 * 1000),
    actor: 'Accounticca Advisory Bot',
    badgeText: 'Meeting Scheduled',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    metadata: 'Google Meet ID: meet-x92a-88q'
  },
  {
    id: 'act-2',
    type: 'report',
    title: 'Financial Health Audit PDF Exported',
    description: 'Generated and downloaded comprehensive P&L Diagnostic & Revenue Sensitivity Report.',
    timestamp: '45 mins ago',
    rawDate: new Date(Date.now() - 45 * 60 * 1000),
    actor: 'Executive Dashboard User',
    badgeText: 'Report Exported',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    metadata: 'Format: Vector PDF • 1.4 MB'
  },
  {
    id: 'act-3',
    type: 'assessment',
    title: '5-Minute Financial Health Assessment Completed',
    description: 'Completed corporate health diagnostic survey. Overall health score calculated at 84/100 (+12 pts benchmark).',
    timestamp: '2 hours ago',
    rawDate: new Date(Date.now() - 120 * 60 * 1000),
    actor: 'Client Executive',
    badgeText: 'Assessment Completed',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    metadata: 'Score: 84/100 (Strong Baseline)'
  },
  {
    id: 'act-4',
    type: 'milestone',
    title: 'Strategic Roadmap Phase Updated',
    description: 'Updated milestone "ERP Systems & Accounts Pipeline Workflows Automation" status to In Progress.',
    timestamp: '5 hours ago',
    rawDate: new Date(Date.now() - 300 * 60 * 1000),
    actor: 'Senior Fractional CFO',
    badgeText: 'Milestone Updated',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    metadata: 'Phase 3 • Target KPI: -40 hrs/mo'
  },
  {
    id: 'act-5',
    type: 'consultation',
    title: '1-on-1 Confidential Advisory Request Submitted',
    description: 'Submitted booking inquiry for Corporate Holding Structure & Entity Tax Restructuring.',
    timestamp: 'Yesterday at 4:15 PM',
    rawDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    actor: 'Managing Director',
    badgeText: 'Consultation Requested',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    metadata: 'Priority: High • SLA: 24 Hours'
  }
];

interface ActivityFeedProps {
  onOpenConsultation?: (note?: string) => void;
  onOpenGoogleMeet?: () => void;
  className?: string;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  onOpenConsultation,
  onOpenGoogleMeet,
  className = ''
}) => {
  const [activities, setActivities] = useState<ActivityLogItem[]>(() => {
    try {
      const saved = localStorage.getItem('accounticca_activity_feed');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Failed to parse activity feed from storage', e);
    }
    return DEFAULT_ACTIVITIES;
  });

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New action form state
  const [newActionType, setNewActionType] = useState<ActivityLogItem['type']>('meeting');
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newActor, setNewActor] = useState('Executive Team Member');

  // Persist activities to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('accounticca_activity_feed', JSON.stringify(activities));
    } catch (e) {
      console.warn('Could not save activities to localStorage', e);
    }
  }, [activities]);

  // Listen for custom global events to auto-log user actions from other components
  useEffect(() => {
    const handleGlobalActivity = (e: Event) => {
      const customEvent = e as CustomEvent<Partial<ActivityLogItem>>;
      if (customEvent.detail && customEvent.detail.title) {
        const detail = customEvent.detail;
        const type = detail.type || 'general';
        
        let badgeText = 'System Event';
        let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';

        if (type === 'meeting') {
          badgeText = 'Meeting Scheduled';
          badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
        } else if (type === 'report') {
          badgeText = 'Report Exported';
          badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
        } else if (type === 'assessment') {
          badgeText = 'Assessment Completed';
          badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
        } else if (type === 'milestone') {
          badgeText = 'Milestone Updated';
          badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
        } else if (type === 'consultation') {
          badgeText = 'Consultation Requested';
          badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
        }

        const newLog: ActivityLogItem = {
          id: `act-${Date.now()}`,
          type,
          title: detail.title,
          description: detail.description || 'Action logged by user interaction.',
          timestamp: 'Just now',
          rawDate: new Date(),
          actor: detail.actor || 'Client Executive',
          badgeText: detail.badgeText || badgeText,
          badgeColor: detail.badgeColor || badgeColor,
          metadata: detail.metadata
        };

        setActivities((prev) => [newLog, ...prev]);
      }
    };

    window.addEventListener('accounticca_log_activity', handleGlobalActivity);
    return () => window.removeEventListener('accounticca_log_activity', handleGlobalActivity);
  }, []);

  const handleAddCustomLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    let badgeText = 'Action Logged';
    let badgeColor = 'bg-slate-100 text-slate-800 border-slate-200';

    if (newActionType === 'meeting') {
      badgeText = 'Meeting Scheduled';
      badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-200';
    } else if (newActionType === 'report') {
      badgeText = 'Report Exported';
      badgeColor = 'bg-purple-100 text-purple-800 border-purple-200';
    } else if (newActionType === 'assessment') {
      badgeText = 'Assessment Completed';
      badgeColor = 'bg-amber-100 text-amber-800 border-amber-200';
    } else if (newActionType === 'milestone') {
      badgeText = 'Milestone Updated';
      badgeColor = 'bg-blue-100 text-blue-800 border-blue-200';
    } else if (newActionType === 'consultation') {
      badgeText = 'Consultation Requested';
      badgeColor = 'bg-rose-100 text-rose-800 border-rose-200';
    }

    const newItem: ActivityLogItem = {
      id: `act-${Date.now()}`,
      type: newActionType,
      title: newTitle.trim(),
      description: newDescription.trim() || 'Manual activity entry added to dashboard history.',
      timestamp: 'Just now',
      rawDate: new Date(),
      actor: newActor.trim() || 'Executive Team',
      badgeText,
      badgeColor,
      metadata: 'Manual Audit Entry'
    };

    setActivities((prev) => [newItem, ...prev]);
    setNewTitle('');
    setNewDescription('');
    setShowAddModal(false);
  };

  const handleClearActivities = () => {
    if (window.confirm('Are you sure you want to reset the Activity Feed to default sample entries?')) {
      setActivities(DEFAULT_ACTIVITIES);
      localStorage.removeItem('accounticca_activity_feed');
    }
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Type', 'Badge', 'Title', 'Description', 'Actor', 'Timestamp', 'Metadata'];
    const rows = activities.map((a) => [
      a.id,
      a.type,
      `"${a.badgeText}"`,
      `"${a.title.replace(/"/g, '""')}"`,
      `"${a.description.replace(/"/g, '""')}"`,
      `"${a.actor}"`,
      `"${a.timestamp}"`,
      `"${(a.metadata || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Accounticca_Activity_Log_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter & Search Logic
  const filteredActivities = activities.filter((act) => {
    const matchesFilter = activeFilter === 'all' || act.type === activeFilter;
    const matchesQuery =
      searchQuery.trim() === '' ||
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.badgeText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.actor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  const getActionIcon = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'meeting':
        return <Video className="w-4 h-4 text-emerald-600" />;
      case 'report':
        return <FileText className="w-4 h-4 text-purple-600" />;
      case 'assessment':
        return <ShieldCheck className="w-4 h-4 text-amber-600" />;
      case 'milestone':
        return <Milestone className="w-4 h-4 text-blue-600" />;
      case 'consultation':
        return <UserCheck className="w-4 h-4 text-rose-600" />;
      default:
        return <Activity className="w-4 h-4 text-slate-600" />;
    }
  };

  const getActionIconBg = (type: ActivityLogItem['type']) => {
    switch (type) {
      case 'meeting':
        return 'bg-emerald-50 border-emerald-200/80';
      case 'report':
        return 'bg-purple-50 border-purple-200/80';
      case 'assessment':
        return 'bg-amber-50 border-amber-200/80';
      case 'milestone':
        return 'bg-blue-50 border-blue-200/80';
      case 'consultation':
        return 'bg-rose-50 border-rose-200/80';
      default:
        return 'bg-slate-50 border-slate-200/80';
    }
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200/90 shadow-xl overflow-hidden ${className}`}>
      
      {/* Top Header */}
      <div className="p-6 sm:p-8 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Activity className="w-3.5 h-3.5 text-blue-400" />
              <span>Audit Trail & Engagement Feed</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white tracking-tight">
              Recent Engagement Activity Feed
            </h3>
            <p className="text-slate-400 text-xs leading-relaxed">
              Real-time audit log of scheduled strategy sessions, report exports, health diagnostic assessments, and roadmap updates.
            </p>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowAddModal(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center space-x-1.5 shadow-md cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Log Action</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              title="Export Activity History CSV"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 cursor-pointer"
            >
              <Download className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleClearActivities}
              title="Reset Sample Logs"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Activity Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Total Logs</span>
            <span className="text-lg font-bold font-mono text-white">{activities.length}</span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Meetings</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {activities.filter((a) => a.type === 'meeting').length}
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Reports Exported</span>
            <span className="text-lg font-bold font-mono text-purple-400">
              {activities.filter((a) => a.type === 'report').length}
            </span>
          </div>

          <div className="bg-slate-800/60 p-3 rounded-2xl border border-slate-700/60">
            <span className="text-slate-400 text-[10px] uppercase font-bold tracking-wider block">Diagnostics</span>
            <span className="text-lg font-bold font-mono text-amber-400">
              {activities.filter((a) => a.type === 'assessment').length}
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="p-4 sm:px-8 border-b border-slate-200 bg-slate-50/80 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Search Field */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search activity logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { key: 'all', label: 'All Activity' },
            { key: 'meeting', label: 'Meetings' },
            { key: 'report', label: 'Exports' },
            { key: 'assessment', label: 'Assessments' },
            { key: 'milestone', label: 'Roadmap' },
            { key: 'consultation', label: 'Requests' }
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFilter(tab.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition border cursor-pointer ${
                activeFilter === tab.key
                  ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Activity Timeline List */}
      <div className="p-4 sm:p-8 space-y-4 max-h-[500px] overflow-y-auto">
        {filteredActivities.length > 0 ? (
          filteredActivities.map((act, index) => (
            <div
              key={act.id}
              className="flex items-start space-x-3 sm:space-x-4 p-4 rounded-2xl bg-slate-50/60 hover:bg-slate-100/80 border border-slate-200/70 transition-all duration-200 group"
            >
              {/* Category Icon Badge */}
              <div className={`p-3 rounded-2xl border ${getActionIconBg(act.type)} shrink-0 shadow-xs`}>
                {getActionIcon(act.type)}
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-1 min-w-0">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-2 flex-wrap gap-1">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${act.badgeColor}`}>
                      {act.badgeText}
                    </span>
                    <span className="text-xs font-bold text-slate-900 truncate">{act.title}</span>
                  </div>

                  <span className="text-[11px] font-medium text-slate-400 flex items-center space-x-1 shrink-0 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{act.timestamp}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {act.description}
                </p>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-200/50">
                  <span className="font-medium text-slate-500">By: {act.actor}</span>
                  {act.metadata && (
                    <span className="bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-md text-[10px] font-mono">
                      {act.metadata}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-500 text-xs space-y-2">
            <Activity className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="font-semibold text-slate-700">No activity logs found</p>
            <p className="text-slate-400 max-w-xs mx-auto">
              No matching activity feed events found for the search or filter applied.
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="mt-2 text-blue-600 font-bold underline cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Footer Bar */}
      <div className="p-4 sm:px-8 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Real-time Audit Trail active • Updates logged locally across app sessions.</span>
        </div>

        <div className="flex items-center space-x-3">
          {onOpenGoogleMeet && (
            <button
              type="button"
              onClick={onOpenGoogleMeet}
              className="text-emerald-700 hover:text-emerald-800 font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Schedule Meet</span>
            </button>
          )}

          {onOpenConsultation && (
            <button
              type="button"
              onClick={() => onOpenConsultation('Inquiry triggered via Activity Feed audit log overview.')}
              className="text-blue-600 hover:text-blue-700 font-bold transition flex items-center space-x-1 cursor-pointer"
            >
              <span>Partner Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Modal: Log Manual Action */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full text-slate-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-5 h-5 text-blue-600" />
                <h3 className="text-base font-serif font-bold text-slate-900">Log Manual Engagement Action</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCustomLog} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Action Category *</label>
                <select
                  value={newActionType}
                  onChange={(e) => setNewActionType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="meeting">Meeting Scheduled</option>
                  <option value="report">Report Exported</option>
                  <option value="assessment">Assessment Completed</option>
                  <option value="milestone">Milestone Updated</option>
                  <option value="consultation">Consultation Requested</option>
                  <option value="general">General System Note</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Activity Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Tax Audit Report Shared with Board"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description / Summary</label>
                <textarea
                  rows={2}
                  placeholder="Details regarding this engagement action..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Performed By (Actor)</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Director or Senior CFO"
                  value={newActor}
                  onChange={(e) => setNewActor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs cursor-pointer"
                >
                  Save to Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
