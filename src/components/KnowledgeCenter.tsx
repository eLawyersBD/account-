import React, { useState, useEffect } from 'react';
import { ARTICLES_DATA, FREE_RESOURCES } from '../data/consultancyData';
import { COURSES_DATA } from '../data/coursesData';
import { ArticleItem, CourseItem } from '../types';
import { AnimatedSection } from './AnimatedSection';
import { SocialShareBar } from './SocialShareBar';
import { ArticleCmsModal } from './ArticleCmsModal';
import { getArticlesFromFirestore } from '../lib/firebase';
import { BookOpen, FileText, Download, ArrowRight, Sparkles, CheckCircle2, GraduationCap, Award, Share2, Users, Star, PlusCircle, Database, Loader2 } from 'lucide-react';

interface KnowledgeCenterProps {
  onOpenArticle: (article: ArticleItem) => void;
  onOpenCourse?: (course: CourseItem) => void;
  onOpenHealthAssessment: () => void;
}

export const KnowledgeCenter: React.FC<KnowledgeCenterProps> = ({
  onOpenArticle,
  onOpenCourse,
  onOpenHealthAssessment,
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [articles, setArticles] = useState<ArticleItem[]>(ARTICLES_DATA);
  const [loadingArticles, setLoadingArticles] = useState<boolean>(true);
  const [isCmsOpen, setIsCmsOpen] = useState<boolean>(false);
  const [blogCategory, setBlogCategory] = useState<string>('All');
  const [blogSearch, setBlogSearch] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    async function loadFirestoreArticles() {
      try {
        const firestoreArticles = await getArticlesFromFirestore();
        if (isMounted && firestoreArticles.length > 0) {
          // Merge firestore articles with static fallback data avoiding duplicate IDs
          const existingIds = new Set(firestoreArticles.map(a => a.id));
          const remainingStatic = ARTICLES_DATA.filter(a => !existingIds.has(a.id));
          setArticles([...firestoreArticles, ...remainingStatic]);
        }
      } catch (err) {
        console.warn('Failed loading Firestore articles:', err);
      } finally {
        if (isMounted) setLoadingArticles(false);
      }
    }
    loadFirestoreArticles();
    return () => { isMounted = false; };
  }, []);

  const handleArticlePublished = (newArticle: ArticleItem) => {
    setArticles(prev => [newArticle, ...prev]);
  };

  const filteredArticles = articles.filter((art) => {
    const matchesCategory = blogCategory === 'All' || art.category.toLowerCase() === blogCategory.toLowerCase();
    const matchesSearch = !blogSearch.trim() || 
      art.title.toLowerCase().includes(blogSearch.toLowerCase()) || 
      art.excerpt.toLowerCase().includes(blogSearch.toLowerCase()) || 
      art.author.toLowerCase().includes(blogSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDownloadResource = (resourceTitle: string) => {
    if (resourceTitle.includes('Assessment')) {
      onOpenHealthAssessment();
      return;
    }
    setDownloadSuccess(resourceTitle);
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  return (
    <section id="resources" className="py-24 bg-white text-slate-900 relative border-b border-slate-200 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <AnimatedSection animation="fade-up" className="text-center max-w-3xl mx-auto space-y-4 mb-16 sm:mb-20">
          <div className="inline-flex items-center space-x-2 bg-blue-50/90 border border-blue-200/90 px-4 py-1.5 rounded-full text-blue-700 text-xs font-bold tracking-widest uppercase shadow-2xs">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0" />
            <span>Business Resources & Academy</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-serif text-slate-900 tracking-tight leading-tight">
            Knowledge Center & Executive Education
          </h2>
          <p className="text-slate-600 text-base sm:text-lg font-normal leading-relaxed max-w-2xl mx-auto">
            Masterclass courses, verified certifications, expert articles, and downloadable executive frameworks designed for ambitious corporate leaders.
          </p>
        </AnimatedSection>

        {/* Notification Toast for Resource Download */}
        {downloadSuccess && (
          <div className="mb-8 max-w-xl mx-auto bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl flex items-center space-x-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-sm font-medium">Successfully prepared download for: <strong>{downloadSuccess}</strong>. Your file will download momentarily.</span>
          </div>
        )}

        {/* Executive Masterclass Courses Section */}
        <div className="mb-20">
          <AnimatedSection animation="fade-up" className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-2">
            <div>
              <span className="text-xs text-blue-600 font-bold uppercase tracking-widest flex items-center space-x-1.5">
                <GraduationCap className="w-4 h-4" />
                <span>Accounticca Executive Academy</span>
              </span>
              <h3 className="text-2xl font-serif font-bold text-slate-900 mt-1">
                Certifications & Executive Courses
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-md">
              Earn shareable digital credentials to feature on your LinkedIn profile or Facebook page upon course completion.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COURSES_DATA.map((course, idx) => (
              <AnimatedSection
                key={course.id}
                animation="fade-up"
                delay={idx * 120}
                duration={600}
              >
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 hover:border-blue-500/50 transition shadow-xl flex flex-col justify-between group h-full text-slate-100 relative overflow-hidden">
                  
                  {/* Accent Top Bar */}
                  <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-amber-400" />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-xs">
                      <span className="bg-blue-600/20 text-blue-300 border border-blue-500/30 font-bold px-2.5 py-1 rounded-full uppercase">
                        {course.level} Masterclass
                      </span>
                      <span className="text-amber-400 font-bold flex items-center space-x-1">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{course.rating} Rating</span>
                      </span>
                    </div>

                    <h4
                      onClick={() => onOpenCourse?.(course)}
                      className="text-xl font-serif font-bold text-white group-hover:text-blue-400 transition cursor-pointer"
                    >
                      {course.title}
                    </h4>

                    <p className="text-slate-300 text-xs leading-relaxed line-clamp-2">
                      {course.subtitle}
                    </p>

                    {/* Course Quick Stats */}
                    <div className="flex items-center space-x-4 text-xs text-slate-400 pt-1">
                      <span>⏱️ {course.duration}</span>
                      <span>📖 {course.modulesCount} Modules</span>
                      <span className="text-emerald-400 font-medium">👥 {course.enrolledStudents.toLocaleString()} Enrolled</span>
                    </div>

                    {/* Social Media Share Preview Strip */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2">
                        <span className="flex items-center space-x-1 font-semibold text-slate-300">
                          <Share2 className="w-3.5 h-3.5 text-blue-400" />
                          <span>Share Enrollment or Certification:</span>
                        </span>
                        <span className="text-blue-400 font-bold">LinkedIn / Facebook</span>
                      </div>
                      <SocialShareBar
                        title={course.title}
                        subtitle={course.subtitle}
                        badgeTitle={course.certificationTitle}
                        type="course"
                        compact
                      />
                    </div>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-800 flex items-center justify-between">
                    <div className="flex items-center space-x-1.5 text-xs text-amber-400 font-semibold">
                      <Award className="w-4 h-4" />
                      <span className="truncate max-w-[160px] sm:max-w-xs">{course.badge}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => onOpenCourse?.(course)}
                      className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition shadow-md shadow-blue-600/20 flex items-center space-x-1.5"
                    >
                      <span>View Course Page</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

        {/* Articles & Blog Page Section */}
        <div id="blog" className="mb-20 scroll-mt-24">
          <AnimatedSection animation="fade-up" className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4 bg-slate-50 p-6 rounded-3xl border border-slate-200/80">
            <div>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs text-blue-600 font-bold uppercase tracking-widest flex items-center space-x-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-600" />
                  <span>Accounticca Executive Blog</span>
                </span>
                {loadingArticles && <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />}
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-slate-900 flex items-center space-x-3">
                <BookOpen className="w-7 h-7 text-blue-600 shrink-0" />
                <span>Executive Blog & Advisory Insights</span>
              </h3>
              <p className="text-slate-500 text-xs mt-1">
                In-depth governance analyses, financial strategy breakdowns, and leadership articles.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Category Pills */}
              <div className="flex items-center space-x-1 bg-white p-1 rounded-full border border-slate-200 text-xs shadow-2xs">
                {['All', 'Article', 'Guide', 'Template'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setBlogCategory(cat)}
                    className={`px-3 py-1.5 rounded-full font-semibold transition ${
                      blogCategory === cat
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {cat}s
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsCmsOpen(true)}
                className="px-4 py-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center space-x-2 shadow-md shadow-blue-500/20"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Blog Article</span>
              </button>
            </div>
          </AnimatedSection>

          {/* Search Bar for Blog Articles */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Search blog articles by keyword, title, topic or author..."
              value={blogSearch}
              onChange={(e) => setBlogSearch(e.target.value)}
              className="w-full max-w-md px-4 py-2.5 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition shadow-2xs"
            />
          </div>

          {filteredArticles.length === 0 ? (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <p className="text-sm text-slate-500 font-medium">No blog articles match your search criteria.</p>
              <button
                onClick={() => { setBlogCategory('All'); setBlogSearch(''); }}
                className="mt-3 text-xs font-bold text-blue-600 hover:underline"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredArticles.map((article, idx) => (
                <AnimatedSection
                  key={article.id}
                  animation="fade-up"
                  delay={idx * 100}
                  duration={600}
                >
                  <div
                    onClick={() => onOpenArticle(article)}
                    className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-500/50 transition cursor-pointer shadow-sm hover:shadow-xl hover:shadow-blue-500/5 flex flex-col justify-between group h-full relative"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full uppercase">
                          {article.category}
                        </span>
                        <span className="text-slate-500">{article.readTime} • {article.date}</span>
                      </div>

                      <h4 className="text-xl font-serif font-bold text-slate-900 group-hover:text-blue-600 transition">
                        {article.title}
                      </h4>
                      <p className="text-slate-600 text-sm leading-relaxed line-clamp-2">
                        {article.excerpt}
                      </p>
                    </div>

                    <div className="pt-4 mt-6 border-t border-slate-200 flex items-center justify-between text-xs text-blue-600 font-semibold">
                      <span>By {article.author}</span>
                      <span className="flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                        <span>Read Full Post</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          )}
        </div>

        {/* Article CMS Modal */}
        <ArticleCmsModal
          isOpen={isCmsOpen}
          onClose={() => setIsCmsOpen(false)}
          onArticlePublished={handleArticlePublished}
        />

        {/* Free Resources & Templates Section */}
        <div id="templates" className="scroll-mt-24">
          <AnimatedSection animation="fade-up" className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif font-bold text-slate-900 flex items-center space-x-3">
              <FileText className="w-6 h-6 text-blue-600" />
              <span>Free Business Resources & Templates</span>
            </h3>
            <span className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Downloadable Tools</span>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FREE_RESOURCES.map((res, idx) => (
              <AnimatedSection
                key={res.id}
                animation="fade-up"
                delay={idx * 100}
                duration={600}
              >
                <div
                  id={res.id}
                  className="scroll-mt-28 bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-500/50 transition group h-full"
                >
                  <div className="space-y-3">
                    <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full uppercase">
                      {res.type}
                    </span>
                    <h4 className="text-lg font-serif font-bold text-slate-900 group-hover:text-blue-600 transition">
                      {res.title}
                    </h4>
                    <p className="text-slate-600 text-xs leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-6 border-t border-slate-200">
                    <button
                      onClick={() => handleDownloadResource(res.title)}
                      className="w-full py-2.5 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800 text-xs font-semibold transition flex items-center justify-center space-x-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>{res.title.includes('Assessment') ? 'Start Assessment' : 'Download Free Tool'}</span>
                    </button>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

