import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustedByCarousel } from './components/TrustedByCarousel';
import { AboutSection } from './components/AboutSection';
import { ServicesSection } from './components/ServicesSection';
import { BusinessHealthDashboard } from './components/BusinessHealthDashboard';
import { PerformanceMetrics } from './components/PerformanceMetrics';
import { IndustriesSection } from './components/IndustriesSection';
import { WhyChooseUs } from './components/WhyChooseUs';
import { ProcessSection } from './components/ProcessSection';
import { PackagesSection } from './components/PackagesSection';
import { KnowledgeCenter } from './components/KnowledgeCenter';
import { CaseStudiesSection } from './components/CaseStudiesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ExpertsSection } from './components/ExpertsSection';
import { NewsletterSection } from './components/NewsletterSection';
import { FaqSection } from './components/FaqSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { LiveChatWidget } from './components/LiveChatWidget';
import { CookieConsentBanner } from './components/CookieConsentBanner';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { ServiceCoverageMap } from './components/ServiceCoverageMap';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { SectionDivider } from './components/SectionDivider';

import { ConsultationModal } from './components/ConsultationModal';
import { HealthAssessmentModal } from './components/HealthAssessmentModal';
import { ArticleModal } from './components/ArticleModal';
import { CourseModal } from './components/CourseModal';
import { GoogleMeetModal } from './components/GoogleMeetModal';
import { GoogleWorkspaceModal } from './components/GoogleWorkspaceModal';
import { FinanceAct2026TaxCalculator } from './components/FinanceAct2026TaxCalculator';
import { KeyboardShortcutsModal } from './components/KeyboardShortcutsModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { ClientPortal } from './components/portal/ClientPortal';
import { ArticleItem, CourseItem } from './types';
import { useActiveSectionObserver } from './hooks/useActiveSectionObserver';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useDocumentMetadata } from './hooks/useDocumentMetadata';
import { Keyboard } from 'lucide-react';

export default function App() {
  const [activeSection, setActiveSection] = useState('home');

  // Active section tracking via Intersection Observer
  useActiveSectionObserver(
    ['home', 'about', 'services', 'dashboard', 'metrics', 'industries', 'why-choose-us', 'process', 'packages', 'resources', 'blog', 'casestudies', 'testimonials', 'experts', 'faq', 'contact'],
    setActiveSection
  );

  // Modal states
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [consultationMode, setConsultationMode] = useState<'consultation' | 'meeting'>('consultation');
  const [selectedServiceForConsultation, setSelectedServiceForConsultation] = useState<string | undefined>(undefined);

  const [googleMeetModalOpen, setGoogleMeetModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [workspaceModalTab, setWorkspaceModalTab] = useState<'drive' | 'sheets' | 'gmail' | 'calendar' | 'forms'>('drive');
  const [healthAssessmentOpen, setHealthAssessmentOpen] = useState(false);
  const [clientPortalOpen, setClientPortalOpen] = useState(false);

  const handleOpenWorkspaceSuite = (tab: 'drive' | 'sheets' | 'gmail' | 'calendar' | 'forms' = 'drive') => {
    setWorkspaceModalTab(tab);
    setWorkspaceModalOpen(true);
  };
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<CourseItem | null>(null);
  const [shortcutsModalOpen, setShortcutsModalOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [selectedFaqIndex, setSelectedFaqIndex] = useState<number | null>(null);


  const handleOpenConsultation = (serviceName?: string) => {
    setConsultationMode('consultation');
    setSelectedServiceForConsultation(serviceName);
    setConsultationModalOpen(true);
  };

  const handleOpenMeeting = () => {
    setConsultationMode('meeting');
    setSelectedServiceForConsultation(undefined);
    setConsultationModalOpen(true);
  };

  const handleSelectPackage = (packageName: string) => {
    handleOpenConsultation(`Package Inquiry: ${packageName}`);
  };

  // Keyboard Shortcuts Hook
  const { lastShortcutTriggered } = useKeyboardShortcuts({
    onConsultation: () => handleOpenConsultation(),
    onMeeting: () => handleOpenMeeting(),
    onHealthAssessment: () => setHealthAssessmentOpen(true),
    onToggleShortcutsModal: () => setShortcutsModalOpen((prev) => !prev),
    onToggleSearch: () => setSearchModalOpen((prev) => !prev),
  });

  // Dynamic Document Title & Meta Description SEO Hook
  useDocumentMetadata({
    activeSection,
    isConsultationModalOpen: consultationModalOpen,
    consultationMode,
    isHealthAssessmentOpen: healthAssessmentOpen,
    articleTitle: selectedArticle?.title,
    isShortcutsModalOpen: shortcutsModalOpen,
    isSearchModalOpen: searchModalOpen,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Navigation */}
      <Navbar
        onOpenConsultation={() => handleOpenConsultation()}
        onOpenMeeting={handleOpenMeeting}
        onOpenGoogleMeet={() => setGoogleMeetModalOpen(true)}
        onOpenWorkspaceSuite={handleOpenWorkspaceSuite}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenClientPortal={() => setClientPortalOpen(true)}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Sections */}
      <main>
        <Hero
          onOpenConsultation={() => handleOpenConsultation()}
          onOpenMeeting={handleOpenMeeting}
          onOpenHealthAssessment={() => setHealthAssessmentOpen(true)}
          onOpenClientPortal={() => setClientPortalOpen(true)}
        />

        <TrustedByCarousel />

        <SectionDivider variant="wave" fillColor="fill-white" heightClass="h-10 sm:h-14 lg:h-16" />
        
        <AboutSection />

        <SectionDivider variant="slant" fillColor="fill-slate-50" heightClass="h-10 sm:h-14 lg:h-16" />

        <ServicesSection
          onSelectServiceForConsultation={(serviceTitle) => handleOpenConsultation(serviceTitle)}
        />

        <SectionDivider variant="curve" fillColor="fill-white" heightClass="h-10 sm:h-14 lg:h-16" />

        <BusinessHealthDashboard
          onOpenConsultation={(note) => handleOpenConsultation(note)}
          onOpenGoogleMeet={() => setGoogleMeetModalOpen(true)}
          onOpenWorkspaceSuite={handleOpenWorkspaceSuite}
        />

        <SectionDivider variant="slant" fillColor="fill-slate-900" heightClass="h-10 sm:h-14 lg:h-16" />

        <FinanceAct2026TaxCalculator
          onOpenWorkspaceSuite={handleOpenWorkspaceSuite}
          onOpenConsultation={(note) => handleOpenConsultation(note)}
        />

        <SectionDivider variant="curve" fillColor="fill-slate-950" heightClass="h-10 sm:h-14 lg:h-16" />

        <PerformanceMetrics
          onOpenConsultation={(note) => handleOpenConsultation(note)}
        />

        <SectionDivider variant="layered-wave" fillColor="fill-slate-900" heightClass="h-12 sm:h-16 lg:h-20" />

        <IndustriesSection />

        <SectionDivider variant="asymmetric-wave" fillColor="fill-slate-900" heightClass="h-12 sm:h-16 lg:h-20" />

        {/* Global Remote Service Reach Map */}
        <ServiceCoverageMap
          onSelectRegionConsultation={(region) => handleOpenConsultation(`Regional Inquiry: ${region}`)}
        />

        <SectionDivider variant="curve" fillColor="fill-slate-50" heightClass="h-12 sm:h-16 lg:h-20" />

        <WhyChooseUs />

        <SectionDivider variant="slant" flipX fillColor="fill-white" heightClass="h-10 sm:h-14 lg:h-16" />

        <ProcessSection
          onOpenConsultation={() => handleOpenConsultation()}
        />

        <SectionDivider variant="wave" fillColor="fill-slate-50" heightClass="h-10 sm:h-14 lg:h-16" />

        <PackagesSection
          onSelectPackage={handleSelectPackage}
        />

        <SectionDivider variant="peaks" fillColor="fill-white" heightClass="h-10 sm:h-14 lg:h-16" />

        <KnowledgeCenter
          onOpenArticle={(article) => setSelectedArticle(article)}
          onOpenCourse={(course) => setSelectedCourse(course)}
          onOpenHealthAssessment={() => setHealthAssessmentOpen(true)}
        />

        <SectionDivider variant="curve" fillColor="fill-slate-50" heightClass="h-10 sm:h-14 lg:h-16" />

        <CaseStudiesSection
          onOpenConsultation={(note) => handleOpenConsultation(note)}
        />

        <SectionDivider variant="layered-wave" fillColor="fill-white" heightClass="h-10 sm:h-14 lg:h-16" />

        <TestimonialsSection />

        <SectionDivider variant="asymmetric-wave" fillColor="fill-slate-900" heightClass="h-12 sm:h-16 lg:h-20" />

        <ExpertsSection
          onOpenConsultation={(note) => handleOpenConsultation(note)}
        />

        <SectionDivider variant="wave" fillColor="fill-white" heightClass="h-10 sm:h-14 lg:h-16" />

        <FaqSection openFaqIndex={selectedFaqIndex} />

        <SectionDivider variant="slant" fillColor="fill-slate-50" heightClass="h-10 sm:h-14 lg:h-16" />

        <ContactSection />

        <SectionDivider variant="curve" fillColor="fill-slate-900" heightClass="h-12 sm:h-16 lg:h-20" />
      </main>

      {/* Pre-footer Newsletter Lead Capture */}
      <NewsletterSection />

      {/* Footer */}
      <Footer
        setActiveSection={setActiveSection}
        onOpenConsultation={() => handleOpenConsultation()}
      />

      {/* Global Spotlight Search Modal */}
      <GlobalSearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
        onSelectService={(serviceTitle) => handleOpenConsultation(serviceTitle)}
        onSelectArticle={(article) => setSelectedArticle(article)}
        onSelectFaq={(faqIdx) => setSelectedFaqIndex(faqIdx)}
        onSelectPackage={(pkgName) => handleSelectPackage(pkgName)}
      />

      {/* Modals */}
      {consultationModalOpen && (
        <ConsultationModal
          mode={consultationMode}
          initialService={selectedServiceForConsultation}
          onClose={() => setConsultationModalOpen(false)}
          onOpenGoogleMeet={() => setGoogleMeetModalOpen(true)}
        />
      )}

      <GoogleMeetModal
        isOpen={googleMeetModalOpen}
        onClose={() => setGoogleMeetModalOpen(false)}
      />

      <GoogleWorkspaceModal
        isOpen={workspaceModalOpen}
        onClose={() => setWorkspaceModalOpen(false)}
        defaultTab={workspaceModalTab}
      />

      {healthAssessmentOpen && (
        <HealthAssessmentModal
          onClose={() => setHealthAssessmentOpen(false)}
          onOpenConsultationWithNote={(note) => handleOpenConsultation(note)}
        />
      )}

      {selectedArticle && (
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          onOpenConsultation={() => handleOpenConsultation(`Article Inquiry: ${selectedArticle.title}`)}
        />
      )}

      {selectedCourse && (
        <CourseModal
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onOpenConsultation={(note) => handleOpenConsultation(note)}
        />
      )}

      {/* Secure Client Portal (Firestore Synchronized) */}
      <ClientPortal
        isOpen={clientPortalOpen}
        onClose={() => setClientPortalOpen(false)}
        onOpenConsultation={() => {
          setClientPortalOpen(false);
          handleOpenConsultation();
        }}
      />

      {/* Keyboard Shortcuts Modal Guide */}
      <KeyboardShortcutsModal
        isOpen={shortcutsModalOpen}
        onClose={() => setShortcutsModalOpen(false)}
        onTriggerConsultation={() => handleOpenConsultation()}
        onTriggerMeeting={() => handleOpenMeeting()}
        onTriggerHealthAssessment={() => setHealthAssessmentOpen(true)}
        onTriggerSearch={() => setSearchModalOpen(true)}
      />

      {/* Shortcut Toast Feedback Alert */}
      {lastShortcutTriggered && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/90 text-white border border-blue-500/40 px-4 py-2.5 rounded-2xl shadow-xl backdrop-blur-md flex items-center space-x-2.5 text-xs font-semibold animate-fade-in pointer-events-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>{lastShortcutTriggered}</span>
        </div>
      )}

      {/* Floating Keyboard Shortcuts Trigger Badge */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setShortcutsModalOpen(true)}
          className="bg-slate-900/80 hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-700/80 hover:border-blue-500/50 p-2.5 rounded-full shadow-lg backdrop-blur-md transition-all duration-200 flex items-center space-x-2 group text-xs font-medium"
          title="Keyboard Shortcuts Guide (?)"
          aria-label="Keyboard Shortcuts Guide"
        >
          <Keyboard className="w-4 h-4 text-blue-400 group-hover:scale-110 transition-transform" />
          <span className="hidden md:inline text-[11px] text-slate-300 pr-1">Shortcuts <kbd className="font-mono bg-slate-800 text-blue-300 px-1.5 py-0.5 rounded border border-slate-700 text-[10px]">?</kbd></span>
        </button>
      </div>

      {/* Live Chat Advisory Widget */}
      <LiveChatWidget
        onOpenConsultation={(note) => handleOpenConsultation(note)}
      />

      {/* Non-intrusive Cookie Consent Banner */}
      <CookieConsentBanner />

      {/* Scroll to Top Button (Appears past Hero) */}
      <ScrollToTopButton />

    </div>
  );
}
