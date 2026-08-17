import React, { useState, useEffect, useRef } from 'react';
import { ProjectMilestone, MilestoneComment, CommentTag, ClientProfile } from '../../types';
import { 
  subscribeToProjectMilestoneComments, 
  addMilestoneComment, 
  deleteMilestoneComment 
} from '../../lib/portalService';
import { 
  MessageSquare, 
  Send, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldCheck, 
  Sparkles, 
  Tag, 
  Layers, 
  CornerDownRight, 
  AlertCircle, 
  HelpCircle, 
  FileCheck, 
  Zap, 
  Filter, 
  Search, 
  X,
  ChevronDown,
  ArrowRight,
  Briefcase,
  Smile,
  RefreshCw
} from 'lucide-react';

interface MilestoneCommentsThreadProps {
  projectId: string;
  projectTitle?: string;
  milestones: ProjectMilestone[];
  selectedMilestoneId?: string | null;
  onSelectMilestone?: (milestoneId: string) => void;
  userId: string;
  userProfile?: ClientProfile | null;
  leadConsultantName?: string;
  leadConsultantRole?: string;
  isCompact?: boolean;
  onClose?: () => void;
}

export const MilestoneCommentsThread: React.FC<MilestoneCommentsThreadProps> = ({
  projectId,
  projectTitle,
  milestones,
  selectedMilestoneId,
  onSelectMilestone,
  userId,
  userProfile,
  leadConsultantName = 'Sarah Jenkins, FCA',
  leadConsultantRole = 'Lead Strategic Partner',
  isCompact = false,
  onClose
}) => {
  const [comments, setComments] = useState<MilestoneComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [commentText, setCommentText] = useState('');
  const [selectedTag, setSelectedTag] = useState<CommentTag>('Status Update');
  const [targetMilestoneId, setTargetMilestoneId] = useState<string>(
    selectedMilestoneId || milestones[0]?.id || ''
  );
  
  // Perspective Switcher: allows testing realistic dual client/consultant interaction
  const [authorType, setAuthorType] = useState<'client' | 'consultant'>('client');
  
  // Filtering & Search
  const [filterMilestone, setFilterMilestone] = useState<string>(
    selectedMilestoneId || 'all'
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilterTag, setSelectedFilterTag] = useState<string>('all');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync targetMilestoneId with prop changes
  useEffect(() => {
    if (selectedMilestoneId) {
      setTargetMilestoneId(selectedMilestoneId);
      setFilterMilestone(selectedMilestoneId);
    }
  }, [selectedMilestoneId]);

  // Real-time Firestore Subscription
  useEffect(() => {
    if (!userId || !projectId) return;

    setLoading(true);
    const unsubscribe = subscribeToProjectMilestoneComments(userId, projectId, (fetchedComments) => {
      setComments(fetchedComments);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId, projectId]);

  // Auto scroll on new comments
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments.length, filterMilestone]);

  const activeMilestoneObj = milestones.find(m => m.id === targetMilestoneId) || milestones[0];

  const handlePostComment = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!commentText.trim()) return;

    const targetMilestone = milestones.find(m => m.id === targetMilestoneId);
    const milestoneTitle = targetMilestone?.title || 'General Milestone Update';

    const clientName = userProfile?.displayName || userProfile?.companyName || 'Executive Client';
    const clientRole = userProfile?.role || 'Chief Executive Officer';

    const authorName = authorType === 'client' ? clientName : leadConsultantName;
    const authorRole = authorType === 'client' ? clientRole : leadConsultantRole;

    try {
      setSubmitting(true);
      setError(null);

      await addMilestoneComment({
        projectId,
        milestoneId: targetMilestoneId,
        milestoneTitle,
        userId,
        authorName,
        authorRole,
        authorType,
        tag: selectedTag,
        content: commentText.trim()
      });

      setCommentText('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (err: any) {
      console.error('Failed to post milestone comment:', err);
      setError('Could not post comment. Please check your network or Firestore connection.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteMilestoneComment(commentId);
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleQuickInsert = (text: string, tag: CommentTag) => {
    setCommentText(text);
    setSelectedTag(tag);
    textareaRef.current?.focus();
  };

  // Filtered comments list
  const filteredComments = comments.filter(c => {
    const matchesMilestone = filterMilestone === 'all' || c.milestoneId === filterMilestone;
    const matchesTag = selectedFilterTag === 'all' || c.tag === selectedFilterTag;
    const matchesSearch = 
      !searchQuery ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.milestoneTitle && c.milestoneTitle.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesMilestone && matchesTag && matchesSearch;
  });

  // Relative / formatted time helper
  const formatCommentTime = (createdAt: any) => {
    if (!createdAt) return 'Just now';
    let date: Date;
    if (createdAt.toDate) {
      date = createdAt.toDate();
    } else if (createdAt instanceof Date) {
      date = createdAt;
    } else {
      date = new Date(createdAt);
    }

    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffSec = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffSec < 60) return 'Just now';
    if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
    if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
    if (diffSec < 172800) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const tagColorConfig: Record<string, { bg: string; text: string; border: string; icon: any }> = {
    'Status Update': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: Zap },
    'Clarification': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: HelpCircle },
    'Approval': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2 },
    'Deliverable Review': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', icon: FileCheck },
    'Feedback': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: MessageSquare },
    'General': { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200', icon: Tag }
  };

  return (
    <div className={`bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col ${
      isCompact ? 'h-full' : 'space-y-0'
    }`}>
      
      {/* Header Bar */}
      <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
        <div className="flex items-center space-x-3.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-blue-600/30 border border-blue-400/30 text-blue-400 flex items-center justify-center shrink-0">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center space-x-2 flex-wrap gap-1">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono font-bold uppercase">
                Milestone Discussions
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Live Firestore Synced</span>
              </span>
            </div>
            <h3 className="text-sm sm:text-base font-bold font-serif text-white truncate mt-1">
              Real-Time Milestone Comments & Review Thread
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {onClose && (
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter & Sub-Nav Bar */}
      <div className="p-4 bg-slate-50/90 border-b border-slate-200 space-y-3 shrink-0 text-xs">
        
        {/* Milestone Switcher Pills & Tag Filters */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          
          {/* Milestone Target Dropdown */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <Layers className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={filterMilestone}
              onChange={(e) => {
                setFilterMilestone(e.target.value);
                if (e.target.value !== 'all' && onSelectMilestone) {
                  onSelectMilestone(e.target.value);
                }
              }}
              className="w-full bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Milestone Discussions ({comments.length})</option>
              {milestones.map((m, idx) => {
                const count = comments.filter(c => c.milestoneId === m.id).length;
                return (
                  <option key={m.id} value={m.id}>
                    Checkpoint {idx + 1}: {m.title} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Search bar */}
          <div className="relative sm:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comments..."
              className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Tag Filters Row */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 mr-1 flex items-center space-x-1">
            <Filter className="w-3 h-3" />
            <span>Filter:</span>
          </span>
          {['all', 'Status Update', 'Approval', 'Deliverable Review', 'Clarification', 'Feedback'].map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedFilterTag(tag)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                selectedFilterTag === tag
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {tag === 'all' ? 'All Tags' : tag}
            </button>
          ))}
        </div>
      </div>

      {/* Real-time Comments Stream Body */}
      <div className={`p-4 sm:p-6 overflow-y-auto space-y-4 flex-1 ${
        isCompact ? 'max-h-[380px]' : 'max-h-[460px] min-h-[300px]'
      }`}>
        {loading ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto text-blue-600" />
            <p className="text-xs font-medium">Connecting to Firestore discussion feed...</p>
          </div>
        ) : filteredComments.length === 0 ? (
          <div className="py-12 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200 p-6 space-y-2">
            <MessageSquare className="w-8 h-8 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-700">No milestone comments found</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
              {filterMilestone !== 'all' 
                ? 'Be the first to post a status update, clarification, or approval note on this milestone.'
                : 'Start the conversation below by posting an update or review note.'}
            </p>
          </div>
        ) : (
          filteredComments.map((comment) => {
            const isConsultant = comment.authorType === 'consultant';
            const tagCfg = tagColorConfig[comment.tag || 'General'] || tagColorConfig['General'];
            const TagIcon = tagCfg.icon;
            const targetMilestone = milestones.find(m => m.id === comment.milestoneId);

            return (
              <div
                key={comment.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                  isConsultant
                    ? 'bg-slate-50/90 border-slate-200/90 hover:border-blue-300'
                    : 'bg-white border-slate-200/90 shadow-2xs hover:border-emerald-300'
                }`}
              >
                {/* Header info */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    
                    {/* Avatar */}
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                      isConsultant
                        ? 'bg-gradient-to-br from-slate-900 to-indigo-900 text-white'
                        : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white'
                    }`}>
                      {comment.authorName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center space-x-2 flex-wrap gap-1">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {comment.authorName}
                        </span>
                        
                        <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${
                          isConsultant
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {isConsultant ? 'Advisory Consultant' : 'Client Executive'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                        {comment.authorRole}
                      </p>
                    </div>
                  </div>

                  {/* Time and Delete Action */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-300" />
                      <span>{formatCommentTime(comment.createdAt)}</span>
                    </span>

                    <button
                      onClick={() => handleDelete(comment.id)}
                      className="p-1 rounded-lg text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Delete comment from thread"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                {/* Milestone Anchor Badge */}
                <div className="flex items-center justify-between gap-2 flex-wrap text-xs">
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => {
                        setFilterMilestone(comment.milestoneId);
                        if (onSelectMilestone) onSelectMilestone(comment.milestoneId);
                      }}
                      className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10px] font-mono font-semibold transition"
                      title="Click to focus on this milestone in timeline"
                    >
                      <Layers className="w-3 h-3 text-blue-600" />
                      <span className="truncate max-w-[220px]">
                        {targetMilestone?.title || comment.milestoneTitle || 'Milestone Checkpoint'}
                      </span>
                    </button>
                  </div>

                  {/* Tag badge */}
                  <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${tagCfg.bg} ${tagCfg.text} ${tagCfg.border}`}>
                    <TagIcon className="w-3 h-3" />
                    <span>{comment.tag || 'Status Update'}</span>
                  </span>
                </div>

                {/* Comment Content */}
                <p className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-wrap font-sans">
                  {comment.content}
                </p>

              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Canned Suggestions Strip */}
      <div className="px-4 sm:px-6 py-2.5 bg-slate-50/80 border-t border-slate-200 overflow-x-auto shrink-0 flex items-center space-x-2 text-xs">
        <span className="text-[10px] font-bold uppercase text-slate-400 shrink-0 mr-1 flex items-center space-x-1">
          <Sparkles className="w-3 h-3 text-blue-500" />
          <span>Quick Post:</span>
        </span>
        
        <button
          onClick={() => handleQuickInsert('✅ Diagnostic deliverables reviewed with our executive committee and formally approved.', 'Approval')}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium whitespace-nowrap transition"
        >
          ✅ Approve Deliverables
        </button>

        <button
          onClick={() => handleQuickInsert('📊 Preliminary 3-year model review complete; sensitivity parameters validated.', 'Deliverable Review')}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium whitespace-nowrap transition"
        >
          📊 Review Financial Model
        </button>

        <button
          onClick={() => handleQuickInsert('❓ Please confirm scheduled deployment window for the ERP multi-bank synchronization.', 'Clarification')}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium whitespace-nowrap transition"
        >
          ❓ Inquire Bank Sync
        </button>

        <button
          onClick={() => handleQuickInsert('🚀 Sprint execution is pacing ahead of schedule. Verified milestone check completed.', 'Status Update')}
          className="px-2.5 py-1 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-[11px] font-medium whitespace-nowrap transition"
        >
          🚀 Confirm Sprint Check
        </button>
      </div>

      {/* Post New Comment Composer Form */}
      <form onSubmit={handlePostComment} className="p-4 sm:p-5 bg-white border-t border-slate-200 space-y-3 shrink-0">
        
        {error && (
          <div className="p-2.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Persona Selector & Milestone Anchor Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          {/* Target Milestone Anchor */}
          <div className="flex items-center space-x-2 min-w-0 flex-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Anchor To:</span>
            <select
              value={targetMilestoneId}
              onChange={(e) => setTargetMilestoneId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {milestones.map((m, idx) => (
                <option key={m.id} value={m.id}>
                  Checkpoint {idx + 1}: {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Dual Persona Switcher (Client vs Consultant) */}
          <div className="flex items-center space-x-1.5 shrink-0 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400 px-1">Post as:</span>
            <button
              type="button"
              onClick={() => setAuthorType('client')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                authorType === 'client'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Client Executive
            </button>
            <button
              type="button"
              onClick={() => setAuthorType('consultant')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                authorType === 'consultant'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Consultant Lead
            </button>
          </div>
        </div>

        {/* Comment Tag Selector */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">Type:</span>
          {(['Status Update', 'Approval', 'Deliverable Review', 'Clarification', 'Feedback', 'General'] as CommentTag[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedTag(t)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition ${
                selectedTag === t
                  ? 'bg-blue-600 text-white shadow-xs font-bold'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Text Input Area & Action Button */}
        <div className="relative flex items-end gap-2">
          <textarea
            ref={textareaRef}
            rows={2}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handlePostComment();
              }
            }}
            placeholder={`Add a comment on ${activeMilestoneObj?.title || 'this milestone'} (Press Ctrl+Enter to post)...`}
            className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          />

          <button
            type="submit"
            disabled={submitting || !commentText.trim()}
            className={`px-4 py-3 rounded-2xl font-bold text-xs shadow-md transition flex items-center space-x-2 shrink-0 active:scale-95 disabled:opacity-50 ${
              authorType === 'consultant'
                ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-slate-900/20'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
            }`}
          >
            {submitting ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <span>Post</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Posting updates writes immediately to Firestore collection <code>/milestone_comments</code></span>
          <span className="font-mono">Real-Time Sync Active</span>
        </div>

      </form>

    </div>
  );
};
