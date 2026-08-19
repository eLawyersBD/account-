import React, { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { 
  ClientProject, 
  ClientInvoice, 
  ClientDocument, 
  PortalMessage, 
  ClientProfile 
} from '../../types';
import { 
  subscribeToClientProjects, 
  subscribeToClientInvoices, 
  subscribeToClientDocuments, 
  subscribeToPortalMessages,
  subscribeToCommentsForProjects,
  seedInitialClientDataIfEmpty
} from '../../lib/portalService';
import { ProjectStatusView } from './ProjectStatusView';
import { ProjectTimelineView } from './ProjectTimelineView';
import { PendingDocumentReview } from './PendingDocumentReview';
import { RecentActivityTimeline } from './RecentActivityTimeline';
import { PerformanceMetricsTab } from './PerformanceMetricsTab';
import { InvoicesView } from './InvoicesView';
import { DocumentsVaultView } from './DocumentsVaultView';
import { PortalMessagesView } from './PortalMessagesView';
import { DocumentPreviewModal } from './DocumentPreviewModal';
import { InvoicePaymentModal } from './InvoicePaymentModal';
import { UploadDocumentModal } from './UploadDocumentModal';
import { PortalAuthModal } from './PortalAuthModal';
import { 
  Briefcase, 
  Receipt, 
  FolderLock, 
  MessageSquare, 
  User, 
  LogOut, 
  ShieldCheck, 
  Lock, 
  Bell, 
  ChevronRight, 
  Building2, 
  Sparkles,
  ExternalLink,
  Plus,
  ArrowRight,
  X,
  Workflow,
  BarChart3
} from 'lucide-react';

interface ClientPortalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenConsultation?: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({
  isOpen,
  onClose,
  onOpenConsultation
}) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(auth.currentUser);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'projects' | 'timeline' | 'invoices' | 'documents' | 'messages' | 'profile' | 'metrics'>('projects');
  
  // Real-time Firestore State
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [invoices, setInvoices] = useState<ClientInvoice[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [userProfile, setUserProfile] = useState<ClientProfile | null>(null);

  // Sub-modal states
  const [previewDoc, setPreviewDoc] = useState<ClientDocument | null>(null);
  const [paymentInvoice, setPaymentInvoice] = useState<ClientInvoice | null>(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [targetUploadProjectId, setTargetUploadProjectId] = useState<string | undefined>(undefined);
  const [targetUploadProjectTitle, setTargetUploadProjectTitle] = useState<string | undefined>(undefined);
  const [uploadSuccessToast, setUploadSuccessToast] = useState<string | null>(null);
  const [commentToast, setCommentToast] = useState<{message: string} | null>(null);
  const [milestoneNotification, setMilestoneNotification] = useState<{message: string} | null>(null);

  const prevProjectsRef = useRef<ClientProject[]>([]);
  const lastCommentTimestamp = useRef(Date.now());

  useEffect(() => {
    if (!currentUser || projects.length === 0) return;
    const projectIds = projects.map(p => p.id);
    const unsub = subscribeToCommentsForProjects(projectIds, (comments) => {
      const latest = comments[0];
      if (latest && latest.authorType === 'consultant' && latest.createdAt?.toDate().getTime() > lastCommentTimestamp.current) {
        setCommentToast({ message: `New comment from consultant on "${latest.milestoneTitle}"` });
        lastCommentTimestamp.current = latest.createdAt?.toDate().getTime();
        setTimeout(() => setCommentToast(null), 5000);
      }
    });
    return unsub;
  }, [currentUser, projects]);

  useEffect(() => {
    if (!currentUser) return;
    
    // Subscribe to projects with change detection
    const unsubscribe = subscribeToClientProjects(currentUser.uid, (newProjects) => {
      const prevProjects = prevProjectsRef.current;
      
      // Compare and detect status changes
      newProjects.forEach(newProj => {
        const oldProj = prevProjects.find(p => p.id === newProj.id);
        if (oldProj && oldProj.milestones) {
          newProj.milestones?.forEach(newM => {
            const oldM = oldProj.milestones?.find(m => m.id === newM.id);
            if (oldM && oldM.status !== newM.status && (newM.status === 'completed' || newM.status === 'delayed')) {
              setMilestoneNotification({
                message: `Milestone "${newM.title}" in project "${newProj.title}" is now ${newM.status === 'completed' ? 'Completed' : 'Delayed'}.`
              });
              setTimeout(() => setMilestoneNotification(null), 6000);
            }
          });
        }
      });
      
      setProjects(newProjects);
      prevProjectsRef.current = newProjects;
    });
    
    return () => unsubscribe();
  }, [currentUser]);

  const handleOpenUploadModal = (projectId?: string, projectTitle?: string) => {
    setTargetUploadProjectId(projectId || projects[0]?.id);
    setTargetUploadProjectTitle(projectTitle || projects.find(p => p.id === projectId)?.title || projects[0]?.title);
    setUploadModalOpen(true);
  };

  const handleUploadSuccess = (newDoc: ClientDocument) => {
    setUploadModalOpen(false);
    setUploadSuccessToast(`"${newDoc.title}" uploaded to Firebase Storage and linked to ${newDoc.projectTitle || 'project'}.`);
    setTimeout(() => {
      setUploadSuccessToast(null);
    }, 4500);
  };

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        // Fetch or seed profile
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserProfile(userDoc.data() as ClientProfile);
          } else {
            await seedInitialClientDataIfEmpty(
              user.uid, 
              user.email || 'executive.client@apex-enterprises.com',
              user.displayName || 'Executive Client',
              'Apex Strategic Enterprises'
            );
            const refetched = await getDoc(doc(db, 'users', user.uid));
            if (refetched.exists()) {
              setUserProfile(refetched.data() as ClientProfile);
            }
          }
        } catch (err) {
          console.warn('Error fetching user profile:', err);
        }
      } else {
        setUserProfile(null);
        setProjects([]);
        setInvoices([]);
        setDocuments([]);
        setMessages([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Subscribe to real-time Firestore collections when user is authenticated
  useEffect(() => {
    if (!currentUser) return;

    const unsubProjects = subscribeToClientProjects(currentUser.uid, (data) => {
      setProjects(data);
    });

    const unsubInvoices = subscribeToClientInvoices(currentUser.uid, (data) => {
      setInvoices(data);
    });

    const unsubDocs = subscribeToClientDocuments(currentUser.uid, (data) => {
      setDocuments(data);
    });

    const unsubMessages = subscribeToPortalMessages(currentUser.uid, (data) => {
      setMessages(data);
    });

    return () => {
      unsubProjects();
      unsubInvoices();
      unsubDocs();
      unsubMessages();
    };
  }, [currentUser]);

  if (!isOpen) return null;

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  const pendingInvoicesCount = invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length;
  const unreadMessagesCount = messages.filter(m => !m.read && m.senderType === 'consultant').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-hidden">
      
      {/* Modal Shell Container */}
      <div className="bg-slate-50 rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-7xl h-[94vh] flex flex-col overflow-hidden relative">
        
        {/* Top Executive App Bar */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white px-6 py-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          
          <div className="flex items-center space-x-4">
            {/* Portal Badge */}
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold font-serif shadow-md shadow-blue-500/30">
                A
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-base font-bold font-serif tracking-tight">Accounticca</h2>
                  <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider">
                    Executive Portal
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 font-mono">
                  {userProfile?.companyName || 'Apex Strategic Enterprises'} • Firestore Synchronized
                </p>
              </div>
            </div>
          </div>

          {/* User Auth controls */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="flex items-center space-x-3">
                <div className="hidden sm:flex items-center space-x-2 text-xs bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-semibold text-slate-200">{userProfile?.displayName || currentUser.email}</span>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white text-xs font-semibold flex items-center space-x-1.5 transition"
                  title="Sign out of Portal"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/25 transition flex items-center space-x-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Client Sign In</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-slate-400 hover:text-white flex items-center justify-center transition ml-2"
              aria-label="Close portal modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated State Notice */}
        {!currentUser ? (
          <div className="flex-1 flex items-center justify-center p-6 bg-slate-100/60 overflow-y-auto">
            <div className="bg-white rounded-3xl p-8 sm:p-10 max-w-lg w-full text-center border border-slate-200 shadow-xl space-y-6">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <Lock className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider">
                  Confidential Client Gateway
                </span>
                <h3 className="text-2xl font-bold font-serif text-slate-900">
                  Authenticate for Client Access
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Sign in with your enterprise credentials or launch with instant 1-click Demo Access to view your live project milestones, invoices, and shared financial models in Firestore.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setAuthModalOpen(true)}
                  className="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-lg shadow-blue-500/25 transition flex items-center justify-center space-x-2 active:scale-98"
                >
                  <Lock className="w-4 h-4" />
                  <span>Access Secure Client Portal</span>
                </button>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-center space-x-1.5 text-slate-400 text-[11px]">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Protected by Firebase Firestore Security Rules</span>
              </div>
            </div>
          </div>
        ) : (
          /* Authenticated Portal Interface */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            
            {/* Sidebar Navigation */}
            <div className="w-full md:w-64 bg-white border-r border-slate-200/80 p-4 shrink-0 flex flex-row md:flex-col justify-between overflow-x-auto md:overflow-y-auto space-y-0 md:space-y-1">
              
              <div className="flex flex-row md:flex-col gap-1 flex-1">
                
                {/* Tab: Project Status */}
                <button
                  onClick={() => setActiveTab('projects')}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'projects'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Briefcase className="w-4 h-4" />
                    <span>Project Overview</span>
                  </div>
                  {projects.length > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      activeTab === 'projects' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {projects.length}
                    </span>
                  )}
                </button>

                {/* Tab: Gantt Roadmap */}
                <button
                  onClick={() => setActiveTab('timeline')}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'timeline'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Workflow className="w-4 h-4" />
                    <span>Gantt Roadmap</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                </button>

                {/* Tab: Invoices & Billing */}
                <button
                  onClick={() => setActiveTab('invoices')}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'invoices'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Receipt className="w-4 h-4" />
                    <span>Pending Invoices</span>
                  </div>
                  {pendingInvoicesCount > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      activeTab === 'invoices' ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {pendingInvoicesCount} Due
                    </span>
                  )}
                </button>

                {/* Tab: Document Vault */}
                <button
                  onClick={() => setActiveTab('documents')}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'documents'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FolderLock className="w-4 h-4" />
                    <span>Document Vault</span>
                  </div>
                  {documents.length > 0 && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                      activeTab === 'documents' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {documents.length}
                    </span>
                  )}
                </button>

                {/* Tab: Advisory Messaging */}
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'messages'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4" />
                    <span>Advisory Channel</span>
                  </div>
                  {unreadMessagesCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </button>

                {/* Tab: Performance Metrics */}
                <button
                  onClick={() => setActiveTab('metrics')}
                  className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition whitespace-nowrap ${
                    activeTab === 'metrics'
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <BarChart3 className="w-4 h-4" />
                    <span>Performance Metrics</span>
                  </div>
                </button>

              </div>

              {/* Client Organization Card at bottom */}
              <div className="hidden md:block p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2 mt-auto">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 truncate">
                      {userProfile?.companyName || 'Apex Enterprises'}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">
                      Tier: Strategic Enterprise
                    </p>
                  </div>
                </div>

                <div className="text-[10px] text-slate-500 pt-2 border-t border-slate-200">
                  <p>Lead Partner: <span className="font-semibold text-slate-700">Sarah Jenkins, FCA</span></p>
                </div>
              </div>

            </div>

            {/* Main Content Area */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 bg-slate-100/50">
              
              {activeTab === 'projects' && (
                <ProjectStatusView
                  projects={projects}
                  documents={documents}
                  onOpenDocumentPreview={(doc) => setPreviewDoc(doc)}
                  onOpenConsultation={onOpenConsultation}
                  onOpenMessagesTab={() => setActiveTab('messages')}
                  onOpenUploadModal={handleOpenUploadModal}
                />
              )}

              {activeTab === 'timeline' && projects.length > 0 && (
                <div className="space-y-6">
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-600 block">Strategic Project</span>
                      <h2 className="text-xl font-bold font-serif text-slate-900">{projects[0]?.title}</h2>
                    </div>
                    <button
                      onClick={() => setActiveTab('projects')}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
                    >
                      View All Project Details
                    </button>
                  </div>
                  <ProjectTimelineView
                    project={projects[0]}
                    onOpenDocumentPreview={(doc) => setPreviewDoc(doc)}
                    onOpenUploadModal={handleOpenUploadModal}
                  />
                </div>
              )}

              {activeTab === 'invoices' && (
                <InvoicesView
                  invoices={invoices}
                  onOpenPaymentModal={(inv) => setPaymentInvoice(inv)}
                />
              )}

              {activeTab === 'documents' && (
                <DocumentsVaultView
                  documents={documents}
                  projects={projects}
                  userProfile={userProfile}
                  userId={currentUser?.uid || ''}
                  onOpenPreview={(doc) => setPreviewDoc(doc)}
                  onOpenUploadModal={(projId) => handleOpenUploadModal(projId)}
                />
              )}

              {activeTab === 'metrics' && projects.length > 0 && (
                <PerformanceMetricsTab project={projects[0]} />
              )}

              {activeTab === 'messages' && (
                <PortalMessagesView
                  messages={messages}
                  userProfile={userProfile}
                  userId={currentUser.uid}
                  projectId={projects[0]?.id}
                />
              )}

            </div>

          </div>
        )}

      </div>

      {/* Upload Toast Notification */}
      {uploadSuccessToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center space-x-3 text-xs animate-slideUp">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{uploadSuccessToast}</span>
          <button 
            onClick={() => setUploadSuccessToast(null)}
            className="text-slate-400 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Milestone Status Notification Toast */}
      {milestoneNotification && (
        <div className="fixed bottom-24 right-6 z-50 bg-blue-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-blue-700 flex items-center space-x-3 text-xs animate-slideUp">
          <Bell className="w-4 h-4 text-blue-300 shrink-0" />
          <span className="font-semibold">{milestoneNotification.message}</span>
          <button 
            onClick={() => setMilestoneNotification(null)}
            className="text-blue-300 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* New Comment Notification Toast */}
      {commentToast && (
        <div className="fixed bottom-40 right-6 z-50 bg-indigo-900 text-white px-4 py-3 rounded-2xl shadow-xl border border-indigo-700 flex items-center space-x-3 text-xs animate-slideUp">
          <MessageSquare className="w-4 h-4 text-indigo-300 shrink-0" />
          <span className="font-semibold">{commentToast.message}</span>
          <button 
            onClick={() => setCommentToast(null)}
            className="text-indigo-300 hover:text-white p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Sub-modals */}
      <PortalAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => setAuthModalOpen(false)}
      />

      <DocumentPreviewModal
        document={previewDoc}
        clientProfile={userProfile}
        onClose={() => setPreviewDoc(null)}
      />

      <InvoicePaymentModal
        invoice={paymentInvoice}
        onClose={() => setPaymentInvoice(null)}
        onPaymentSuccess={() => setPaymentInvoice(null)}
      />

      {currentUser && (
        <UploadDocumentModal
          userId={currentUser.uid}
          projects={projects}
          initialProjectId={targetUploadProjectId}
          initialProjectTitle={targetUploadProjectTitle}
          isOpen={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
      )}

    </div>
  );
};
