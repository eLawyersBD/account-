import React, { useState } from 'react';
import { X, PlusCircle, Loader2, Sparkles, CheckCircle2, FileText } from 'lucide-react';
import { createArticleInFirestore } from '../lib/firebase';
import { ArticleItem } from '../types';

interface ArticleCmsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onArticlePublished: (newArticle: ArticleItem) => void;
}

export const ArticleCmsModal: React.FC<ArticleCmsModalProps> = ({
  isOpen,
  onClose,
  onArticlePublished,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'Article' | 'Template' | 'Guide'>('Article');
  const [author, setAuthor] = useState('Accounticca Advisory Team');
  const [readTime, setReadTime] = useState('5 min read');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !excerpt.trim() || !content.trim()) {
      setErrorMsg('Please fill out the Title, Excerpt, and Article Content.');
      return;
    }

    setIsPublishing(true);
    setErrorMsg(null);

    try {
      const published = await createArticleInFirestore({
        title,
        category,
        author,
        readTime,
        excerpt,
        content,
      });

      setSuccessMsg('Article published successfully to Firestore CMS!');
      onArticlePublished(published);

      setTimeout(() => {
        setSuccessMsg(null);
        setTitle('');
        setExcerpt('');
        setContent('');
        onClose();
      }, 1500);
    } catch (err) {
      console.error('Error publishing article to Firestore CMS:', err);
      setErrorMsg('Failed to publish article. Please check your connection and try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative overflow-hidden my-8 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100">
              <FileText className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Firestore CMS</span>
                </span>
              </div>
              <h3 className="text-xl font-bold font-serif text-slate-900">
                Publish New Knowledge Article
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 overflow-y-auto pr-1 flex-1">
          {errorMsg && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs font-medium flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Article Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Navigating Corporate Restructuring and Tax Governance in 2026"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as 'Article' | 'Template' | 'Guide')}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
              >
                <option value="Article">Article</option>
                <option value="Guide">Guide</option>
                <option value="Template">Template</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Author
              </label>
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Read Time
              </label>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Brief Excerpt *
            </label>
            <textarea
              required
              rows={2}
              placeholder="A concise summary of the key strategic insights covered in this publication..."
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Full Article Body / Content *
            </label>
            <textarea
              required
              rows={6}
              placeholder="Write the full executive guide or article content here. Paragraphs and line breaks will be preserved..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition font-sans"
            />
          </div>

          {/* Footer controls */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPublishing}
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20 flex items-center space-x-2"
            >
              {isPublishing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Publishing to Firestore...</span>
                </>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4 shrink-0" />
                  <span>Publish Article</span>
                </>
              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
