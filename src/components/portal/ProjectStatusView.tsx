import React, { useState } from 'react';
import { ClientProject, ProjectMilestone, ClientDocument } from '../../types';
import { updateMilestoneStatus } from '../../lib/portalService';
import { ProjectTimelineView } from './ProjectTimelineView';
import { PendingDocumentReview } from './PendingDocumentReview';
import { RecentActivityTimeline } from './RecentActivityTimeline';
import { 
  CheckCircle2, 
  Clock, 
  CircleDot, 
  Calendar, 
  DollarSign, 
  FileText, 
  TrendingUp, 
  User, 
  Mail, 
  ArrowUpRight, 
  ShieldCheck, 
  Briefcase, 
  AlertCircle,
  FileSpreadsheet,
  Download,
  UploadCloud,
  Layers,
  Sparkles,
  Workflow,
  BarChart3,
  SlidersHorizontal,
  Eye
} from 'lucide-react';

interface ProjectStatusViewProps {
  projects: ClientProject[];
  documents: ClientDocument[];
  onOpenDocumentPreview: (doc: ClientDocument) => void;
  onOpenConsultation?: () => void;
  onOpenMessagesTab: () => void;
  onOpenUploadModal?: (projectId?: string, projectTitle?: string) => void;
}

export const ProjectStatusView: React.FC<ProjectStatusViewProps> = ({
  projects,
  documents,
  onOpenDocumentPreview,
  onOpenConsultation,
  onOpenMessagesTab,
  onOpenUploadModal
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    projects[0]?.id || ''
  );
  const [activeSubTab, setActiveSubTab] = useState<'timeline' | 'deliverables'>('timeline');

  const activeProject = projects.find(p => p.id === selectedProjectId) || projects[0];

  if (!activeProject) {
    return (
      <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-xs">
        <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
        <h4 className="text-base font-bold text-slate-800 font-serif">No Active Advisory Engagements</h4>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
          Your strategic advisory projects will appear here as soon as our engagement partner initializes your workspace.
        </p>
      </div>
    );
  }

  const handleToggleMilestone = async (milestone: ProjectMilestone) => {
    const nextStatus = milestone.status === 'completed' 
      ? 'in_progress' 
      : milestone.status === 'in_progress' 
      ? 'completed' 
      : 'in_progress';

    try {
      await updateMilestoneStatus(
        activeProject.id,
        milestone.id,
        nextStatus,
        activeProject.milestones || []
      );
    } catch (err) {
      console.error('Failed to update milestone:', err);
    }
  };

  const statusBadges: Record<string, { label: string; bg: string; text: string; dot: string }> = {
    in_progress: { label: 'In Active Sprint', bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', dot: 'bg-blue-600' },
    discovery: { label: 'Discovery Phase', bg: 'bg-indigo-50 border-indigo-200', text: 'text-indigo-700', dot: 'bg-indigo-600' },
    review: { label: 'Executive Review', bg: 'bg-amber-50 border-amber-200', text: 'text-amber-700', dot: 'bg-amber-600' },
    completed: { label: 'Milestones Completed', bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', dot: 'bg-emerald-600' },
    on_hold: { label: 'On Strategic Hold', bg: 'bg-slate-50 border-slate-200', text: 'text-slate-700', dot: 'bg-slate-500' }
  };

  const badge = statusBadges[activeProject.status] || statusBadges.in_progress;
  const completedMilestones = activeProject.milestones?.filter(m => m.status === 'completed').length || 0;
  const totalMilestones = activeProject.milestones?.length || 1;

  return (
    <div className="space-y-6">
      
      {/* New Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PendingDocumentReview documents={documents} />
        <RecentActivityTimeline projects={projects} />
      </div>

      {/* Project Selector (if multiple projects exist) */}
      {projects.length > 1 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          {projects.map((proj) => (
            <button
              key={proj.id}
              onClick={() => setSelectedProjectId(proj.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                selectedProjectId === proj.id
                  ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {proj.title}
            </button>
          ))}
        </div>
      )}

      {/* Hero Engagement Overview Card */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
        
        {/* Card Header Banner */}
        <div className="p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-white/10 text-white border border-white/20 text-[11px] font-bold uppercase tracking-wider">
                  {activeProject.serviceType}
                </span>
                <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase border bg-white/10 text-emerald-300 border-emerald-500/30`}>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{badge.label}</span>
                </span>
                <span className="px-2.5 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-[10px] font-mono">
                  Project ID: {activeProject.id}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold font-serif tracking-tight text-white">
                {activeProject.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                {activeProject.description}
              </p>
            </div>

            {/* Quick Metrics Badge */}
            <div className="bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl shrink-0 min-w-[220px] space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-300 font-medium">Overall Progress</span>
                  <span className="text-white font-bold font-mono">{activeProject.progressPercentage}%</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-500" 
                    style={{ width: `${activeProject.progressPercentage}%` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-white/10">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Kickoff Date</span>
                  <span className="font-semibold text-white">{activeProject.startDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase">Target Delivery</span>
                  <span className="font-semibold text-emerald-300">{activeProject.targetCompletionDate}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Engagement Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-slate-100 border-b border-slate-100 bg-slate-50/70 text-xs">
          <div className="p-4 sm:p-5">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Completed Milestones</span>
            <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">
              {completedMilestones} / {totalMilestones}
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Allocated Advisory Budget</span>
            <span className="text-lg font-bold text-slate-900 font-mono mt-0.5 block">
              ${activeProject.budgetTotal?.toLocaleString()} <span className="text-xs text-slate-500 font-normal">USD</span>
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Burned / Realized to Date</span>
            <span className="text-lg font-bold text-blue-700 font-mono mt-0.5 block">
              ${activeProject.budgetSpent?.toLocaleString()} <span className="text-xs text-slate-500 font-normal">USD</span>
            </span>
          </div>
          <div className="p-4 sm:p-5">
            <span className="text-slate-400 uppercase font-bold text-[10px] block">Deliverables Published</span>
            <span className="text-lg font-bold text-emerald-600 font-mono mt-0.5 block">
              {activeProject.deliverables?.length || 0} Files
            </span>
          </div>
        </div>

        {/* Sub-view switcher tabs */}
        <div className="px-6 pt-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setActiveSubTab('timeline')}
              className={`pb-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
                activeSubTab === 'timeline'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <Workflow className="w-4 h-4" />
              <span>Gantt Roadmap & Timeline</span>
            </button>
            <button
              onClick={() => setActiveSubTab('deliverables')}
              className={`pb-3 text-xs font-bold transition flex items-center space-x-2 border-b-2 ${
                activeSubTab === 'deliverables'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-slate-500 hover:text-slate-900'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Lead Partner & Deliverables</span>
            </button>
          </div>
        </div>

        {/* Dynamic Sub-Tab Content */}
        {activeSubTab === 'timeline' ? (
          <div className="p-6 sm:p-8">
            <ProjectTimelineView
              project={activeProject}
              onOpenDocumentPreview={onOpenDocumentPreview}
              onOpenUploadModal={onOpenUploadModal}
            />
          </div>
        ) : (
          <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Milestones Quick Summary */}
            <div className="lg:col-span-7 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-serif">Milestone Deliverable Summary</h3>
                  <p className="text-xs text-slate-500">Fast review of all project checkpoints</p>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">
                  {completedMilestones} of {totalMilestones} Completed
                </span>
              </div>

              <div className="space-y-3">
                {activeProject.milestones?.map((milestone, idx) => {
                  const isDone = milestone.status === 'completed';
                  const isCurrent = milestone.status === 'in_progress';
                  const isDelayed = milestone.status === 'delayed';

                  return (
                    <div
                      key={milestone.id || idx}
                      onClick={() => handleToggleMilestone(milestone)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                        isDone 
                          ? 'bg-emerald-50/40 border-emerald-200/70 hover:bg-emerald-50/80' 
                          : isDelayed
                          ? 'bg-rose-50/40 border-rose-300 ring-2 ring-rose-500/10 hover:bg-rose-50/80'
                          : isCurrent
                          ? 'bg-blue-50/40 border-blue-300 ring-2 ring-blue-500/10 hover:bg-blue-50/80'
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start space-x-3.5">
                        <div className="shrink-0 mt-0.5">
                          {isDone ? (
                            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          ) : isDelayed ? (
                            <AlertCircle className="w-5 h-5 text-rose-600" />
                          ) : isCurrent ? (
                            <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                              <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                            </div>
                          ) : (
                            <CircleDot className="w-5 h-5 text-slate-300" />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className={`text-xs sm:text-sm font-bold ${
                              isDone ? 'text-slate-800 line-through opacity-70' : 'text-slate-900'
                            }`}>
                              {milestone.title}
                            </h4>
                            <span className={`text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full shrink-0 border ${
                              isDone 
                                ? 'bg-emerald-100 border-emerald-200 text-emerald-800' 
                                : isDelayed
                                ? 'bg-rose-100 border-rose-200 text-rose-800'
                                : isCurrent 
                                ? 'bg-blue-100 border-blue-200 text-blue-800 animate-pulse' 
                                : 'bg-slate-100 border-slate-200 text-slate-600'
                            }`}>
                              {milestone.status === 'completed' ? 'Completed' : milestone.status === 'delayed' ? 'Delayed' : milestone.status === 'in_progress' ? 'In Progress' : 'Upcoming'}
                            </span>
                          </div>

                          {milestone.description && (
                            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                              {milestone.description}
                            </p>
                          )}

                          {isDelayed && milestone.delayReason && (
                            <p className="text-[11px] text-rose-600 font-medium mt-1">
                              Variance note: {milestone.delayReason}
                            </p>
                          )}

                          <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-2">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span>Due: {milestone.dueDate}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Lead Consultant & Deliverables */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Lead Consultant Card */}
              <div className="p-6 bg-gradient-to-br from-slate-50 to-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                <div className="flex items-center space-x-3.5">
                  <img
                    src={activeProject.leadConsultantAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=256&q=80'}
                    alt={activeProject.leadConsultantName}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-md shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-blue-600 tracking-wider">
                      Assigned Engagement Lead
                    </span>
                    <h4 className="text-base font-bold text-slate-900 font-serif">
                      {activeProject.leadConsultantName}
                    </h4>
                    <p className="text-xs text-slate-600">
                      {activeProject.leadConsultantRole}
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200/80 flex items-center gap-2">
                  <button
                    onClick={onOpenMessagesTab}
                    className="flex-1 py-2 px-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 flex items-center justify-center space-x-1.5 transition shadow-2xs"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-600" />
                    <span>Direct Message</span>
                  </button>
                  {onOpenConsultation && (
                    <button
                      onClick={onOpenConsultation}
                      className="flex-1 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center space-x-1.5 transition shadow-xs"
                    >
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>Book Call</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Deliverables & Upload Direct Action */}
              <div className="p-5 bg-white rounded-2xl border border-slate-200 space-y-3.5 shadow-2xs">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Project Deliverables & Repository
                    </h4>
                    <span className="text-[11px] text-slate-400">
                      Linked to ID: <strong className="font-mono text-slate-600">{activeProject.id}</strong>
                    </span>
                  </div>

                  {onOpenUploadModal && (
                    <button
                      onClick={() => onOpenUploadModal(activeProject.id, activeProject.title)}
                      className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 text-xs font-bold transition flex items-center space-x-1.5 shadow-2xs active:scale-95"
                      title="Upload directly to Firebase Storage for this project"
                    >
                      <UploadCloud className="w-3.5 h-3.5 text-blue-600" />
                      <span>Upload File</span>
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {activeProject.deliverables?.map((del, dIdx) => (
                    <div
                      key={del.id || dIdx}
                      className="p-3 bg-slate-50 hover:bg-blue-50/40 rounded-xl border border-slate-200/70 flex items-center justify-between transition group"
                    >
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                          {del.name.endsWith('.xlsx') ? (
                            <FileSpreadsheet className="w-4 h-4" />
                          ) : (
                            <FileText className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-800 truncate" title={del.name}>
                            {del.name}
                          </p>
                          <p className="text-[10px] text-slate-400">{del.size} • {del.date}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onOpenDocumentPreview({
                          id: del.id,
                          userId: activeProject.userId,
                          projectId: activeProject.id,
                          projectTitle: activeProject.title,
                          title: del.name,
                          category: 'Deliverable',
                          fileName: del.name,
                          fileSize: del.size,
                          fileType: del.fileType,
                          downloadUrl: del.downloadUrl,
                          version: 'Verified Deliverable',
                          confidential: true,
                          sharedBy: activeProject.leadConsultantName,
                          uploadedAt: del.date,
                          description: `Official verified deliverable published under project: ${activeProject.title}`
                        })}
                        className="w-7 h-7 rounded-lg bg-white border border-slate-200 group-hover:border-blue-300 text-slate-500 group-hover:text-blue-600 flex items-center justify-center transition shrink-0"
                        title="View Deliverable"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Sprint Updates Log */}
              {activeProject.recentUpdates && activeProject.recentUpdates.length > 0 && (
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3 text-xs">
                  <h4 className="font-bold uppercase tracking-wider text-slate-500 text-[10px]">
                    Sprint Advisory Log
                  </h4>
                  <div className="space-y-2.5">
                    {activeProject.recentUpdates.map((up) => (
                      <div key={up.id} className="p-3 bg-white rounded-xl border border-slate-200/80 space-y-1">
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="font-bold text-slate-700">{up.author} ({up.role})</span>
                          <span className="text-slate-400">{up.date}</span>
                        </div>
                        <p className="text-slate-600 leading-relaxed text-[11px]">{up.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </div>

    </div>
  );
};
