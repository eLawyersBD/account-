import React, { useState, useMemo } from 'react';
import { ClientProject, ProjectMilestone, ClientDocument, MilestoneStatus } from '../../types';
import { updateMilestoneStatus, updateMilestoneDetails, addProjectMilestone, approveMilestone } from '../../lib/portalService';
import { auth } from '../../lib/firebase';
import { subscribeToProjectTimeEntries } from '../../lib/portalService';
import { TimeEntry } from '../../types';
import { TimeTrackingModal } from './TimeTrackingModal';
import { X } from 'lucide-react';
import { 
  CheckCircle2, 
  Clock, 
  CircleDot, 
  Calendar, 
  FileText, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  ChevronRight, 
  User, 
  Layers, 
  Flag, 
  TrendingUp, 
  BarChart3, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  Briefcase,
  AlertCircle,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  X,
  Workflow,
  PauseCircle,
  Eye,
  Info,
  RefreshCw
} from 'lucide-react';

interface ProjectTimelineViewProps {
  project: ClientProject;
  onOpenDocumentPreview?: (doc: ClientDocument) => void;
  onOpenUploadModal?: (projectId?: string, projectTitle?: string) => void;
}

// Status styling configuration helper
export const getMilestoneStatusConfig = (status: string, dueDate?: string) => {
  const normalized = (status || 'upcoming').toLowerCase();
  
  // Check if milestone is overdue
  const isOverdue = dueDate && new Date(dueDate).getTime() < new Date().setHours(0, 0, 0, 0) && normalized !== 'completed';

  switch (normalized) {
    case 'completed':
      return {
        key: 'completed',
        label: 'Completed',
        badgeBg: 'bg-emerald-50 border-emerald-200/80 text-emerald-800',
        badgePill: 'bg-emerald-500 text-white',
        dotColor: 'bg-emerald-500',
        ganttBar: 'bg-emerald-500 text-white shadow-xs border border-emerald-400',
        icon: CheckCircle2,
        iconColor: 'text-emerald-600',
        cardBorder: 'border-emerald-200/80 bg-emerald-50/30 hover:bg-emerald-50/50',
        stepNode: 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100',
        textColor: 'text-emerald-700',
        description: 'Deliverable signed off and verified'
      };
    case 'finalized':
      return {
        key: 'finalized',
        label: 'Finalized',
        badgeBg: 'bg-indigo-50 border-indigo-200/80 text-indigo-800',
        badgePill: 'bg-indigo-600 text-white',
        dotColor: 'bg-indigo-600',
        ganttBar: 'bg-indigo-600 text-white shadow-xs border border-indigo-500',
        icon: CheckCircle2,
        iconColor: 'text-indigo-600',
        cardBorder: 'border-indigo-200/80 bg-indigo-50/30 hover:bg-indigo-50/50',
        stepNode: 'bg-indigo-700 text-white shadow-sm ring-4 ring-indigo-100',
        textColor: 'text-indigo-800',
        description: 'Milestone digitally signed off'
      };
    case 'in_progress':
      return {
        key: 'in_progress',
        label: 'In Progress',
        badgeBg: 'bg-blue-50 border-blue-200/80 text-blue-800',
        badgePill: 'bg-blue-600 text-white',
        dotColor: 'bg-blue-600',
        ganttBar: 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white shadow-md shadow-blue-500/20 ring-2 ring-blue-400/40 border border-blue-400',
        icon: CircleDot,
        iconColor: 'text-blue-600',
        cardBorder: 'border-blue-300/80 bg-blue-50/30 ring-1 ring-blue-500/10 hover:bg-blue-50/60',
        stepNode: 'bg-blue-600 text-white ring-4 ring-blue-100 shadow-md animate-pulse',
        textColor: 'text-blue-700',
        description: 'Active sprint execution in progress'
      };
    case 'delayed':
      return {
        key: 'delayed',
        label: 'Delayed',
        badgeBg: 'bg-rose-50 border-rose-200/80 text-rose-800',
        badgePill: 'bg-rose-600 text-white',
        dotColor: 'bg-rose-600',
        ganttBar: 'bg-gradient-to-r from-rose-500 via-amber-600 to-rose-600 text-white shadow-md shadow-rose-500/20 border border-rose-300 ring-2 ring-rose-400/30',
        icon: AlertTriangle,
        iconColor: 'text-rose-600',
        cardBorder: 'border-rose-300 bg-rose-50/30 ring-1 ring-rose-500/15 hover:bg-rose-50/50',
        stepNode: 'bg-rose-600 text-white ring-4 ring-rose-100 shadow-md',
        textColor: 'text-rose-700',
        description: 'Schedule variance detected; mitigation in flight'
      };
    case 'review':
      return {
        key: 'review',
        label: 'Under Review',
        badgeBg: 'bg-purple-50 border-purple-200/80 text-purple-800',
        badgePill: 'bg-purple-600 text-white',
        dotColor: 'bg-purple-600',
        ganttBar: 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white border border-purple-400',
        icon: Eye,
        iconColor: 'text-purple-600',
        cardBorder: 'border-purple-300 bg-purple-50/30 ring-1 ring-purple-500/10 hover:bg-purple-50/50',
        stepNode: 'bg-purple-600 text-white ring-4 ring-purple-100 shadow-md',
        textColor: 'text-purple-700',
        description: 'Client executive review & approval pending'
      };
    case 'on_hold':
      return {
        key: 'on_hold',
        label: 'On Hold',
        badgeBg: 'bg-amber-50 border-amber-200/80 text-amber-800',
        badgePill: 'bg-amber-600 text-white',
        dotColor: 'bg-amber-600',
        ganttBar: 'bg-amber-500 text-white border border-amber-400',
        icon: PauseCircle,
        iconColor: 'text-amber-600',
        cardBorder: 'border-amber-200 bg-amber-50/30 hover:bg-amber-50/50',
        stepNode: 'bg-amber-500 text-white ring-4 ring-amber-100 shadow-sm',
        textColor: 'text-amber-700',
        description: 'Awaiting client dependencies'
      };
    case 'upcoming':
    default:
      return {
        key: 'upcoming',
        label: isOverdue ? 'Overdue Schedule' : 'Upcoming',
        badgeBg: isOverdue ? 'bg-amber-50 border-amber-200 text-amber-800' : 'bg-slate-100 border-slate-200 text-slate-700',
        badgePill: isOverdue ? 'bg-amber-600 text-white' : 'bg-slate-500 text-white',
        dotColor: isOverdue ? 'bg-amber-500' : 'bg-slate-400',
        ganttBar: isOverdue ? 'bg-amber-400 text-slate-900 border border-amber-500' : 'bg-slate-300 text-slate-700 border border-slate-300',
        icon: isOverdue ? AlertCircle : Clock,
        iconColor: isOverdue ? 'text-amber-600' : 'text-slate-400',
        cardBorder: isOverdue ? 'border-amber-300 bg-amber-50/20 hover:bg-amber-50/40' : 'border-slate-200 bg-white hover:border-slate-300',
        stepNode: isOverdue ? 'bg-amber-500 text-white ring-4 ring-amber-100' : 'bg-white border-2 border-slate-300 text-slate-500 group-hover:border-blue-400',
        textColor: isOverdue ? 'text-amber-700' : 'text-slate-600',
        description: isOverdue ? 'Past target due date — needs sprint adjustment' : 'Scheduled in future sprint window'
      };
  }
};

export const ProjectTimelineView: React.FC<ProjectTimelineViewProps> = ({
  project,
  onOpenDocumentPreview,
  onOpenUploadModal
}) => {
  const [viewMode, setViewMode] = useState<'gantt' | 'stepper'>('gantt');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedMilestoneId, setSelectedMilestoneId] = useState<string | null>(
    project.milestones?.[0]?.id || null
  );
  const [isAddMilestoneModalOpen, setIsAddMilestoneModalOpen] = useState(false);
  const [isTimeTrackerModalOpen, setIsTimeTrackerModalOpen] = useState(false);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [savingMilestone, setSavingMilestone] = useState(false);
  
  useEffect(() => {
    if (!project.id || !auth.currentUser) return;
    const unsubscribe = subscribeToProjectTimeEntries(auth.currentUser.uid, project.id, (entries) => {
      setTimeEntries(entries);
    });
    return () => unsubscribe();
  }, [project.id, auth.currentUser]);
  const [editingDelayReason, setEditingDelayReason] = useState(false);
  const [tempDelayReason, setTempDelayReason] = useState('');
  
  // New Milestone Form State
  const [newTitle, setNewTitle] = useState('');
  const [newPhase, setNewPhase] = useState('Phase 3: Deployment');
  const [newStatus, setNewStatus] = useState<MilestoneStatus>('upcoming');
  const [newStartDate, setNewStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [newDueDate, setNewDueDate] = useState(
    new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [newDescription, setNewDescription] = useState('');
  const [newOwner, setNewOwner] = useState(project.leadConsultantName || 'Sarah Jenkins, FCA');
  const [newOutputs, setNewOutputs] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const milestones = useMemo(() => project.milestones || [], [project.milestones]);

  const filteredMilestones = useMemo(() => {
    if (filterStatus === 'all') return milestones;
    return milestones.filter(m => (m.status || 'upcoming').toLowerCase() === filterStatus);
  }, [milestones, filterStatus]);

  // Selected milestone object
  const activeMilestone = useMemo(() => {
    return milestones.find(m => m.id === selectedMilestoneId) || milestones[0] || null;
  }, [milestones, selectedMilestoneId]);

  // Compute status counts for live Firestore querying display
  const completedCount = useMemo(() => milestones.filter(m => m.status === 'completed').length, [milestones]);
  const inProgressCount = useMemo(() => milestones.filter(m => m.status === 'in_progress').length, [milestones]);
  const delayedCount = useMemo(() => milestones.filter(m => m.status === 'delayed').length, [milestones]);
  const upcomingCount = useMemo(() => milestones.filter(m => !m.status || m.status === 'upcoming').length, [milestones]);

  const milestoneEntries = useMemo(() => 
    timeEntries.filter(e => e.milestoneId === activeMilestone?.id),
    [timeEntries, activeMilestone?.id]
  );
  const totalMilestoneHours = milestoneEntries.reduce((sum, e) => sum + e.hours, 0);
  const totalProjectHours = timeEntries.reduce((sum, e) => sum + e.hours, 0);

  // Compute Gantt date boundaries
  const { minTime, maxTime, totalDays, timeMarks } = useMemo(() => {
    if (milestones.length === 0) {
      const now = new Date();
      return { 
        minTime: now.getTime(), 
        maxTime: now.getTime() + 90 * 86400000, 
        totalDays: 90,
        timeMarks: []
      };
    }

    let min = new Date(project.startDate || milestones[0].startDate || milestones[0].dueDate).getTime();
    let max = new Date(project.targetCompletionDate || milestones[milestones.length - 1].dueDate).getTime();

    milestones.forEach(m => {
      if (m.startDate) {
        const s = new Date(m.startDate).getTime();
        if (!isNaN(s) && s < min) min = s;
      }
      if (m.dueDate) {
        const d = new Date(m.dueDate).getTime();
        if (!isNaN(d) && d > max) max = d;
      }
    });

    // Add 5% padding to edges
    const span = Math.max(86400000 * 14, max - min);
    const paddedMin = min - span * 0.03;
    const paddedMax = max + span * 0.05;
    const totalDaysCount = Math.ceil((paddedMax - paddedMin) / (86400000));

    // Generate monthly or weekly column markers
    const marks: { label: string; percent: number }[] = [];
    const stepDays = totalDaysCount > 90 ? 30 : totalDaysCount > 45 ? 14 : 7;
    
    let currentMarker = new Date(paddedMin);
    while (currentMarker.getTime() <= paddedMax) {
      const pct = ((currentMarker.getTime() - paddedMin) / (paddedMax - paddedMin)) * 100;
      marks.push({
        label: currentMarker.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        percent: Math.min(100, Math.max(0, pct))
      });
      currentMarker = new Date(currentMarker.getTime() + stepDays * 86400000);
    }

    return {
      minTime: paddedMin,
      maxTime: paddedMax,
      totalDays: totalDaysCount,
      timeMarks: marks
    };
  }, [milestones, project.startDate, project.targetCompletionDate]);

  // Today position on the Gantt axis
  const todayPercent = useMemo(() => {
    const now = Date.now();
    if (now < minTime) return 0;
    if (now > maxTime) return 100;
    return ((now - minTime) / (maxTime - minTime)) * 100;
  }, [minTime, maxTime]);

  const handleStatusChange = async (
    milestoneId: string, 
    newStatusVal: MilestoneStatus | string, 
    delayNote?: string
  ) => {
    try {
      await updateMilestoneStatus(project.id, milestoneId, newStatusVal, milestones, delayNote);
      if (newStatusVal === 'delayed' && !delayNote) {
        setEditingDelayReason(true);
      }
    } catch (err) {
      console.error('Failed to update milestone status in Firestore:', err);
    }
  };

  const handleApprove = async (milestoneId: string, title: string) => {
    if (!auth.currentUser || !project.id) return;
    await approveMilestone(project.id, milestoneId, title, auth.currentUser.uid, milestones);
  };

  const handleProgressChange = async (milestoneId: string, progress: number) => {
    try {
      const computedStatus = progress === 100 ? 'completed' : progress > 0 ? 'in_progress' : 'upcoming';
      await updateMilestoneDetails(project.id, milestoneId, { progress, status: computedStatus }, milestones);
    } catch (err) {
      console.error('Failed to update milestone progress in Firestore:', err);
    }
  };

  const handleSaveDelayReason = async () => {
    if (!activeMilestone) return;
    try {
      await updateMilestoneDetails(
        project.id, 
        activeMilestone.id, 
        { delayReason: tempDelayReason.trim() }, 
        milestones
      );
      setEditingDelayReason(false);
    } catch (err) {
      console.error('Failed to update delay reason:', err);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Please enter a milestone title.');
      return;
    }

    setSavingMilestone(true);
    setFormError(null);

    const outputsArray = newOutputs
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    try {
      const initialProgress = newStatus === 'completed' ? 100 : newStatus === 'in_progress' ? 40 : newStatus === 'delayed' ? 25 : 0;
      const created = await addProjectMilestone(
        project.id,
        {
          title: newTitle.trim(),
          phase: newPhase.trim(),
          startDate: newStartDate,
          dueDate: newDueDate,
          status: newStatus,
          progress: initialProgress,
          owner: newOwner.trim(),
          description: newDescription.trim() || 'Strategic delivery checkpoint defined by executive client committee.',
          keyOutputs: outputsArray.length > 0 ? outputsArray : ['Executive Review Report', 'Deliverable Checkpoint'],
          delayReason: newStatus === 'delayed' ? 'Schedule adjusted to accommodate third-party integration dependencies.' : undefined
        },
        milestones
      );

      setIsAddMilestoneModalOpen(false);
      setSelectedMilestoneId(created.id);
      setNewTitle('');
      setNewDescription('');
      setNewOutputs('');
      setNewStatus('upcoming');
    } catch (err: any) {
      console.error('Failed to save milestone to Firestore:', err);
      setFormError(err.message || 'Failed to create milestone in Firestore.');
    } finally {
      setSavingMilestone(false);
    }
  };

  // Calculate milestone bar geometry
  const getMilestoneBarGeometry = (m: ProjectMilestone, index: number) => {
    const sDate = m.startDate 
      ? new Date(m.startDate).getTime() 
      : (minTime + (index * ((maxTime - minTime) / Math.max(1, milestones.length))));
    
    const dDate = m.dueDate 
      ? new Date(m.dueDate).getTime() 
      : sDate + (14 * 86400000);

    const left = Math.max(0, Math.min(95, ((sDate - minTime) / (maxTime - minTime)) * 100));
    const right = Math.max(left + 5, Math.min(100, ((dDate - minTime) / (maxTime - minTime)) * 100));
    const width = Math.max(6, right - left);

    return { left, width };
  };

  return (
    <div className="space-y-6">
      
      {/* Top Controls & View Mode Toggle Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100 shadow-2xs">
              <Workflow className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-bold font-serif text-slate-900">
                  Project Timeline & Milestone Status
                </h3>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-mono font-bold flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Live Firestore Sync</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time milestone tracking with visual status indicators queried from Firestore
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Pills & Add Action */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Gantt vs Stepper Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-semibold">
            <button
              onClick={() => setViewMode('gantt')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                viewMode === 'gantt'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Gantt Chart</span>
            </button>
            <button
              onClick={() => setViewMode('stepper')}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center space-x-1.5 ${
                viewMode === 'stepper'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Workflow className="w-3.5 h-3.5" />
              <span>Step-by-Step Flow</span>
            </button>
          </div>

          {/* Add Milestone Button */}
          <button
            onClick={() => setIsAddMilestoneModalOpen(true)}
            className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm shadow-blue-500/20 transition flex items-center space-x-1.5 active:scale-95 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Checkpoint</span>
          </button>
        </div>
      </div>

      {/* METRIC STATUS INDICATOR CARDS (Queried directly from Firestore status field) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        
        {/* Completed */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'completed' ? 'all' : 'completed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            filterStatus === 'completed'
              ? 'bg-emerald-50 border-emerald-400 shadow-sm ring-2 ring-emerald-500/20'
              : 'bg-white border-slate-200/90 hover:border-emerald-200 hover:bg-emerald-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-emerald-700 flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              <span>Completed</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <span className="text-2xl font-bold font-mono text-emerald-700">{completedCount}</span>
            <span className="text-xs text-emerald-600 font-semibold">
              ({milestones.length > 0 ? Math.round((completedCount / milestones.length) * 100) : 0}%)
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Signed-off deliverables</p>
        </div>

        {/* In Progress */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'in_progress' ? 'all' : 'in_progress')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            filterStatus === 'in_progress'
              ? 'bg-blue-50 border-blue-400 shadow-sm ring-2 ring-blue-500/20'
              : 'bg-white border-slate-200/90 hover:border-blue-200 hover:bg-blue-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-blue-700 flex items-center space-x-1">
              <CircleDot className="w-3 h-3 text-blue-600" />
              <span>In Progress</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <span className="text-2xl font-bold font-mono text-blue-700">{inProgressCount}</span>
            <span className="text-xs text-blue-600 font-semibold">Active</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Sprint tasks underway</p>
        </div>

        {/* Delayed */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'delayed' ? 'all' : 'delayed')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            filterStatus === 'delayed'
              ? 'bg-rose-50 border-rose-400 shadow-sm ring-2 ring-rose-500/20'
              : 'bg-white border-slate-200/90 hover:border-rose-200 hover:bg-rose-50/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-rose-700 flex items-center space-x-1">
              <AlertTriangle className="w-3 h-3 text-rose-600" />
              <span>Delayed</span>
            </span>
            {delayedCount > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />}
          </div>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <span className={`text-2xl font-bold font-mono ${delayedCount > 0 ? 'text-rose-700' : 'text-slate-800'}`}>
              {delayedCount}
            </span>
            <span className="text-xs text-rose-600 font-semibold">
              {delayedCount > 0 ? 'Requires attention' : 'On schedule'}
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Variance mitigation</p>
        </div>

        {/* Upcoming */}
        <div 
          onClick={() => setFilterStatus(filterStatus === 'upcoming' ? 'all' : 'upcoming')}
          className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
            filterStatus === 'upcoming'
              ? 'bg-slate-100 border-slate-400 shadow-sm ring-2 ring-slate-500/20'
              : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase font-bold text-slate-500 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-slate-400" />
              <span>Upcoming</span>
            </span>
            <span className="w-2 h-2 rounded-full bg-slate-400" />
          </div>
          <div className="flex items-baseline space-x-2 mt-1.5">
            <span className="text-2xl font-bold font-mono text-slate-700">{upcomingCount}</span>
            <span className="text-xs text-slate-500 font-semibold">Scheduled</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1">Future phase roadmap</p>
        </div>

      </div>

      {/* Filter Status Pills with Visual Indicators */}
      <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">Filter Status:</span>
          
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap ${
              filterStatus === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Milestones ({milestones.length})
          </button>

          <button
            onClick={() => setFilterStatus('in_progress')}
            className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap flex items-center space-x-1.5 ${
              filterStatus === 'in_progress'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-white text-blue-700 border border-blue-200 hover:bg-blue-50'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <span>In Progress ({inProgressCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap flex items-center space-x-1.5 ${
              filterStatus === 'completed'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Completed ({completedCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('delayed')}
            className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap flex items-center space-x-1.5 ${
              filterStatus === 'delayed'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-white text-rose-700 border border-rose-200 hover:bg-rose-50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
            <span>Delayed ({delayedCount})</span>
          </button>

          <button
            onClick={() => setFilterStatus('upcoming')}
            className={`px-3 py-1.5 rounded-full font-semibold transition whitespace-nowrap flex items-center space-x-1.5 ${
              filterStatus === 'upcoming'
                ? 'bg-slate-700 text-white shadow-2xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Upcoming ({upcomingCount})</span>
          </button>
        </div>

        <div className="text-[11px] text-slate-400 flex items-center space-x-2">
          <span>Showing <strong>{filteredMilestones.length}</strong> of <strong>{milestones.length}</strong> milestones</span>
        </div>
      </div>

      {/* MAIN VIEW: GANTT CHART OR STEPPER */}
      {viewMode === 'gantt' ? (
        /* GANTT CHART VIEW WITH DETAILED VISUAL STATUS INDICATORS */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          
          {/* Gantt Header with Visual Status Legend */}
          <div className="p-5 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <h4 className="text-sm font-bold font-serif text-white">
                  Sprint Roadmap & Time Allocation Gantt
                </h4>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Timeline from kickoff ({project.startDate || 'Jun 15'}) to target delivery ({project.targetCompletionDate || 'Sep 30'})
              </p>
            </div>

            {/* Visual Status Legend */}
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-300 font-medium">
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-emerald-300 font-semibold">Completed</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
                <span className="text-blue-300 font-semibold">In Progress</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="text-rose-300 font-semibold">Delayed</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                <span className="text-slate-300 font-semibold">Upcoming</span>
              </div>
            </div>
          </div>

          {/* Gantt Interactive Canvas */}
          <div className="p-4 sm:p-6 overflow-x-auto">
            <div className="min-w-[760px] space-y-4">
              
              {/* Time Axis Header */}
              <div className="relative h-8 border-b border-slate-200 text-[10px] font-mono text-slate-400 select-none">
                <div className="w-full flex justify-between absolute inset-0">
                  {timeMarks.map((mark, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center"
                      style={{ position: 'absolute', left: `${mark.percent}%`, transform: 'translateX(-50%)' }}
                    >
                      <span>{mark.label}</span>
                      <div className="h-2 w-px bg-slate-300 mt-1" />
                    </div>
                  ))}
                </div>

                {/* Today Marker on Axis */}
                {todayPercent > 0 && todayPercent < 100 && (
                  <div
                    className="absolute top-0 flex flex-col items-center z-20"
                    style={{ left: `${todayPercent}%`, transform: 'translateX(-50%)' }}
                  >
                    <span className="px-1.5 py-0.5 bg-rose-600 text-white rounded-md text-[9px] font-bold shadow-xs">
                      Today
                    </span>
                    <div className="w-px h-3 bg-rose-600" />
                  </div>
                )}
              </div>

              {/* Milestone Rows */}
              <div className="space-y-4 relative pt-2">
                
                {/* Vertical "Today" Line going down the chart */}
                {todayPercent > 0 && todayPercent < 100 && (
                  <div 
                    className="absolute top-0 bottom-0 w-px bg-rose-500/40 border-l border-dashed border-rose-500 pointer-events-none z-10"
                    style={{ left: `${todayPercent}%` }}
                  />
                )}

                {filteredMilestones.map((milestone, idx) => {
                  const geom = getMilestoneBarGeometry(milestone, idx);
                  const statusCfg = getMilestoneStatusConfig(milestone.status || 'upcoming', milestone.dueDate);
                  const isSelected = selectedMilestoneId === milestone.id;
                  const progressValue = milestone.progress ?? (
                    statusCfg.key === 'completed' ? 100 : 
                    statusCfg.key === 'in_progress' ? 60 : 
                    statusCfg.key === 'delayed' ? 35 : 0
                  );
                  const StatusIcon = statusCfg.icon;

                  return (
                    <div
                      key={milestone.id}
                      onClick={() => setSelectedMilestoneId(milestone.id)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50/60 border-blue-400 shadow-sm ring-2 ring-blue-500/20'
                          : `${statusCfg.cardBorder}`
                      }`}
                    >
                      {/* Top row: title & date & visual status badge */}
                      <div className="flex items-center justify-between gap-2 mb-2.5 text-xs">
                        <div className="flex items-center space-x-2.5 min-w-0">
                          {/* Visual Status Indicator Icon */}
                          <div className="shrink-0">
                            <StatusIcon className={`w-4 h-4 ${statusCfg.iconColor}`} />
                          </div>

                          <span className="font-bold text-slate-900 truncate">
                            {milestone.title}
                          </span>

                          {milestone.phase && (
                            <span className="px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-600 text-[10px] font-mono shrink-0 hidden sm:inline-block">
                              {milestone.phase}
                            </span>
                          )}
                        </div>

                        {/* Status pill & date indicators */}
                        <div className="flex items-center space-x-2 shrink-0">
                          {/* Visual Status Tag */}
                          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${statusCfg.badgeBg}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dotColor}`} />
                            <span>{statusCfg.label}</span>
                          </span>

                          <span className="text-slate-400 font-mono text-[11px] hidden md:inline-block">
                            {milestone.startDate ? `${milestone.startDate} → ` : ''}{milestone.dueDate}
                          </span>

                          <span className={`px-2 py-0.5 rounded-full font-bold uppercase font-mono text-[10px] ${
                            statusCfg.key === 'completed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : statusCfg.key === 'in_progress' 
                              ? 'bg-blue-100 text-blue-800' 
                              : statusCfg.key === 'delayed'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-slate-200 text-slate-700'
                          }`}>
                            {progressValue}%
                          </span>
                        </div>
                      </div>

                      {/* Delay Warning Note if applicable */}
                      {statusCfg.key === 'delayed' && milestone.delayReason && (
                        <div className="mb-2 px-3 py-1.5 bg-rose-50/80 border border-rose-200 rounded-xl text-[11px] text-rose-700 flex items-center space-x-2">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                          <span className="truncate"><strong>Delay Note:</strong> {milestone.delayReason}</span>
                        </div>
                      )}

                      {/* Gantt Bar Lane */}
                      <div className="relative h-7 bg-white/80 rounded-xl border border-slate-200/90 overflow-hidden">
                        {/* Background subtle grid lines */}
                        <div className="absolute inset-0 grid grid-cols-4 divide-x divide-slate-100 pointer-events-none" />

                        {/* Positioned Bar with Visual Status Styling */}
                        <div
                          className={`absolute top-1 bottom-1 rounded-lg transition-all duration-300 flex items-center justify-between px-2.5 ${statusCfg.ganttBar}`}
                          style={{
                            left: `${geom.left}%`,
                            width: `${geom.width}%`
                          }}
                        >
                          <span className="text-[10px] font-bold truncate max-w-[140px] flex items-center space-x-1">
                            <StatusIcon className="w-3 h-3 shrink-0 inline mr-1 opacity-85" />
                            <span>{milestone.title}</span>
                          </span>
                          <span className="text-[9px] font-mono opacity-95 shrink-0 font-bold">
                            {progressValue}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      ) : (
        /* STEP-BY-STEP FLOW VIEW (PIPELINE WITH VISUAL STATUS BADGES) */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-sm font-bold font-serif text-slate-900">
                Phase-by-Phase Execution Stepper
              </h4>
              <p className="text-xs text-slate-500">Sequential roadmap with visual status indicators queried from Firestore</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[11px] font-bold">
                {completedCount} Completed
              </span>
              {delayedCount > 0 && (
                <span className="px-2.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-[11px] font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>{delayedCount} Delayed</span>
                </span>
              )}
            </div>
          </div>

          <div className="space-y-6 relative before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-slate-200">
            {filteredMilestones.map((milestone, idx) => {
              const statusCfg = getMilestoneStatusConfig(milestone.status || 'upcoming', milestone.dueDate);
              const isSelected = selectedMilestoneId === milestone.id;
              const StatusIcon = statusCfg.icon;

              return (
                <div
                  key={milestone.id}
                  onClick={() => setSelectedMilestoneId(milestone.id)}
                  className="relative pl-12 cursor-pointer group select-none"
                >
                  {/* Step Node Icon with Visual Status Indicator */}
                  <div className={`absolute left-0 top-0 w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-xs transition-all ${statusCfg.stepNode}`}>
                    {statusCfg.key === 'completed' ? (
                      <CheckCircle2 className="w-5 h-5" />
                    ) : statusCfg.key === 'delayed' ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <span>0{idx + 1}</span>
                    )}
                  </div>

                  {/* Step Content Card */}
                  <div className={`p-5 rounded-2xl border transition-all ${
                    isSelected
                      ? 'bg-blue-50/50 border-blue-400 shadow-sm ring-2 ring-blue-500/20'
                      : statusCfg.cardBorder
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div>
                        {milestone.phase && (
                          <span className="text-[10px] font-mono uppercase font-bold text-blue-600 block">
                            {milestone.phase}
                          </span>
                        )}
                        <h4 className="text-sm font-bold text-slate-900 font-serif">
                          {milestone.title}
                        </h4>
                      </div>

                      {/* Visual Status Indicator Pill */}
                      <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${statusCfg.badgeBg}`}>
                          <StatusIcon className={`w-3.5 h-3.5 ${statusCfg.iconColor}`} />
                          <span>{statusCfg.label}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {milestone.description || 'Sprint deliverable reviewed by managing partner and client committee.'}
                    </p>

                    {/* Delayed Alert Box */}
                    {statusCfg.key === 'delayed' && (
                      <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                        <div className="flex items-center space-x-1.5 font-bold">
                          <AlertTriangle className="w-4 h-4 text-rose-600" />
                          <span>Milestone Status: Delayed Schedule</span>
                        </div>
                        <p className="text-[11px] text-rose-700">
                          {milestone.delayReason || 'Mitigation sprint initiated to resolve dependencies and realign deliverables.'}
                        </p>
                      </div>
                    )}

                    {/* Outputs & Deliverable Tags */}
                    {milestone.keyOutputs && milestone.keyOutputs.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 mt-3 pt-3 border-t border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 mr-1">Outputs:</span>
                        {milestone.keyOutputs.map((out, oIdx) => (
                          <span key={oIdx} className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-[10px] font-medium">
                            {out}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 text-[11px] text-slate-400">
                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1 text-slate-600 font-medium">
                          <User className="w-3 h-3 text-blue-600" />
                          <span>{milestone.owner || project.leadConsultantName}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>Due: {milestone.dueDate}</span>
                        </span>
                      </div>

                      {/* Quick Status Action Switcher */}
                      <div className="flex items-center space-x-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusChange(
                              milestone.id, 
                              milestone.status === 'completed' ? 'in_progress' : 
                              milestone.status === 'in_progress' ? 'completed' : 
                              milestone.status === 'delayed' ? 'in_progress' : 'in_progress'
                            );
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition shadow-2xs ${
                            milestone.status === 'completed' 
                              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700' 
                              : milestone.status === 'delayed'
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {milestone.status === 'completed' ? 'Reopen Milestone' : milestone.status === 'delayed' ? 'Resume Sprint' : 'Mark Complete'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SELECTED MILESTONE INSPECTOR & LIVE FIRESTORE STATUS CONTROLS */}
      {activeMilestone && (
        <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 space-y-5 animate-fadeIn">
          
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-xl">
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono uppercase font-bold">
                  {activeMilestone.phase || 'Checkpoint Details'}
                </span>
                
                {/* Visual Status Tag in Inspector */}
                {(() => {
                  const currentStatusCfg = getMilestoneStatusConfig(activeMilestone.status || 'upcoming', activeMilestone.dueDate);
                  const IconComp = currentStatusCfg.icon;
                  return (
                    <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                      activeMilestone.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/30' :
                      activeMilestone.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300 border-blue-400/30' :
                      activeMilestone.status === 'delayed' ? 'bg-rose-500/20 text-rose-300 border-rose-400/30 animate-pulse' :
                      'bg-slate-700/60 text-slate-300 border-slate-600'
                    }`}>
                      <IconComp className="w-3 h-3" />
                      <span>Status: {currentStatusCfg.label}</span>
                    </span>
                  );
                })()}

                <span className="text-xs text-slate-400 font-mono">
                  ID: {activeMilestone.id}
                </span>
              </div>

              <h4 className="text-lg sm:text-xl font-bold font-serif text-white">
                {activeMilestone.title}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans pt-1">
                {activeMilestone.description}
              </p>
            </div>

            {/* Interactive Visual Status Switcher Buttons (Updates Firestore status field in real time) */}
            <div className="bg-white/10 p-2 rounded-2xl border border-white/15 shrink-0 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 block px-1">Update Status in Firestore:</span>
              <div className="flex flex-wrap gap-1.5">
                
                {/* In Progress */}
                <button
                  onClick={() => handleStatusChange(activeMilestone.id, 'in_progress')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1 ${
                    activeMilestone.status === 'in_progress'
                      ? 'bg-blue-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CircleDot className="w-3 h-3" />
                  <span>In Progress</span>
                </button>

                {/* Completed */}
                <button
                  onClick={() => handleStatusChange(activeMilestone.id, 'completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1 ${
                    activeMilestone.status === 'completed'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Completed</span>
                </button>

                {/* Approve (Finalized) */}
                {activeMilestone.status === 'completed' && (
                  <button
                    onClick={() => handleApprove(activeMilestone.id, activeMilestone.title)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1 ${
                      activeMilestone.status === 'finalized'
                        ? 'bg-indigo-600 text-white font-bold shadow-xs'
                        : 'text-indigo-300 hover:text-white hover:bg-white/10 border border-indigo-500/30'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Approve Milestone</span>
                  </button>
                )}

                {/* Delayed */}
                <button
                  onClick={() => handleStatusChange(activeMilestone.id, 'delayed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1 ${
                    activeMilestone.status === 'delayed'
                      ? 'bg-rose-600 text-white font-bold shadow-xs'
                      : 'text-rose-300 hover:text-white hover:bg-rose-900/40'
                  }`}
                >
                  <AlertTriangle className="w-3 h-3" />
                  <span>Delayed</span>
                </button>

                {/* Upcoming */}
                <button
                  onClick={() => handleStatusChange(activeMilestone.id, 'upcoming')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center space-x-1 ${
                    activeMilestone.status === 'upcoming'
                      ? 'bg-slate-700 text-white font-bold shadow-xs'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <Clock className="w-3 h-3" />
                  <span>Upcoming</span>
                </button>

              </div>
            </div>
          </div>

          {/* Delay Mitigation & Notes Editor (If status is Delayed) */}
          {activeMilestone.status === 'delayed' && (
            <div className="p-4 bg-rose-950/40 border border-rose-500/40 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-rose-300 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Schedule Variance & Delay Cause</span>
                </span>
                {!editingDelayReason && (
                  <button
                    onClick={() => {
                      setTempDelayReason(activeMilestone.delayReason || '');
                      setEditingDelayReason(true);
                    }}
                    className="px-2.5 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-[10px] font-semibold transition"
                  >
                    Edit Delay Note
                  </button>
                )}
              </div>

              {editingDelayReason ? (
                <div className="space-y-2 pt-1">
                  <textarea
                    rows={2}
                    value={tempDelayReason}
                    onChange={(e) => setTempDelayReason(e.target.value)}
                    placeholder="Describe variance reason and scheduled mitigation steps..."
                    className="w-full p-2.5 bg-slate-900/90 border border-rose-400/50 rounded-xl text-white text-xs focus:outline-none focus:ring-1 focus:ring-rose-400 resize-none"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={() => setEditingDelayReason(false)}
                      className="px-3 py-1 text-slate-300 hover:text-white text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveDelayReason}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition shadow-xs"
                    >
                      Save Delay Reason to Firestore
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-slate-300 text-xs leading-relaxed">
                  {activeMilestone.delayReason || 'Schedule variance flagged by engagement manager. Client review scheduled to confirm updated sprint deliverables.'}
                </p>
              )}
            </div>
          )}

          {/* Interactive Progress Slider */}
          <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300 font-semibold">Sprint Progress Slider</span>
              <span className="font-mono font-bold text-emerald-400">
                {activeMilestone.progress ?? (activeMilestone.status === 'completed' ? 100 : activeMilestone.status === 'in_progress' ? 65 : 0)}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={activeMilestone.progress ?? (activeMilestone.status === 'completed' ? 100 : activeMilestone.status === 'in_progress' ? 65 : 0)}
              onChange={(e) => handleProgressChange(activeMilestone.id, parseInt(e.target.value, 10))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% (Not Started)</span>
              <span>50% (Mid-Sprint Review)</span>
              <span>100% (Signed-off)</span>
            </div>
          </div>

          {/* Time Tracking Section */}
          <div className="p-4 bg-blue-950/40 border border-blue-500/30 rounded-2xl space-y-3">
            <div className="flex justify-between items-center">
              <span className="font-bold text-blue-200 flex items-center space-x-1.5">
                <Clock3 className="w-4 h-4 text-blue-400" />
                <span>Time Tracking</span>
              </span>
              <button 
                onClick={() => setIsTimeTrackerModalOpen(true)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3 h-3" /> Log Hours
              </button>
            </div>
            <div className="flex gap-4 text-xs">
              <div className="text-slate-300">Milestone: <span className="font-bold text-white">{totalMilestoneHours} hrs</span></div>
              <div className="text-slate-300">Project Total: <span className="font-bold text-white">{totalProjectHours} hrs</span></div>
            </div>
          </div>

          {/* Details Metadata & Key Outputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-slate-400 text-[10px] uppercase block">Assigned Lead Strategist</span>
              <span className="font-bold text-white mt-0.5 block">{activeMilestone.owner || project.leadConsultantName}</span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-slate-400 text-[10px] uppercase block">Schedule Window</span>
              <span className="font-bold text-white mt-0.5 block font-mono">
                {activeMilestone.startDate || project.startDate} → {activeMilestone.dueDate}
              </span>
            </div>
            <div className="p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-slate-400 text-[10px] uppercase block">Deliverable Status</span>
              <span className="font-bold text-emerald-400 mt-0.5 block">
                {activeMilestone.deliverableName || 'Verified Sprint Report'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ADD MILESTONE MODAL WITH STATUS SELECTOR */}
      {isAddMilestoneModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-auto">
            
            {/* Modal Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 text-blue-400 flex items-center justify-center border border-blue-400/30">
                  <Flag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold font-serif">Add Strategic Checkpoint</h3>
                  <p className="text-xs text-slate-400">Save milestone directly to project in Firestore</p>
                </div>
              </div>

              <button
                onClick={() => setIsAddMilestoneModalOpen(false)}
                disabled={savingMilestone}
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Modal Form */}
            <form onSubmit={handleAddMilestone} className="p-6 space-y-4 text-xs">
              {formError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Milestone Checkpoint Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Multi-Entity Tax Consolidation Review"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">Initial Milestone Status</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'upcoming', label: 'Upcoming', icon: Clock, color: 'text-slate-600', activeBg: 'bg-slate-900 text-white' },
                    { id: 'in_progress', label: 'In Progress', icon: CircleDot, color: 'text-blue-600', activeBg: 'bg-blue-600 text-white' },
                    { id: 'delayed', label: 'Delayed', icon: AlertTriangle, color: 'text-rose-600', activeBg: 'bg-rose-600 text-white' },
                    { id: 'completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-600', activeBg: 'bg-emerald-600 text-white' }
                  ].map((st) => {
                    const StIcon = st.icon;
                    const isSelected = newStatus === st.id;
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => setNewStatus(st.id as MilestoneStatus)}
                        className={`p-2.5 rounded-xl border text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
                          isSelected 
                            ? `${st.activeBg} border-transparent shadow-xs` 
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <StIcon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : st.color}`} />
                        <span>{st.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Phase Classification</label>
                  <input
                    type="text"
                    value={newPhase}
                    onChange={(e) => setNewPhase(e.target.value)}
                    placeholder="e.g. Phase 3: Deployment"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Lead Partner / Owner</label>
                  <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    placeholder="e.g. Sarah Jenkins, FCA"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newStartDate}
                    onChange={(e) => setNewStartDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Due Date</label>
                  <input
                    type="date"
                    value={newDueDate}
                    onChange={(e) => setNewDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Key Outputs (comma-separated)
                </label>
                <input
                  type="text"
                  value={newOutputs}
                  onChange={(e) => setNewOutputs(e.target.value)}
                  placeholder="e.g. Executive Summary Deck, Variance Matrix, Sign-off Protocol"
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Scope Description & Deliverable Objectives
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Provide scope notes for the advisory team..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddMilestoneModalOpen(false)}
                  disabled={savingMilestone}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingMilestone}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-2 disabled:opacity-50"
                >
                  {savingMilestone ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving to Firestore...</span>
                    </>
                  ) : (
                    <>
                      <Flag className="w-3.5 h-3.5" />
                      <span>Create Checkpoint</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTimeTrackerModalOpen && activeMilestone && (
        <TimeTrackingModal
          isOpen={isTimeTrackerModalOpen}
          onClose={() => setIsTimeTrackerModalOpen(false)}
          projectId={project.id}
          milestoneId={activeMilestone.id}
          userId={auth.currentUser?.uid || ''}
          consultantName={project.leadConsultantName}
        />
      )}

    </div>
  );
};
