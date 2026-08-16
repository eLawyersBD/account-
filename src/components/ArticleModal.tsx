import React, { useState, useMemo } from 'react';
import { ArticleItem } from '../types';
import { SocialShareBar } from './SocialShareBar';
import { X, Calendar, User, ArrowRight, Share2, Clock, FileText } from 'lucide-react';

interface ArticleModalProps {
  article: ArticleItem;
  onClose: () => void;
  onOpenConsultation: () => void;
}

export const ArticleModal: React.FC<ArticleModalProps> = ({ article, onClose, onOpenConsultation }) => {
  const [scrollProgress, setScrollProgress] = useState(0);

  // Dynamic Word Count & Reading Time Estimation (~200 wpm)
  const { wordCount, estimatedMinutes } = useMemo(() => {
    if (!article.content) return { wordCount: 0, estimatedMinutes: 1 };
    const words = article.content.trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return { wordCount: words, estimatedMinutes: mins };
  }, [article.content]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const totalScroll = scrollHeight - clientHeight;
    if (totalScroll > 0) {
      const progress = Math.min(100, Math.max(0, (scrollTop / totalScroll) * 100));
      setScrollProgress(progress);
    } else {
      setScrollProgress(100);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div 
        onScroll={handleScroll}
        className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-10 shadow-2xl relative space-y-6 text-slate-900"
      >
        {/* Top Reading Progress Bar */}
        <div className="sticky top-0 -mt-6 sm:-mt-10 -mx-6 sm:-mx-10 z-30 bg-slate-100 h-1.5 w-full overflow-hidden rounded-t-2xl">
          <div
            className="h-full bg-blue-600 transition-all duration-100 ease-out"
            style={{ width: `${Math.max(2, scrollProgress)}%` }}
          />
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition z-40"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="space-y-4 border-b border-slate-200 pb-6 pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="bg-blue-50 text-blue-600 font-semibold px-3 py-1 rounded-full uppercase">
              {article.category}
            </span>
            <span className="text-slate-500 flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{article.date}</span>
            </span>

            {/* Visual Read Time Estimator Pill */}
            <span className="inline-flex items-center space-x-1.5 bg-slate-100 text-slate-700 font-medium px-2.5 py-1 rounded-full">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span>{estimatedMinutes} min read</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-500 text-[11px]">{wordCount} words</span>
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 leading-tight">
            {article.title}
          </h2>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-blue-600" />
              <span>Written by <strong className="text-slate-800">{article.author}</strong></span>
            </div>
            <div className="text-[11px] text-slate-400 flex items-center space-x-1">
              <FileText className="w-3 h-3" />
              <span>Scroll progress: {Math.round(scrollProgress)}%</span>
            </div>
          </div>
        </div>

        <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
          {article.content}
        </div>

        {/* Social Sharing Bar for Article */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
            <Share2 className="w-4 h-4 text-blue-600" />
            <span>Share Article with Professional Network</span>
          </div>
          <SocialShareBar
            title={article.title}
            subtitle={article.excerpt}
            type="article"
            compact
          />
        </div>

        <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0">
          <div className="text-xs text-slate-500">
            Need personalized advisory on this topic? Talk to our experts.
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition shadow-lg shadow-blue-500/20 flex items-center space-x-2"
          >
            <span>Consult an Accounticca Expert</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};

