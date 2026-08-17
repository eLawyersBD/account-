import React, { useState, useRef, useEffect } from 'react';
import { ClientDocument, DocumentCategory, ClientProject } from '../../types';
import { uploadProjectDocumentWithStorage } from '../../lib/portalService';
import { 
  X, 
  UploadCloud, 
  FileText, 
  FileSpreadsheet, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Lock,
  Briefcase,
  Layers,
  Database,
  ExternalLink,
  RefreshCw,
  HardDrive,
  FileCode,
  FileCheck
} from 'lucide-react';

interface UploadDocumentModalProps {
  userId: string;
  projects?: ClientProject[];
  initialProjectId?: string;
  initialProjectTitle?: string;
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: (newDoc: ClientDocument) => void;
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  userId,
  projects = [],
  initialProjectId,
  initialProjectTitle,
  isOpen,
  onClose,
  onUploadSuccess
}) => {
  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    initialProjectId || projects[0]?.id || 'proj_01'
  );
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<DocumentCategory>('Deliverable');
  const [file, setFile] = useState<File | null>(null);
  const [version, setVersion] = useState('v1.0 (Client Upload)');
  const [description, setDescription] = useState('');
  const [confidential, setConfidential] = useState(true);
  
  // Upload lifecycle state
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bytesTransferred, setBytesTransferred] = useState(0);
  const [totalBytes, setTotalBytes] = useState(0);
  const [uploadStage, setUploadStage] = useState<'idle' | 'uploading' | 'syncing' | 'success'>('idle');
  const [uploadedDocResult, setUploadedDocResult] = useState<ClientDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync initial project ID when modal opens or initialProjectId changes
  useEffect(() => {
    if (initialProjectId) {
      setSelectedProjectId(initialProjectId);
    } else if (projects.length > 0) {
      setSelectedProjectId(projects[0].id);
    }
  }, [initialProjectId, projects, isOpen]);

  // Reset form when modal closes or opens fresh
  useEffect(() => {
    if (isOpen) {
      setUploadStage('idle');
      setUploadedDocResult(null);
      setError(null);
      setUploadProgress(0);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentSelectedProject = projects.find(p => p.id === selectedProjectId) || {
    id: selectedProjectId,
    title: initialProjectTitle || 'Strategic Advisory Engagement'
  };

  const handleFileChange = (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    if (!title) {
      // Clean up filename for default title
      const cleanTitle = selectedFile.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, l => l.toUpperCase());
      setTitle(cleanTitle);
    }

    // Auto-detect recommended category based on file type
    const lowerName = selectedFile.name.toLowerCase();
    if (lowerName.includes('financial') || lowerName.includes('model') || lowerName.endsWith('.xlsx') || lowerName.endsWith('.xlsm')) {
      setCategory('Financial Model');
    } else if (lowerName.includes('deck') || lowerName.includes('strategy') || lowerName.endsWith('.pptx')) {
      setCategory('Strategy Deck');
    } else if (lowerName.includes('audit') || lowerName.includes('report')) {
      setCategory('Audit Report');
    } else if (lowerName.includes('sop') || lowerName.includes('playbook')) {
      setCategory('SOP Playbook');
    } else if (lowerName.includes('contract') || lowerName.includes('nda') || lowerName.includes('agreement')) {
      setCategory('Contract / NDA');
    } else if (lowerName.includes('tax') || lowerName.includes('filing')) {
      setCategory('Tax Document');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a document title.');
      return;
    }

    setError(null);
    setUploading(true);
    setUploadStage('uploading');
    setUploadProgress(10);

    try {
      const createdDoc = await uploadProjectDocumentWithStorage({
        file,
        userId,
        projectId: selectedProjectId,
        projectTitle: currentSelectedProject.title,
        title: title.trim(),
        category,
        version: version.trim() || 'v1.0 (Client Upload)',
        confidential,
        sharedBy: 'Client Executive Team',
        description: description.trim() || `Uploaded directly to project "${currentSelectedProject.title}" in Firebase Storage.`,
        onProgress: (progress, transferred, total) => {
          setUploadProgress(progress);
          setBytesTransferred(transferred);
          setTotalBytes(total);
          if (progress >= 95) {
            setUploadStage('syncing');
          }
        }
      });

      setUploadStage('success');
      setUploadedDocResult(createdDoc);
      if (onUploadSuccess) {
        onUploadSuccess(createdDoc);
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      setError(err.message || 'Failed to upload document to Firebase Storage.');
      setUploadStage('idle');
    } finally {
      setUploading(false);
    }
  };

  const formatBytes = (bytes: number) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const isExcel = file?.name.endsWith('.xlsx') || file?.name.endsWith('.xlsm') || file?.name.endsWith('.xls');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden relative my-auto">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-2xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center text-blue-400 shadow-md">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-bold font-serif">Upload Project Document</h3>
                <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[10px] font-mono uppercase font-bold">
                  Firebase Storage
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Encrypted direct stream to secure project repository bucket
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={uploading}
            className="w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition disabled:opacity-50"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Success View */}
        {uploadStage === 'success' && uploadedDocResult ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider">
                Upload & Encryption Complete
              </span>
              <h4 className="text-xl font-bold font-serif text-slate-900">
                Document Securely Linked
              </h4>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                <strong className="text-slate-800">{uploadedDocResult.title}</strong> has been uploaded to Firebase Storage and registered in the active deliverables of <strong className="text-slate-800">{uploadedDocResult.projectTitle}</strong>.
              </p>
            </div>

            {/* Document Details Card */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left text-xs space-y-2 font-mono">
              <div className="flex items-center justify-between text-slate-500">
                <span>File Name:</span>
                <span className="font-bold text-slate-800 truncate max-w-[240px]">{uploadedDocResult.fileName}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Storage Path:</span>
                <span className="text-blue-600 truncate max-w-[240px]" title={uploadedDocResult.storagePath}>
                  {uploadedDocResult.storagePath || 'Cloud Storage Bucket'}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>Linked Project ID:</span>
                <span className="font-bold text-slate-700">{uploadedDocResult.projectId}</span>
              </div>
              <div className="flex items-center justify-between text-slate-500">
                <span>File Size / Date:</span>
                <span>{uploadedDocResult.fileSize} • {uploadedDocResult.uploadedAt}</span>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-center space-x-3">
              <button
                onClick={() => {
                  setFile(null);
                  setTitle('');
                  setDescription('');
                  setUploadStage('idle');
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition"
              >
                Upload Another Document
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition"
              >
                Done & View in Vault
              </button>
            </div>
          </div>
        ) : (
          /* Form Content */
          <form onSubmit={handleFormSubmit} className="p-6 space-y-5 text-xs">
            
            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-2xl text-red-700 flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Target Project Selection */}
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/90 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700 flex items-center space-x-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                  <span>Target Project Association</span>
                </label>
                <span className="text-[10px] font-mono text-slate-400 bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  ID: {selectedProjectId}
                </span>
              </div>

              {projects.length > 0 ? (
                <select
                  value={selectedProjectId}
                  onChange={(e) => setSelectedProjectId(e.target.value)}
                  disabled={uploading}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {projects.map((proj) => (
                    <option key={proj.id} value={proj.id}>
                      {proj.title} ({proj.serviceType})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-xs font-semibold text-slate-800 bg-white p-2 rounded-xl border border-slate-200">
                  {currentSelectedProject.title}
                </p>
              )}
            </div>

            {/* Drag & Drop File Zone */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Select File for Firebase Storage
              </label>

              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 relative ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/70 scale-[1.01]'
                    : file
                    ? 'border-emerald-400 bg-emerald-50/30'
                    : 'border-slate-300 hover:border-blue-400 bg-slate-50/60 hover:bg-slate-50'
                }`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
                  disabled={uploading}
                  className="hidden"
                  accept=".pdf,.xlsx,.xls,.xlsm,.doc,.docx,.pptx,.ppt,.csv,.zip"
                />

                {file ? (
                  <div className="flex items-center justify-between bg-white p-3.5 rounded-xl border border-emerald-200 shadow-2xs">
                    <div className="flex items-center space-x-3 text-left min-w-0">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        isExcel ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {isExcel ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-slate-900 truncate" title={file.name}>
                          {file.name}
                        </p>
                        <p className="text-[11px] text-slate-400 font-mono">
                          {formatBytes(file.size)} • {file.type || 'Document'}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFile(null);
                      }}
                      disabled={uploading}
                      className="px-2.5 py-1 text-[11px] font-semibold text-rose-600 hover:bg-rose-50 rounded-lg transition"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-2xs">
                      <UploadCloud className="w-6 h-6" />
                    </div>
                    <p className="font-bold text-slate-700 text-xs">
                      Click to browse or drag & drop project file
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">
                      PDF, Excel (.xlsx, .xlsm), Word (.docx), PowerPoint (.pptx), CSV (up to 50MB)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Document Title */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Document Display Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                disabled={uploading}
                placeholder="e.g. Q3 Financial Variance Model v2"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Category & Version */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                  disabled={uploading}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Deliverable">Deliverable</option>
                  <option value="Financial Model">Financial Model</option>
                  <option value="Strategy Deck">Strategy Deck</option>
                  <option value="Audit Report">Audit Report</option>
                  <option value="SOP Playbook">SOP Playbook</option>
                  <option value="Contract / NDA">Contract / NDA</option>
                  <option value="Tax Document">Tax Document</option>
                  <option value="Operational Brief">Operational Brief</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Version Identifier</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  disabled={uploading}
                  placeholder="e.g. v1.0 (Client Upload)"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Confidentiality & Security Flag */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confidential}
                  onChange={(e) => setConfidential(e.target.checked)}
                  disabled={uploading}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div>
                  <span className="font-bold text-slate-800 flex items-center space-x-1">
                    <Lock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Confidential Strategic Document</span>
                  </span>
                  <span className="text-[10px] text-slate-400 block">
                    Restricted access to authorized senior partners & client executive team
                  </span>
                </div>
              </label>
            </div>

            {/* Notes / Instructions */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Advisory Notes & Instructions for Lead Partner (Optional)
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
                placeholder="Specify data source, key variance assumptions, or questions for Sarah Jenkins..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-xs"
              />
            </div>

            {/* Live Progress Bar (when uploading) */}
            {uploading && (
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-2xl space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs font-bold text-blue-900">
                  <div className="flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                    <span>
                      {uploadStage === 'syncing' 
                        ? 'Registering Document in Project Repository...' 
                        : 'Streaming file to Firebase Storage...'}
                    </span>
                  </div>
                  <span className="font-mono">{uploadProgress}%</span>
                </div>

                <div className="w-full h-2.5 bg-blue-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>

                {totalBytes > 0 && (
                  <div className="flex justify-between text-[10px] text-blue-700 font-mono">
                    <span>{formatBytes(bytesTransferred)} transferred</span>
                    <span>Total: {formatBytes(totalBytes)}</span>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted Storage Bucket</span>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={uploading}
                  className="px-4 py-2 font-semibold text-slate-600 hover:text-slate-900 transition disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md shadow-blue-500/20 transition flex items-center space-x-2 disabled:opacity-50 active:scale-98"
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <UploadCloud className="w-4 h-4" />
                      <span>Upload to Firebase Storage</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
