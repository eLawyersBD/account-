import React, { useState, useEffect } from 'react';
import {
  X,
  HardDrive,
  FileSpreadsheet,
  Mail,
  Calendar as CalendarIcon,
  FileText,
  Plus,
  Trash2,
  ExternalLink,
  Upload,
  Send,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Search,
  Video,
  FilePlus,
  Table,
  Check,
  UserCheck,
  Sparkles,
  Lock
} from 'lucide-react';
import {
  initWorkspaceAuth,
  signInWithGoogleWorkspace,
  getWorkspaceAccessToken,
  fetchDriveFiles,
  uploadDriveFile,
  deleteDriveFile,
  createGoogleSheet,
  readGoogleSheetValues,
  sendGmailMessage,
  fetchRecentGmailMessages,
  fetchCalendarEvents,
  createCalendarEvent,
  deleteCalendarEvent,
  createGoogleForm,
  DriveFileItem,
  GmailMessageItem,
  CalendarEventItem
} from '../lib/workspace';
import { User } from 'firebase/auth';

interface GoogleWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'drive' | 'sheets' | 'gmail' | 'calendar' | 'forms';
  financialData?: {
    revenue: number;
    expenses: number;
    roi: number;
    healthScore: number;
  };
}

export const GoogleWorkspaceModal: React.FC<GoogleWorkspaceModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'drive',
  financialData = { revenue: 100000, expenses: 75000, roi: 3.4, healthScore: 82 }
}) => {
  const [activeTab, setActiveTab] = useState<'drive' | 'sheets' | 'gmail' | 'calendar' | 'forms'>(defaultTab);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(getWorkspaceAccessToken());
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Status & Notification Feedback
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // 1. Google Drive State
  const [driveFiles, setDriveFiles] = useState<DriveFileItem[]>([]);
  const [isDriveLoading, setIsDriveLoading] = useState(false);
  const [driveSearch, setDriveSearch] = useState('');
  const [uploadFileName, setUploadFileName] = useState('Accounticca_Financial_Health_Summary.txt');
  const [uploadContent, setUploadContent] = useState(
    `ACCOUNTICCA EXECUTIVE ADVISORY REPORT\nGenerated: ${new Date().toLocaleString()}\n\nMonthly Baseline Revenue: $${financialData.revenue.toLocaleString()}\nOperating Expenses: $${financialData.expenses.toLocaleString()}\nProjected Advisory ROI: ${financialData.roi}x\nFinancial Health Index: ${financialData.healthScore}/100\n\nConfidential Document - Internal Board Review Only.`
  );
  const [isUploadingDrive, setIsUploadingDrive] = useState(false);

  // 2. Google Sheets State
  const [sheetTitle, setSheetTitle] = useState('Accounticca Financial Growth Baseline & Strategy');
  const [createdSheet, setCreatedSheet] = useState<{ url: string; id: string; title: string } | null>(null);
  const [isCreatingSheet, setIsCreatingSheet] = useState(false);
  const [customSheetId, setCustomSheetId] = useState('');
  const [readSheetValues, setReadSheetValues] = useState<(string | number)[][] | null>(null);
  const [isReadingSheet, setIsReadingSheet] = useState(false);

  // 3. Gmail State
  const [gmailMessages, setGmailMessages] = useState<GmailMessageItem[]>([]);
  const [isGmailLoading, setIsGmailLoading] = useState(false);
  const [mailTo, setMailTo] = useState('erp.elawyers@gmail.com');
  const [mailSubject, setMailSubject] = useState('Executive Advisory Report & Financial Health Overview');
  const [mailBody, setMailBody] = useState(
    `Dear Executive Advisory Board,\n\nPlease find attached the latest Accounticca Financial Health summary:\n\n- Baseline Monthly Revenue: $${financialData.revenue.toLocaleString()}\n- Operating Expense Ratio: ${Math.round((financialData.expenses / (financialData.revenue || 1)) * 100)}%\n- Health Index Score: ${financialData.healthScore}/100\n- Projected ROI Multiplier: ${financialData.roi}x\n\nBest regards,\nAccounticca Executive Suite`
  );
  const [isSendingGmail, setIsSendingGmail] = useState(false);

  // 4. Google Calendar State
  const [calendarEvents, setCalendarEvents] = useState<CalendarEventItem[]>([]);
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calSummary, setCalSummary] = useState('Accounticca Board & Financial Audit Review');
  const [calDesc, setCalDesc] = useState('Strategic advisory session with Accounticca senior partners.');
  const [calDate, setCalDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [calTime, setCalTime] = useState('14:00');
  const [calAttendee, setCalAttendee] = useState('erp.elawyers@gmail.com');
  const [isCreatingCal, setIsCreatingCal] = useState(false);

  // 5. Google Forms State
  const [formTitle, setFormTitle] = useState('Accounticca SME Client Onboarding & Financial Intake');
  const [formDesc, setFormDesc] = useState('Official intake survey for Accounticca strategic financial advisory clients.');
  const [createdForm, setCreatedForm] = useState<{ formId: string; responderUri?: string; title: string } | null>(null);
  const [isCreatingForm, setIsCreatingForm] = useState(false);

  // Confirmation Modals State for Destructive/Mutating Operations
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    description: string;
    actionType: 'delete_drive' | 'send_gmail' | 'delete_cal' | 'create_form';
    itemId?: string;
    onConfirm: () => Promise<void>;
  }>({
    isOpen: false,
    title: '',
    description: '',
    actionType: 'delete_drive',
    onConfirm: async () => {},
  });

  // Auth Initialization Effect
  useEffect(() => {
    const unsubscribe = initWorkspaceAuth(
      (user, token) => {
        setCurrentUser(user);
        setAccessToken(token);
        setAuthError(null);
      },
      () => {
        setCurrentUser(null);
        setAccessToken(null);
      }
    );
    return () => unsubscribe();
  }, []);

  // Update default tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(defaultTab);
    }
  }, [isOpen, defaultTab]);

  // Load Tab Data when authenticated
  useEffect(() => {
    if (isOpen && accessToken) {
      if (activeTab === 'drive') loadDrive();
      if (activeTab === 'gmail') loadGmail();
      if (activeTab === 'calendar') loadCalendar();
    }
  }, [isOpen, activeTab, accessToken]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const { user, accessToken: token } = await signInWithGoogleWorkspace();
      setCurrentUser(user);
      setAccessToken(token);
      setFeedback({ type: 'success', message: `Connected to Google Workspace as ${user.email}` });
    } catch (err: any) {
      console.error('Workspace Auth Error:', err);
      setAuthError(err.message || 'Failed to authenticate with Google Workspace.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // Loaders for Each Workspace Service
  const loadDrive = async () => {
    if (!accessToken) return;
    setIsDriveLoading(true);
    try {
      const files = await fetchDriveFiles(accessToken);
      setDriveFiles(files);
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Drive Load Error: ${err.message}` });
    } finally {
      setIsDriveLoading(false);
    }
  };

  const loadGmail = async () => {
    if (!accessToken) return;
    setIsGmailLoading(true);
    try {
      const msgs = await fetchRecentGmailMessages(accessToken);
      setGmailMessages(msgs);
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Gmail Load Error: ${err.message}` });
    } finally {
      setIsGmailLoading(false);
    }
  };

  const loadCalendar = async () => {
    if (!accessToken) return;
    setIsCalendarLoading(true);
    try {
      const events = await fetchCalendarEvents(accessToken);
      setCalendarEvents(events);
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Calendar Load Error: ${err.message}` });
    } finally {
      setIsCalendarLoading(false);
    }
  };

  // 1. DRIVE HANDLERS
  const handleUploadDriveFile = async () => {
    if (!accessToken) return;
    setIsUploadingDrive(true);
    try {
      const file = await uploadDriveFile(uploadFileName, uploadContent, 'text/plain', accessToken);
      setFeedback({ type: 'success', message: `File "${file.name}" uploaded to Google Drive!` });
      loadDrive();
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Drive Upload Failed: ${err.message}` });
    } finally {
      setIsUploadingDrive(false);
    }
  };

  const requestDeleteDriveFile = (file: DriveFileItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Delete File from Google Drive?',
      description: `Are you sure you want to permanently remove "${file.name}" from your Google Drive? This action cannot be undone.`,
      actionType: 'delete_drive',
      itemId: file.id,
      onConfirm: async () => {
        try {
          await deleteDriveFile(file.id, accessToken || undefined);
          setFeedback({ type: 'success', message: `File "${file.name}" removed from Google Drive.` });
          loadDrive();
        } catch (err: any) {
          setFeedback({ type: 'error', message: `Delete Failed: ${err.message}` });
        }
      },
    });
  };

  // 2. SHEETS HANDLERS
  const handleCreateSheet = async () => {
    if (!accessToken) return;
    setIsCreatingSheet(true);
    try {
      const rows = [
        ['Accounticca Financial Health Report', 'Date', new Date().toLocaleDateString()],
        ['Metric', 'Value', 'Unit', 'Benchmark Target'],
        ['Monthly Revenue Baseline', financialData.revenue, 'USD', '$120,000'],
        ['Operating Expenses', financialData.expenses, 'USD', '$65,000'],
        ['Operating Margin', `${Math.round(((financialData.revenue - financialData.expenses) / (financialData.revenue || 1)) * 100)}%`, '%', '35%'],
        ['Financial Health Score', financialData.healthScore, '/100', '85/100'],
        ['Projected ROI Multiplier', `${financialData.roi}x`, 'x', '3.0x'],
      ];

      const sheetData = await createGoogleSheet(sheetTitle, rows, accessToken);
      setCreatedSheet({ url: sheetData.spreadsheetUrl, id: sheetData.spreadsheetId, title: sheetData.title });
      setFeedback({ type: 'success', message: `Google Sheet "${sheetTitle}" created successfully!` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Sheet Creation Failed: ${err.message}` });
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleReadSheet = async () => {
    if (!accessToken || !customSheetId) return;
    setIsReadingSheet(true);
    try {
      const values = await readGoogleSheetValues(customSheetId.trim(), 'A1:E20', accessToken);
      setReadSheetValues(values);
      setFeedback({ type: 'success', message: `Loaded ${values.length} rows from Google Sheet.` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Read Sheet Failed: ${err.message}` });
    } finally {
      setIsReadingSheet(false);
    }
  };

  // 3. GMAIL HANDLERS
  const requestSendGmail = () => {
    if (!mailTo || !mailSubject) return;
    setConfirmModal({
      isOpen: true,
      title: 'Send Executive Email via Gmail?',
      description: `You are about to send an email to "${mailTo}" with the subject "${mailSubject}". Please confirm before dispatching.`,
      actionType: 'send_gmail',
      onConfirm: async () => {
        setIsSendingGmail(true);
        try {
          await sendGmailMessage(mailTo, mailSubject, mailBody, accessToken || undefined);
          setFeedback({ type: 'success', message: `Gmail sent successfully to ${mailTo}!` });
          loadGmail();
        } catch (err: any) {
          setFeedback({ type: 'error', message: `Gmail Dispatch Failed: ${err.message}` });
        } finally {
          setIsSendingGmail(false);
        }
      },
    });
  };

  // 4. CALENDAR HANDLERS
  const handleCreateCalendarEvent = async () => {
    if (!accessToken || !calSummary || !calDate || !calTime) return;
    setIsCreatingCal(true);
    try {
      const startIso = `${calDate}T${calTime}:00`;
      const startDate = new Date(startIso);
      const endDate = new Date(startDate.getTime() + 45 * 60 * 1000); // 45 mins

      const event = await createCalendarEvent(
        calSummary,
        calDesc,
        startDate.toISOString(),
        endDate.toISOString(),
        calAttendee || undefined,
        accessToken
      );

      setFeedback({
        type: 'success',
        message: `Google Calendar Event "${event.summary}" scheduled! ${event.hangoutLink ? 'Google Meet link attached.' : ''}`,
      });
      loadCalendar();
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Calendar Creation Failed: ${err.message}` });
    } finally {
      setIsCreatingCal(false);
    }
  };

  const requestDeleteCalEvent = (event: CalendarEventItem) => {
    setConfirmModal({
      isOpen: true,
      title: 'Cancel Google Calendar Event?',
      description: `Are you sure you want to cancel and remove "${event.summary}" from your primary Google Calendar?`,
      actionType: 'delete_cal',
      itemId: event.id,
      onConfirm: async () => {
        try {
          await deleteCalendarEvent(event.id, accessToken || undefined);
          setFeedback({ type: 'success', message: `Calendar event "${event.summary}" cancelled.` });
          loadCalendar();
        } catch (err: any) {
          setFeedback({ type: 'error', message: `Cancel Event Failed: ${err.message}` });
        }
      },
    });
  };

  // 5. FORMS HANDLERS
  const handleCreateForm = async () => {
    if (!accessToken || !formTitle) return;
    setIsCreatingForm(true);
    try {
      const form = await createGoogleForm(formTitle, formDesc, accessToken);
      setCreatedForm({
        formId: form.formId,
        responderUri: form.responderUri,
        title: form.info.title,
      });
      setFeedback({ type: 'success', message: `Google Form "${form.info.title}" created successfully!` });
    } catch (err: any) {
      setFeedback({ type: 'error', message: `Create Form Failed: ${err.message}` });
    } finally {
      setIsCreatingForm(false);
    }
  };

  const filteredDriveFiles = driveFiles.filter((f) => f.name.toLowerCase().includes(driveSearch.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden text-slate-800">
        
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-xl font-bold font-serif tracking-tight flex items-center space-x-2">
                <span>Google Workspace Integration Suite</span>
              </h2>
              <p className="text-xs text-slate-300">
                Drive • Sheets • Gmail • Calendar • Forms Enterprise Connectivity
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="hidden sm:flex items-center space-x-2 bg-slate-800/80 border border-slate-700 px-3 py-1.5 rounded-full text-xs text-slate-200">
                {currentUser.photoURL ? (
                  <img src={currentUser.photoURL} alt="" className="w-5 h-5 rounded-full" />
                ) : (
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                )}
                <span className="font-semibold truncate max-w-[150px]">{currentUser.email}</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="gsi-material-button bg-white text-slate-700 hover:bg-slate-100 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-2 border border-slate-300 shadow-2xs"
              >
                {isAuthenticating ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                )}
                <span>Sign in with Google</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Alert */}
        {feedback && (
          <div
            className={`px-6 py-2.5 text-xs font-semibold flex items-center justify-between transition ${
              feedback.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-b border-emerald-200'
                : feedback.type === 'error'
                ? 'bg-rose-50 text-rose-800 border-b border-rose-200'
                : 'bg-blue-50 text-blue-800 border-b border-blue-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {feedback.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
            <button onClick={() => setFeedback(null)} className="text-slate-500 hover:text-slate-800">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Auth Required State Prompt */}
        {!accessToken ? (
          <div className="p-8 sm:p-12 text-center space-y-6 flex-1 flex flex-col justify-center items-center">
            <div className="w-16 h-16 rounded-3xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 shadow-md">
              <Lock className="w-8 h-8" />
            </div>
            <div className="max-w-md space-y-2">
              <h3 className="text-2xl font-serif font-bold text-slate-900">Google Workspace Authorization</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Connect your official Google account to interact with Google Drive, Google Sheets, Gmail, Google Calendar, and Google Forms directly within Accounticca.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-2xl text-xs text-rose-700 max-w-md">
                {authError}
              </div>
            )}

            <button
              type="button"
              onClick={handleSignIn}
              disabled={isAuthenticating}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold shadow-lg shadow-blue-500/20 transition flex items-center space-x-3"
            >
              {isAuthenticating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                </svg>
              )}
              <span>Connect Google Account with Permission</span>
            </button>
          </div>
        ) : (
          <>
            {/* Service Navigation Tabs */}
            <div className="flex items-center space-x-1 border-b border-slate-200 bg-slate-50 px-6 pt-3 overflow-x-auto shrink-0">
              <button
                onClick={() => setActiveTab('drive')}
                className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition flex items-center space-x-2 border-t border-x border-transparent ${
                  activeTab === 'drive'
                    ? 'bg-white text-blue-700 border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <HardDrive className="w-4 h-4 text-amber-600" />
                <span>Google Drive</span>
              </button>

              <button
                onClick={() => setActiveTab('sheets')}
                className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition flex items-center space-x-2 border-t border-x border-transparent ${
                  activeTab === 'sheets'
                    ? 'bg-white text-emerald-700 border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                <span>Google Sheets</span>
              </button>

              <button
                onClick={() => setActiveTab('gmail')}
                className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition flex items-center space-x-2 border-t border-x border-transparent ${
                  activeTab === 'gmail'
                    ? 'bg-white text-rose-700 border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Mail className="w-4 h-4 text-rose-600" />
                <span>Gmail</span>
              </button>

              <button
                onClick={() => setActiveTab('calendar')}
                className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition flex items-center space-x-2 border-t border-x border-transparent ${
                  activeTab === 'calendar'
                    ? 'bg-white text-blue-700 border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <CalendarIcon className="w-4 h-4 text-blue-600" />
                <span>Google Calendar</span>
              </button>

              <button
                onClick={() => setActiveTab('forms')}
                className={`px-4 py-2.5 rounded-t-2xl text-xs font-bold transition flex items-center space-x-2 border-t border-x border-transparent ${
                  activeTab === 'forms'
                    ? 'bg-white text-purple-700 border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <FileText className="w-4 h-4 text-purple-600" />
                <span>Google Forms</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* TAB 1: GOOGLE DRIVE */}
              {activeTab === 'drive' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div>
                      <h3 className="text-base font-serif font-bold text-slate-900 flex items-center space-x-2">
                        <HardDrive className="w-5 h-5 text-amber-600" />
                        <span>Google Drive Executive Cloud Storage</span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Upload financial reports, strategy documents, or list existing Drive assets.
                      </p>
                    </div>

                    <button
                      onClick={loadDrive}
                      disabled={isDriveLoading}
                      className="px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-xs font-semibold text-slate-700 flex items-center space-x-1.5 transition"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isDriveLoading ? 'animate-spin text-blue-600' : ''}`} />
                      <span>Refresh Drive</span>
                    </button>
                  </div>

                  {/* Upload to Drive Card */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                      <Upload className="w-4 h-4 text-blue-600" />
                      <span>Upload Financial Summary / Document to Drive</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">File Name</label>
                        <input
                          type="text"
                          value={uploadFileName}
                          onChange={(e) => setUploadFileName(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Document Format</label>
                        <input
                          type="text"
                          readOnly
                          value="Plain Text (.txt) / Financial Summary"
                          className="w-full px-3 py-2 border border-slate-100 bg-slate-50 rounded-xl text-xs font-semibold text-slate-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Content Preview</label>
                      <textarea
                        rows={3}
                        value={uploadContent}
                        onChange={(e) => setUploadContent(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleUploadDriveFile}
                      disabled={isUploadingDrive}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center space-x-2 shadow-sm"
                    >
                      {isUploadingDrive ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                      <span>Save Directly to Google Drive</span>
                    </button>
                  </div>

                  {/* Drive Files List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent Drive Files</h4>
                      <div className="relative w-48 sm:w-64">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                        <input
                          type="text"
                          placeholder="Search Drive..."
                          value={driveSearch}
                          onChange={(e) => setDriveSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {isDriveLoading ? (
                      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Fetching Google Drive file registry...</span>
                      </div>
                    ) : filteredDriveFiles.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                        No Google Drive files found matching filter.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                        {filteredDriveFiles.map((f) => (
                          <div key={f.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                            <div className="flex items-center space-x-3 overflow-hidden">
                              <HardDrive className="w-4 h-4 text-amber-600 shrink-0" />
                              <div className="truncate">
                                <p className="text-xs font-bold text-slate-800 truncate">{f.name}</p>
                                <p className="text-[10px] text-slate-400 font-mono">{f.mimeType}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              {f.webViewLink && (
                                <a
                                  href={f.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                  title="Open in Google Drive"
                                >
                                  <ExternalLink className="w-4 h-4" />
                                </a>
                              )}
                              <button
                                type="button"
                                onClick={() => requestDeleteDriveFile(f)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                                title="Delete File"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: GOOGLE SHEETS */}
              {activeTab === 'sheets' && (
                <div className="space-y-6">
                  <div className="bg-emerald-50/80 p-4 rounded-2xl border border-emerald-200">
                    <h3 className="text-base font-serif font-bold text-emerald-950 flex items-center space-x-2">
                      <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                      <span>Google Sheets Financial Modeling & Export Hub</span>
                    </h3>
                    <p className="text-xs text-emerald-800 mt-0.5">
                      Export baseline financial health metrics, ROI targets, and revenue projections into Google Spreadsheets.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                      <FilePlus className="w-4 h-4 text-emerald-600" />
                      <span>Export Financial Health Baseline to New Google Sheet</span>
                    </h4>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Spreadsheet Title</label>
                      <input
                        type="text"
                        value={sheetTitle}
                        onChange={(e) => setSheetTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                      <p className="font-bold text-slate-700">Data Row Preview:</p>
                      <ul className="list-disc list-inside text-[11px] text-slate-600 space-y-0.5">
                        <li>Monthly Baseline Revenue: ${financialData.revenue.toLocaleString()}</li>
                        <li>Operating Expenses: ${financialData.expenses.toLocaleString()}</li>
                        <li>Health Index Score: {financialData.healthScore}/100</li>
                        <li>Projected Advisory ROI Multiplier: {financialData.roi}x</li>
                      </ul>
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateSheet}
                      disabled={isCreatingSheet}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center space-x-2 shadow-sm"
                    >
                      {isCreatingSheet ? <Loader2 className="w-4 h-4 animate-spin" /> : <Table className="w-4 h-4" />}
                      <span>Generate Google Spreadsheet</span>
                    </button>

                    {createdSheet && (
                      <div className="p-3 bg-emerald-100/80 border border-emerald-300 rounded-xl text-xs flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                          <span className="font-bold text-emerald-900">Spreadsheet Created: {createdSheet.title}</span>
                        </div>
                        <a
                          href={createdSheet.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-emerald-700 text-white font-bold rounded-lg hover:bg-emerald-800 transition flex items-center space-x-1"
                        >
                          <span>Open Sheet</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Read Sheet Section */}
                  <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                      <Table className="w-4 h-4 text-slate-600" />
                      <span>Read Values from Existing Google Sheet</span>
                    </h4>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Paste Google Spreadsheet ID (e.g. 1BxiMVs0XRnt3...) "
                        value={customSheetId}
                        onChange={(e) => setCustomSheetId(e.target.value)}
                        className="flex-1 px-3 py-2 border border-slate-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={handleReadSheet}
                        disabled={isReadingSheet || !customSheetId}
                        className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center space-x-1.5"
                      >
                        {isReadingSheet ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                        <span>Fetch Data</span>
                      </button>
                    </div>

                    {readSheetValues && (
                      <div className="overflow-x-auto border border-slate-200 rounded-xl">
                        <table className="w-full text-left text-xs">
                          <tbody className="divide-y divide-slate-100">
                            {readSheetValues.map((row, idx) => (
                              <tr key={idx} className={idx === 0 ? 'bg-slate-100 font-bold' : 'hover:bg-slate-50'}>
                                {row.map((cell, cIdx) => (
                                  <td key={cIdx} className="p-2 border-r border-slate-200 text-slate-700">
                                    {String(cell)}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: GMAIL */}
              {activeTab === 'gmail' && (
                <div className="space-y-6">
                  <div className="bg-rose-50/80 p-4 rounded-2xl border border-rose-200">
                    <h3 className="text-base font-serif font-bold text-rose-950 flex items-center space-x-2">
                      <Mail className="w-5 h-5 text-rose-600" />
                      <span>Gmail Executive Advisory Communication</span>
                    </h3>
                    <p className="text-xs text-rose-800 mt-0.5">
                      Dispatch executive summaries or consultation follow-ups directly through your Gmail inbox.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                      <Send className="w-4 h-4 text-rose-600" />
                      <span>Compose Advisory Email Dispatch</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Recipient Email *</label>
                        <input
                          type="email"
                          value={mailTo}
                          onChange={(e) => setMailTo(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Subject Line *</label>
                        <input
                          type="text"
                          value={mailSubject}
                          onChange={(e) => setMailSubject(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-rose-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Email Body *</label>
                      <textarea
                        rows={4}
                        value={mailBody}
                        onChange={(e) => setMailBody(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-rose-500 bg-slate-50/50"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={requestSendGmail}
                      disabled={isSendingGmail}
                      className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition flex items-center space-x-2 shadow-sm"
                    >
                      {isSendingGmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>Send Advisory Email via Gmail</span>
                    </button>
                  </div>

                  {/* Gmail Inbox Feed */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent Gmail Messages</h4>
                      <button
                        onClick={loadGmail}
                        disabled={isGmailLoading}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center space-x-1"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGmailLoading ? 'animate-spin text-rose-600' : ''}`} />
                        <span>Refresh Inbox</span>
                      </button>
                    </div>

                    {isGmailLoading ? (
                      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-rose-600" />
                        <span>Syncing with Gmail API...</span>
                      </div>
                    ) : gmailMessages.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                        No recent messages retrieved from Gmail.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                        {gmailMessages.map((m) => (
                          <div key={m.id} className="p-3.5 hover:bg-slate-50 transition space-y-1">
                            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                              <span className="truncate max-w-[250px]">{m.from}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{m.date}</span>
                            </div>
                            <p className="text-xs font-semibold text-rose-950">{m.subject}</p>
                            <p className="text-[11px] text-slate-500 line-clamp-1">{m.snippet}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: GOOGLE CALENDAR */}
              {activeTab === 'calendar' && (
                <div className="space-y-6">
                  <div className="bg-blue-50/80 p-4 rounded-2xl border border-blue-200">
                    <h3 className="text-base font-serif font-bold text-blue-950 flex items-center space-x-2">
                      <CalendarIcon className="w-5 h-5 text-blue-600" />
                      <span>Google Calendar & Video Conferencing Manager</span>
                    </h3>
                    <p className="text-xs text-blue-800 mt-0.5">
                      Schedule strategic advisory sessions with automatic Google Meet integration.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>Schedule New Google Calendar Event</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Event Summary *</label>
                        <input
                          type="text"
                          value={calSummary}
                          onChange={(e) => setCalSummary(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Attendee Email</label>
                        <input
                          type="email"
                          value={calAttendee}
                          onChange={(e) => setCalAttendee(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Date *</label>
                        <input
                          type="date"
                          value={calDate}
                          onChange={(e) => setCalDate(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-600 mb-1">Start Time *</label>
                        <input
                          type="time"
                          value={calTime}
                          onChange={(e) => setCalTime(e.target.value)}
                          className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Agenda / Description</label>
                      <input
                        type="text"
                        value={calDesc}
                        onChange={(e) => setCalDesc(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateCalendarEvent}
                      disabled={isCreatingCal}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center space-x-2 shadow-sm"
                    >
                      {isCreatingCal ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarIcon className="w-4 h-4" />}
                      <span>Book on Google Calendar (with Meet Link)</span>
                    </button>
                  </div>

                  {/* Calendar Events List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">Upcoming Primary Calendar Events</h4>
                      <button
                        onClick={loadCalendar}
                        disabled={isCalendarLoading}
                        className="px-3 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100 flex items-center space-x-1"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isCalendarLoading ? 'animate-spin text-blue-600' : ''}`} />
                        <span>Refresh Calendar</span>
                      </button>
                    </div>

                    {isCalendarLoading ? (
                      <div className="p-8 text-center text-xs text-slate-500 flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span>Syncing Google Calendar API...</span>
                      </div>
                    ) : calendarEvents.length === 0 ? (
                      <div className="p-8 text-center text-xs text-slate-500 border border-dashed border-slate-200 rounded-2xl">
                        No upcoming events found on primary calendar.
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                        {calendarEvents.map((e) => (
                          <div key={e.id} className="p-3.5 flex items-center justify-between hover:bg-slate-50 transition">
                            <div className="space-y-0.5">
                              <p className="text-xs font-bold text-slate-900">{e.summary}</p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                {e.start?.dateTime ? new Date(e.start.dateTime).toLocaleString() : e.start?.date}
                              </p>
                              {e.hangoutLink && (
                                <a
                                  href={e.hangoutLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 font-bold hover:underline"
                                >
                                  <Video className="w-3 h-3 text-emerald-600" />
                                  <span>Google Meet Video Link</span>
                                </a>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => requestDeleteCalEvent(e)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                              title="Cancel Calendar Event"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 5: GOOGLE FORMS */}
              {activeTab === 'forms' && (
                <div className="space-y-6">
                  <div className="bg-purple-50/80 p-4 rounded-2xl border border-purple-200">
                    <h3 className="text-base font-serif font-bold text-purple-950 flex items-center space-x-2">
                      <FileText className="w-5 h-5 text-purple-600" />
                      <span>Google Forms Intake & Assessment Creator</span>
                    </h3>
                    <p className="text-xs text-purple-800 mt-0.5">
                      Generate client onboarding questionnaires and financial health surveys directly in Google Forms.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-4 shadow-xs">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                      <Plus className="w-4 h-4 text-purple-600" />
                      <span>Create Client Intake Survey Form</span>
                    </h4>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Form Title *</label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-600 mb-1">Form Description</label>
                      <textarea
                        rows={2}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full p-3 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50/50"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleCreateForm}
                      disabled={isCreatingForm}
                      className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition flex items-center space-x-2 shadow-sm"
                    >
                      {isCreatingForm ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
                      <span>Generate Google Form</span>
                    </button>

                    {createdForm && (
                      <div className="p-4 bg-purple-100/80 border border-purple-300 rounded-2xl text-xs space-y-2">
                        <div className="flex items-center space-x-2">
                          <Check className="w-4 h-4 text-purple-700 shrink-0" />
                          <span className="font-bold text-purple-950">Form Created: {createdForm.title}</span>
                        </div>
                        {createdForm.responderUri && (
                          <div className="flex items-center space-x-2">
                            <span className="text-[11px] text-purple-800">Respondent Link:</span>
                            <a
                              href={createdForm.responderUri}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1 bg-purple-700 text-white font-bold rounded-lg hover:bg-purple-800 transition flex items-center space-x-1"
                            >
                              <span>Open Form</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>
          </>
        )}

        {/* Confirmation Dialog for Mutating/Destructive Actions */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
              <div className="flex items-center space-x-3 text-rose-600">
                <AlertTriangle className="w-6 h-6 shrink-0 animate-bounce" />
                <h3 className="text-lg font-bold font-serif text-slate-900">{confirmModal.title}</h3>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{confirmModal.description}</p>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    const fn = confirmModal.onConfirm;
                    setConfirmModal((prev) => ({ ...prev, isOpen: false }));
                    await fn();
                  }}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-md shadow-rose-500/20"
                >
                  Confirm & Proceed
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Accounticca Enterprise Google Workspace Bridge</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition"
          >
            Close Suite
          </button>
        </div>

      </div>
    </div>
  );
};
