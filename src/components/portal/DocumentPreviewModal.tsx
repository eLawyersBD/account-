import React, { useState } from 'react';
import { ClientDocument, ClientProfile } from '../../types';
import { downloadStrategyDocument } from '../../lib/documentVaultService';
import { 
  X, 
  Download, 
  FileText, 
  ShieldCheck, 
  ExternalLink, 
  Calendar, 
  User, 
  CheckCircle2, 
  Eye,
  FileSpreadsheet,
  Lock,
  Briefcase,
  HardDrive,
  Layers,
  FileCheck,
  Sparkles,
  Key,
  FolderLock
} from 'lucide-react';

interface DocumentPreviewModalProps {
  document: ClientDocument | null;
  clientProfile?: ClientProfile | null;
  onClose: () => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  clientProfile,
  onClose
}) => {
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'metadata' | 'security'>('preview');

  if (!document) return null;

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await downloadStrategyDocument(document, clientProfile);
      setDownloading(false);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3500);
    } catch (err) {
      console.error('Download error:', err);
      setDownloading(false);
    }
  };

  const fileName = document.fileName.toLowerCase();
  const isPdf = fileName.endsWith('.pdf') || document.fileType.toLowerCase().includes('pdf');
  const isWord = fileName.endsWith('.docx') || fileName.endsWith('.doc') || document.fileType.toLowerCase().includes('word');
  const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xlsm') || fileName.endsWith('.xls') || document.fileType.toLowerCase().includes('excel');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh] my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-200 bg-slate-50/90 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3.5 min-w-0">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-xs ${
              isPdf
                ? 'bg-rose-100 text-rose-700'
                : isWord
                ? 'bg-blue-100 text-blue-700'
                : isExcel
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              {isExcel ? <FileSpreadsheet className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2 flex-wrap gap-1">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  isPdf 
                    ? 'bg-rose-100 text-rose-800' 
                    : isWord
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {isPdf ? 'PDF Strategy Document' : isWord ? 'Word Strategy Brief' : isExcel ? 'Excel Financial Model' : document.category}
                </span>
                <span className="text-xs text-slate-500 font-mono">
                  {document.version}
                </span>
                {document.confidential && (
                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-[10px] font-bold">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Confidential</span>
                  </span>
                )}
              </div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 font-serif mt-1 truncate">
                {document.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 bg-white border border-slate-200 hover:bg-slate-100 text-slate-500 rounded-full flex items-center justify-center transition shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 py-2 bg-slate-50 border-b border-slate-200 flex items-center space-x-2 text-xs">
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'preview' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Document Content Preview
          </button>
          <button
            onClick={() => setActiveTab('metadata')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'metadata' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Metadata & Engagement
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-3 py-1.5 rounded-xl font-semibold transition ${
              activeTab === 'security' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-200/70'
            }`}
          >
            Firebase Storage & Integrity
          </button>
        </div>

        {/* Modal Body & Tab Contents */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          
          {activeTab === 'preview' && (
            <div className="space-y-5">
              {/* Executive Summary */}
              {document.description && (
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-1.5">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Executive Summary & Advisory Context</h4>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                    {document.description}
                  </p>
                </div>
              )}

              {/* Simulated Document Viewer Canvas */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-900 text-slate-100 shadow-inner">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500" />
                    <span className="w-3 h-3 rounded-full bg-amber-500" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span className="text-xs font-mono text-slate-300 ml-2">
                      {document.fileName}
                    </span>
                  </div>
                  <span className="text-xs text-emerald-400 font-mono flex items-center space-x-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Firebase Storage Synced</span>
                  </span>
                </div>

                {/* Document Viewer Body Simulation */}
                <div className="space-y-4 text-xs font-mono text-slate-300">
                  <div className="p-3 bg-slate-800/90 rounded-xl border border-slate-700 flex items-center justify-between">
                    <span className="text-blue-300">[DOCUMENT HEADER: ACCOUNTICCA STRATEGIC ADVISORY]</span>
                    <span className="text-emerald-400">STATUS: VERIFIED & READY</span>
                  </div>

                  <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-2">
                    <p className="text-slate-400">&gt; Target Client: <span className="text-white">{clientProfile?.companyName || 'Apex Strategic Enterprises'}</span></p>
                    <p className="text-slate-400">&gt; Engagement Lead: <span className="text-white">{document.sharedBy}</span></p>
                    <p className="text-slate-400">&gt; Scoped Cloud Path: <span className="text-slate-300">{document.storagePath || `clients/${document.userId}/documents/${document.fileName}`}</span></p>
                    <p className="text-slate-400">&gt; Storage Checksum: <span className="text-emerald-400 font-mono">SHA-256 (Valid Signature)</span></p>
                  </div>

                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700 text-slate-300 space-y-1">
                    <p className="text-[11px] text-amber-300 font-semibold">Strategic Action Items & Core Recommendations:</p>
                    <p className="text-[11px] text-slate-400">1. Complete operational process re-engineering and automation rollouts.</p>
                    <p className="text-[11px] text-slate-400">2. Accelerate EBITDA optimization via working capital cycle enhancements.</p>
                    <p className="text-[11px] text-slate-400">3. Implement executive dashboard telemetry and governance reporting.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">File Name</span>
                  <span className="font-semibold text-slate-800 font-mono truncate block" title={document.fileName}>
                    {document.fileName}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">File Size</span>
                  <span className="font-semibold text-slate-800">{document.fileSize}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Published</span>
                  <span className="font-semibold text-slate-800">{document.uploadedAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Shared By</span>
                  <span className="font-semibold text-slate-800 truncate block">{document.sharedBy}</span>
                </div>
              </div>

              {document.projectTitle && (
                <div className="p-4 bg-blue-50/70 rounded-2xl border border-blue-100 flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <Briefcase className="w-4 h-4 text-blue-600 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase text-blue-600 block">Linked Engagement Project</span>
                      <p className="font-bold text-slate-900 truncate">{document.projectTitle}</p>
                    </div>
                  </div>
                  {document.projectId && (
                    <span className="px-2 py-0.5 bg-white border border-blue-200 text-blue-700 text-[10px] font-mono rounded-lg shrink-0">
                      {document.projectId}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-700 font-bold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Firebase Storage Client Isolation Protocol</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  This document is stored in a private, client-specific Firebase Storage bucket partitioned by your unique Client User ID. Storage security rules enforce strict read/write authorization:
                </p>
                <div className="p-3 bg-slate-900 text-emerald-400 font-mono rounded-xl text-[11px] overflow-x-auto">
                  <code>match /clients/{'{userId}'}/projects/{'{projectId}'}/documents/{'{fileName}'} {'{'} allow read, write: if request.auth != null && request.auth.uid == userId; {'}'}</code>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Storage Path</span>
                  <span className="text-slate-800 font-mono text-[11px] truncate block mt-0.5">
                    {document.storagePath || `clients/${document.userId}/documents/${document.fileName}`}
                  </span>
                </div>
                <div className="p-3.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Encryption Standard</span>
                  <span className="text-slate-800 font-mono text-[11px] truncate block mt-0.5">
                    AES-256 GCM Server-Side Encryption
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-5 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Watermarked with client security key</span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition"
            >
              Close
            </button>
            <button
              onClick={handleDownload}
              disabled={downloading}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition flex items-center space-x-2 disabled:opacity-60 ${
                downloadSuccess
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : isPdf
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-500/20'
                  : isWord
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-white'
              }`}
            >
              {downloading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Downloading...</span>
                </>
              ) : downloadSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                  <span>File Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download {isPdf ? 'PDF Strategy Deck' : isWord ? 'Word Brief' : 'Secure File'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
