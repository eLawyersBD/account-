import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Search, X, Briefcase, BookOpen, HelpCircle, Package, Award, ArrowRight, Sparkles, Filter, CornerDownLeft } from 'lucide-react';
import { SERVICES_DATA, ARTICLES_DATA, FAQ_DATA, PACKAGES_DATA, CASE_STUDIES } from '../data/consultancyData';
import { ArticleItem, ServiceItem, PackageItem, FaqItem, CaseStudyItem } from '../types';

export type SearchCategory = 'all' | 'services' | 'articles' | 'faqs' | 'packages' | 'cases';

export interface SearchResultItem {
  id: string;
  type: 'service' | 'article' | 'faq' | 'package' | 'case';
  title: string;
  subtitle?: string;
  description: string;
  category?: string;
  rawItem: ServiceItem | ArticleItem | FaqItem | PackageItem | CaseStudyItem | any;
  faqIndex?: number;
}

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectService: (serviceTitle: string) => void;
  onSelectArticle: (article: ArticleItem) => void;
  onSelectFaq: (faqIndex: number) => void;
  onSelectPackage: (packageName: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectService,
  onSelectArticle,
  onSelectFaq,
  onSelectPackage,
}) => {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  // Auto-focus search input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    } else {
      setQuery('');
      setActiveCategory('all');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Build unified search index
  const allItems = useMemo<SearchResultItem[]>(() => {
    const items: SearchResultItem[] = [];

    // Services
    SERVICES_DATA.forEach((s) => {
      items.push({
        id: `service-${s.id}`,
        type: 'service',
        title: s.title,
        subtitle: s.tagline,
        description: `${s.description} ${s.features.join(' ')} ${s.idealFor}`,
        category: 'Services',
        rawItem: s,
      });
    });

    // Articles / Knowledge Center
    ARTICLES_DATA.forEach((a) => {
      items.push({
        id: `article-${a.id}`,
        type: 'article',
        title: a.title,
        subtitle: `${a.category} • ${a.readTime} read • By ${a.author}`,
        description: a.excerpt,
        category: 'Knowledge Center',
        rawItem: a,
      });
    });

    // FAQs
    FAQ_DATA.forEach((f, idx) => {
      items.push({
        id: `faq-${idx}`,
        type: 'faq',
        title: f.question,
        subtitle: 'Frequently Asked Question',
        description: f.answer,
        category: 'FAQs',
        rawItem: f,
        faqIndex: idx,
      });
    });

    // Packages
    PACKAGES_DATA.forEach((p) => {
      items.push({
        id: `package-${p.id}`,
        type: 'package',
        title: p.name,
        subtitle: `Ideal for: ${p.targetAudience}`,
        description: `${p.description} ${p.features.join(' ')}`,
        category: 'Packages',
        rawItem: p,
      });
    });

    // Case Studies
    CASE_STUDIES.forEach((c) => {
      items.push({
        id: `case-${c.id}`,
        type: 'case',
        title: `Case Study: ${c.clientType}`,
        subtitle: `Challenge & Solution Overview`,
        description: `${c.challenge} ${c.solution} ${c.results.join(' ')}`,
        category: 'Case Studies',
        rawItem: c,
      });
    });

    return items;
  }, []);

  // Filter items based on query & category
  const filteredResults = useMemo(() => {
    const trimmed = query.trim().toLowerCase();

    return allItems.filter((item) => {
      // Category filter
      if (activeCategory === 'services' && item.type !== 'service') return false;
      if (activeCategory === 'articles' && item.type !== 'article') return false;
      if (activeCategory === 'faqs' && item.type !== 'faq') return false;
      if (activeCategory === 'packages' && item.type !== 'package') return false;
      if (activeCategory === 'cases' && item.type !== 'case') return false;

      if (!trimmed) return true;

      // Query matching
      const titleMatch = item.title.toLowerCase().includes(trimmed);
      const subtitleMatch = item.subtitle?.toLowerCase().includes(trimmed);
      const descMatch = item.description.toLowerCase().includes(trimmed);

      return titleMatch || subtitleMatch || descMatch;
    });
  }, [allItems, query, activeCategory]);

  // Category Counts
  const categoryCounts = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    const baseList = trimmed
      ? allItems.filter((item) => {
          return (
            item.title.toLowerCase().includes(trimmed) ||
            item.subtitle?.toLowerCase().includes(trimmed) ||
            item.description.toLowerCase().includes(trimmed)
          );
        })
      : allItems;

    return {
      all: baseList.length,
      services: baseList.filter((i) => i.type === 'service').length,
      articles: baseList.filter((i) => i.type === 'article').length,
      faqs: baseList.filter((i) => i.type === 'faq').length,
      packages: baseList.filter((i) => i.type === 'package').length,
      cases: baseList.filter((i) => i.type === 'case').length,
    };
  }, [allItems, query]);

  // Reset keyboard selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeCategory]);

  // Select item action handler
  const handleSelectItem = (item: SearchResultItem) => {
    onClose();
    if (item.type === 'service') {
      onSelectService(item.title);
    } else if (item.type === 'article') {
      onSelectArticle(item.rawItem as ArticleItem);
    } else if (item.type === 'faq' && item.faqIndex !== undefined) {
      onSelectFaq(item.faqIndex);
      const el = document.getElementById('faq');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (item.type === 'package') {
      onSelectPackage(item.title);
    } else if (item.type === 'case') {
      const el = document.getElementById('cases');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Keyboard navigation inside search list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < filteredResults.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredResults[selectedIndex]) {
        handleSelectItem(filteredResults[selectedIndex]);
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  const popularTags = [
    'Startup Setup',
    'Financial Planning',
    'Bookkeeping',
    'Management Accounts',
    'SOP Optimization',
    'E-Lawyers',
    'Virtual CFO',
    'Tax Strategy',
  ];

  const getTypeBadge = (type: SearchResultItem['type']) => {
    switch (type) {
      case 'service':
        return { label: 'Service', bg: 'bg-blue-50 text-blue-700 border-blue-200', icon: Briefcase };
      case 'article':
        return { label: 'Article', bg: 'bg-purple-50 text-purple-700 border-purple-200', icon: BookOpen };
      case 'faq':
        return { label: 'FAQ', bg: 'bg-amber-50 text-amber-700 border-amber-200', icon: HelpCircle };
      case 'package':
        return { label: 'Package', bg: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Package };
      case 'case':
        return { label: 'Case Study', bg: 'bg-indigo-50 text-indigo-700 border-indigo-200', icon: Award };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 sm:pt-20 px-4 bg-slate-950/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col max-h-[85vh] animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 border-b border-slate-200/90 flex items-center space-x-3 bg-slate-50/80">
          <Search className="w-5 h-5 text-blue-600 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search services, articles, FAQs, packages..."
            className="w-full bg-transparent text-slate-900 text-base sm:text-lg font-medium placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/70 transition"
              aria-label="Clear search input"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="hidden sm:flex text-xs font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition shadow-2xs"
          >
            Esc
          </button>
        </div>

        {/* Category Filter Tabs */}
        <div className="px-4 py-2.5 border-b border-slate-200/80 bg-white flex items-center space-x-1.5 overflow-x-auto no-scrollbar text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1" />
          {[
            { id: 'all', label: 'All Results', count: categoryCounts.all },
            { id: 'services', label: 'Services', count: categoryCounts.services },
            { id: 'articles', label: 'Articles', count: categoryCounts.articles },
            { id: 'faqs', label: 'FAQs', count: categoryCounts.faqs },
            { id: 'packages', label: 'Packages', count: categoryCounts.packages },
            { id: 'cases', label: 'Case Studies', count: categoryCounts.cases },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as SearchCategory)}
              className={`px-3 py-1.5 rounded-full font-medium whitespace-nowrap transition-all flex items-center space-x-1.5 ${
                activeCategory === cat.id
                  ? 'bg-blue-600 text-white font-semibold shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`px-1.5 py-0.2 text-[10px] rounded-full font-mono ${
                  activeCategory === cat.id ? 'bg-blue-700 text-white' : 'bg-slate-200/80 text-slate-600'
                }`}
              >
                {cat.count}
              </span>
            </button>
          ))}
        </div>

        {/* Search Results Area */}
        <div ref={resultsContainerRef} className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredResults.length > 0 ? (
            filteredResults.map((item, idx) => {
              const badge = getTypeBadge(item.type);
              const BadgeIcon = badge.icon;
              const isSelected = selectedIndex === idx;

              return (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`p-4 rounded-2xl border transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/80 border-blue-400 shadow-xs ring-1 ring-blue-400/30'
                      : 'bg-white border-slate-200/80 hover:border-blue-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center space-x-2">
                      <span
                        className={`inline-flex items-center space-x-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${badge.bg}`}
                      >
                        <BadgeIcon className="w-3 h-3" />
                        <span>{badge.label}</span>
                      </span>
                      {item.subtitle && (
                        <span className="text-xs text-slate-400 truncate">{item.subtitle}</span>
                      )}
                    </div>

                    <h4 className="text-sm sm:text-base font-serif font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center justify-end sm:justify-start space-x-2 pt-1 sm:pt-0">
                    <span className="text-xs font-semibold text-blue-600 flex items-center space-x-1 bg-white border border-slate-200 px-3 py-1.5 rounded-full shadow-2xs group-hover:bg-blue-600 group-hover:text-white transition">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })
          ) : query ? (
            <div className="text-center py-12 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <h4 className="text-base font-serif font-bold text-slate-800">No matches found for "{query}"</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try searching with broader terms like <strong className="text-slate-700">Audit</strong>, <strong className="text-slate-700">Financial</strong>, or <strong className="text-slate-700">Startup</strong>.
              </p>
            </div>
          ) : (
            <div className="py-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
                  Popular Topics & Keywords
                </span>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(tag)}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 border border-slate-200/80 rounded-xl text-xs font-medium transition flex items-center space-x-1.5"
                    >
                      <Sparkles className="w-3 h-3 text-blue-500" />
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 text-xs text-slate-600 flex items-center justify-between">
                <span className="flex items-center space-x-2">
                  <CornerDownLeft className="w-4 h-4 text-blue-600" />
                  <span>Use <strong>Up / Down arrows</strong> to navigate and <strong>Enter</strong> to open any result.</span>
                </span>
                <span className="hidden sm:inline font-mono text-[10px] text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded">
                  Ctrl + K
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-100/90 border-t border-slate-200 text-xs text-slate-500 flex items-center justify-between px-6">
          <span className="text-[11px]">Accounticca Global Real-time Search</span>
          <span className="text-[11px] font-semibold text-slate-600">
            {filteredResults.length} {filteredResults.length === 1 ? 'result' : 'results'} available
          </span>
        </div>
      </div>
    </div>
  );
};
