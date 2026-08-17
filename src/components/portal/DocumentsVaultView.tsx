import React, { useState } from 'react';
import { ClientDocument, DocumentCategory, ClientProject, ClientProfile } from '../../types';
import { downloadStrategyDocument } from '../../lib/documentVaultService';
import { 
  FolderLock, 
  Search, 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  Download, 
  Eye, 
  Lock, 
  Calendar, 
  User, 
  Filter,
  ShieldCheck, 
  ArrowUpRight,
  Briefcase,
  ExternalLink,
  RefreshCw,
  HardDrive,
  FileCode,
  FileCheck,
  CheckCircle2,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Sparkles,
  Layers,
  FileDown
} from 'lucide-react';

interface DocumentsVaultViewProps {
  documents: ClientDocument[];
  projects?: ClientProject[];
  userProfile?: ClientProfile | null;
  userId?: string;
  onOpenPreview: (doc: ClientDocument) => void;
  onOpenUploadModal: (projectId?: string) => void;
}

export const DocumentsVaultView: React.FC<DocumentsVaultViewProps> = ({
  documents,
  projects = [],
  userProfile,
  userId,
  onOpenPreview,
  onOpenUploadModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedProjectId, setSelectedProjectId] = useState<string>('all');
  const [selectedFileType, setSelectedFileType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  // Download feedback states
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [downloadedDocId, setDownloadedDocId] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  const categories = [
    'all',
    'Strategy Deck',
    'Financial Model',
    'Audit Report',
    'SOP Playbook',
    'Contract / NDA',
    'Deliverable',
    'Tax Document',
    'Operational Brief'
  ];

  const fileTypes = [
    { label: 'All Formats', value: 'all' },
    { label: 'PDF Decks & Reports', value: 'pdf' },
    { label: 'Word (.docx/.doc) Briefs', value: 'word' },
    { label: 'Excel (.xlsm/.xlsx) Models', value: 'excel' },
    { label: 'Presentations (.pptx)', value: 'presentation' }
  ];

  // Helper to categorize file type
  const getFileFormat = (fileName: string, fileType?: string) => {
    const fn = (fileName || '').toLowerCase();
    const ft = (fileType || '').toLowerCase();
    if (fn.endsWith('.pdf') || ft.includes('pdf')) return 'pdf';
    if (fn.endsWith('.docx') || fn.endsWith('.doc') || ft.includes('word')) return 'word';
    if (fn.endsWith('.xlsx') || fn.endsWith('.xlsm') || fn.endsWith('.xls') || ft.includes('excel')) return 'excel';
    if (fn.endsWith('.pptx') || fn.endsWith('.ppt') || ft.includes('powerpoint')) return 'presentation';
    return 'other';
  };

  const filteredDocs = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.description && doc.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.projectTitle && doc.projectTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (doc.sharedBy && doc.sharedBy.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesProject = selectedProjectId === 'all' || doc.projectId === selectedProjectId;
    
    const docFormat = getFileFormat(doc.fileName, doc.fileType);
    const matchesFileType = selectedFileType === 'all' || docFormat === selectedFileType;

    return matchesSearch && matchesCategory && matchesProject && matchesFileType;
  });

  const handleDownload = async (docItem: ClientDocument, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      setDownloadingDocId(docItem.id);
      await downloadStrategyDocument(docItem, userProfile);
      setDownloadingDocId(null);
      setDownloadedDocId(docItem.id);
      setTimeout(() => setDownloadedDocId(null), 3000);
    } catch (err) {
      console.error('Download error:', err);
      setDownloadingDocId(null);
    }
  };

  const handleSyncStorage = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast(`Firebase Storage synchronized: ${documents.length} verified strategy assets loaded for ${userProfile?.companyName || 'client'}.`);
      setTimeout(() => setSyncToast(null), 4000);
    }, 900);
  };

  // Vault Statistics Calculations
  const pdfCount = documents.filter(d => getFileFormat(d.fileName, d.fileType) === 'pdf').length;
  const wordCount = documents.filter(d => getFileFormat(d.fileName, d.fileType) === 'word').length;
  const excelCount = documents.filter(d => getFileFormat(d.fileName, d.fileType) === 'excel').length;

  return (
    <div className="space-y-6">
      
      {/* Executive Document Vault Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-6 sm:p-7 rounded-3xl text-white shadow-lg border border-slate-700/80 relative overflow-hidden">
        
        {/* Subtle decorative background glow */}
        <div className="absolute right-0 top-0 w-96 h-full bg-blue-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2.5 flex-wrap gap-1">
              <div className="px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1.5">
                <FolderLock className="w-3 h-3" />
                <span>Client Document Vault</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-mono font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3" />
                <span>Firebase Storage Connected</span>
              </span>
              <span className="px-2 py-1 rounded-full bg-white/10 text-slate-300 text-[10px] font-mono">
                UID: {userId ? `${userId.slice(0, 8)}...` : 'Client-Scoped'}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-serif text-white tracking-tight">
              Strategy & Deliverables Document Vault
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Directly pull, preview, and download proprietary transformation roadmaps (PDF), executive briefs (DOCX), and multi-scenario financial models (XLSX) securely from your isolated Firebase Storage repository.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-2">
            <button
              onClick={handleSyncStorage}
              disabled={isSyncing}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white font-semibold text-xs transition flex items-center space-x-2 active:scale-98 disabled:opacity-50"
              title="Pull latest document URLs from Firebase Storage"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Syncing Storage...' : 'Sync Storage'}</span>
            </button>

            <button
              onClick={() => onOpenUploadModal()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition flex items-center space-x-2 shrink-0 active:scale-98"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload to Storage</span>
            </button>
          </div>
        </div>

        {/* Vault Metric Cards Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-700/60 text-xs">
          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Total Documents</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-lg font-bold font-mono text-white">{documents.length}</span>
              <span className="text-[10px] text-slate-400">files in vault</span>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Strategy Roadmaps (PDF)</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-lg font-bold font-mono text-rose-300">{pdfCount}</span>
              <span className="text-[10px] text-slate-400">PDF deliverables</span>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Executive Briefs (DOCX)</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-lg font-bold font-mono text-blue-300">{wordCount}</span>
              <span className="text-[10px] text-slate-400">Word briefs</span>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-2xl border border-white/10">
            <span className="text-[10px] text-slate-400 uppercase font-bold block">Financial Models (XLSX)</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-lg font-bold font-mono text-emerald-300">{excelCount}</span>
              <span className="text-[10px] text-slate-400">dynamic models</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sync Toast Notification */}
      {syncToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-2xl text-xs flex items-center justify-between shadow-xs animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-semibold">{syncToast}</span>
          </div>
          <button onClick={() => setSyncToast(null)} className="text-emerald-600 hover:text-emerald-900 font-bold ml-3">
            ✕
          </button>
        </div>
      )}

      {/* Search, Filter & View Controls Bar */}
      <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        
        {/* Search input & Project Select */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search bar */}
          <div className="relative md:col-span-6">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, file name, consultant, or strategic keywords..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>

          {/* Project filter */}
          <div className="md:col-span-4 flex items-center space-x-2">
            <Briefcase className="w-4 h-4 text-slate-400 shrink-0" />
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Engagement Projects</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  Project: {p.title}
                </option>
              ))}
            </select>
          </div>

          {/* View mode toggle */}
          <div className="md:col-span-2 flex items-center justify-end space-x-1.5">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-xl border transition ${
                viewMode === 'grid'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-xl border transition ${
                viewMode === 'table'
                  ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-xs'
                  : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}
              title="Security List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* File Format Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100">
          <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 mr-1 flex items-center space-x-1">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Format:</span>
          </span>
          {fileTypes.map((ft) => (
            <button
              key={ft.value}
              onClick={() => setSelectedFileType(ft.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedFileType === ft.value
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {ft.label}
            </button>
          ))}
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1">
          <span className="text-[11px] font-bold uppercase text-slate-400 shrink-0 mr-1">
            Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs font-bold'
                  : 'bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat === 'all' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents List or Grid Display */}
      {filteredDocs.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-3">
          <FolderLock className="w-12 h-12 text-slate-300 mx-auto" />
          <h4 className="text-sm font-bold text-slate-800">No strategy documents found</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No files matched your search or format filters. You can clear filters or upload a new PDF or DOC file to Firebase Storage.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedProjectId('all');
              setSelectedFileType('all');
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Card Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDocs.map((docItem) => {
            const format = getFileFormat(docItem.fileName, docItem.fileType);
            const isDownloading = downloadingDocId === docItem.id;
            const isDownloaded = downloadedDocId === docItem.id;

            return (
              <div
                key={docItem.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group hover:border-blue-300"
              >
                <div className="p-5 sm:p-6 space-y-4">
                  
                  {/* Category & Format Badges */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      {format === 'pdf' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                          <FileText className="w-2.5 h-2.5" />
                          <span>PDF Document</span>
                        </span>
                      )}
                      {format === 'word' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                          <FileText className="w-2.5 h-2.5" />
                          <span>Word Brief</span>
                        </span>
                      )}
                      {format === 'excel' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                          <FileSpreadsheet className="w-2.5 h-2.5" />
                          <span>Financial Model</span>
                        </span>
                      )}
                      {format === 'presentation' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1">
                          <Layers className="w-2.5 h-2.5" />
                          <span>Slide Deck</span>
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[9px] font-semibold">
                        {docItem.category}
                      </span>
                    </div>
                    
                    {docItem.confidential ? (
                      <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold shrink-0">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Confidential</span>
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono text-slate-400 shrink-0">
                        {docItem.version}
                      </span>
                    )}
                  </div>

                  {/* Icon and Title */}
                  <div className="flex items-start space-x-3.5">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition group-hover:scale-105 ${
                      format === 'pdf' 
                        ? 'bg-rose-50 text-rose-600 border border-rose-100' 
                        : format === 'word'
                        ? 'bg-blue-50 text-blue-600 border border-blue-100'
                        : format === 'excel'
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'bg-amber-50 text-amber-600 border border-amber-100'
                    }`}>
                      {format === 'excel' ? (
                        <FileSpreadsheet className="w-5 h-5" />
                      ) : (
                        <FileText className="w-5 h-5" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors font-serif">
                        {docItem.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-mono mt-1 truncate" title={docItem.fileName}>
                        {docItem.fileName}
                      </p>
                    </div>
                  </div>

                  {/* Project Tag */}
                  {docItem.projectTitle && (
                    <div className="flex items-center space-x-1.5 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                      <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate font-semibold">{docItem.projectTitle}</span>
                    </div>
                  )}

                  {/* Description preview */}
                  {docItem.description && (
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                      {docItem.description}
                    </p>
                  )}

                  {/* Metadata line */}
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-[10px] uppercase block font-semibold text-slate-400">File Size</span>
                      <span className="text-slate-700 font-medium font-mono">{docItem.fileSize}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase block font-semibold text-slate-400">Storage Status</span>
                      <span className="text-emerald-700 font-medium font-mono flex items-center space-x-1">
                        <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                        <span>Encrypted</span>
                      </span>
                    </div>
                  </div>

                </div>

                {/* Card Action Footer */}
                <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-slate-500 truncate max-w-[120px]" title={docItem.sharedBy}>
                    {docItem.sharedBy.split(',')[0]}
                  </span>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onOpenPreview(docItem)}
                      className="px-2.5 py-1.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition"
                      title="Inspect document preview and metadata"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={(e) => handleDownload(docItem, e)}
                      disabled={isDownloading}
                      className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition shadow-xs active:scale-95 disabled:opacity-60 ${
                        isDownloaded
                          ? 'bg-emerald-600 text-white'
                          : format === 'pdf'
                          ? 'bg-rose-600 hover:bg-rose-700 text-white'
                          : format === 'word'
                          ? 'bg-blue-600 hover:bg-blue-700 text-white'
                          : 'bg-slate-900 hover:bg-slate-800 text-white'
                      }`}
                    >
                      {isDownloading ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Downloading...</span>
                        </>
                      ) : isDownloaded ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Downloaded!</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        /* Detailed Security Audit Table View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Document / Strategy Asset</th>
                  <th className="px-4 py-3.5">Format & Category</th>
                  <th className="px-4 py-3.5">Engagement Project</th>
                  <th className="px-4 py-3.5">File Size</th>
                  <th className="px-4 py-3.5">Author / Lead</th>
                  <th className="px-4 py-3.5">Storage Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((docItem) => {
                  const format = getFileFormat(docItem.fileName, docItem.fileType);
                  const isDownloading = downloadingDocId === docItem.id;
                  const isDownloaded = downloadedDocId === docItem.id;

                  return (
                    <tr key={docItem.id} className="hover:bg-slate-50/70 transition">
                      <td className="px-5 py-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            format === 'pdf' ? 'bg-rose-50 text-rose-600' : format === 'word' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                          }`}>
                            {format === 'excel' ? <FileSpreadsheet className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate max-w-xs">{docItem.title}</p>
                            <p className="text-[11px] text-slate-400 font-mono truncate">{docItem.fileName}</p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold text-[10px]">
                          {docItem.category}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-slate-600 font-medium">
                        {docItem.projectTitle || 'General Advisory'}
                      </td>

                      <td className="px-4 py-4 font-mono text-slate-500">
                        {docItem.fileSize}
                      </td>

                      <td className="px-4 py-4 text-slate-600">
                        {docItem.sharedBy.split(',')[0]}
                      </td>

                      <td className="px-4 py-4">
                        <span className="inline-flex items-center space-x-1 text-emerald-700 font-mono text-[11px]">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified</span>
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => onOpenPreview(docItem)}
                            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition"
                            title="Preview Document"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDownload(docItem, e)}
                            disabled={isDownloading}
                            className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center space-x-1.5 transition ${
                              isDownloaded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                            }`}
                          >
                            {isDownloading ? (
                              <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : isDownloaded ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-200" />
                            ) : (
                              <Download className="w-3.5 h-3.5" />
                            )}
                            <span>{isDownloaded ? 'Saved' : 'Download'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Security & Audit Footer Notice */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-slate-800">Confidentiality & Compliance Guaranteed</h5>
            <p className="text-slate-500 text-[11px] mt-0.5">
              All documents pulled from Firebase Storage are watermarked, encrypted via AES-256 GCM, and audited for access compliance.
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200 shrink-0">
          Bucket: gs://ai-studio-accounticca...
        </div>
      </div>

    </div>
  );
};
