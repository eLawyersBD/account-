/**
 * Utility to dynamically update the document title and meta description tag
 * based on the active section or open modal state.
 */

export interface ActiveMetadataState {
  activeSection?: string;
  isConsultationModalOpen?: boolean;
  consultationMode?: 'consultation' | 'meeting';
  isHealthAssessmentOpen?: boolean;
  articleTitle?: string | null;
  isShortcutsModalOpen?: boolean;
  isSearchModalOpen?: boolean;
}

interface MetadataItem {
  title: string;
  description: string;
}

const SECTION_METADATA: Record<string, MetadataItem> = {
  home: {
    title: 'Accounticca | Business Consultancy & Growth Advisory',
    description: 'Strategic partner for enterprise growth, financial governance, legal risk mitigation, and operational scale.',
  },
  about: {
    title: 'About Us | Accounticca Strategic Advisory',
    description: "Learn about Accounticca's executive mission, multi-disciplinary partner network, and 15+ years of driving corporate transformation.",
  },
  services: {
    title: 'Business Consultancy Services & Financial Advisory | Accounticca',
    description: "Transform your enterprise with Accounticca's tailored consultancy services: Business Planning, Financial Restructuring, Process & ERP Automation, HR Structuring, Sales & Marketing Strategy, and SME Growth Advisory. Book a confidential partner consultation.",
  },
  dashboard: {
    title: 'Interactive Business Health Dashboard | Accounticca',
    description: 'Simulate corporate growth parameters, financial velocity, risk index, and health score in real-time.',
  },
  metrics: {
    title: 'Quantifiable Performance Metrics & Client Impact | Accounticca',
    description: 'Real client growth metrics demonstrating +152% revenue growth rate, 82% operational efficiency gains, and 16.5-month cash runway expansion.',
  },
  industries: {
    title: 'Industries We Serve | Accounticca Advisory',
    description: 'Tailored corporate advisory for Fintech, Enterprise SaaS, Manufacturing, E-Commerce, Logistics, Healthcare, and Professional Services.',
  },
  'why-choose-us': {
    title: 'Why Choose Accounticca | Proven Executive Impact',
    description: 'Discover our data-backed methodology, 99.4% client retention rate, and multi-disciplinary partner network.',
  },
  process: {
    title: '4-Step Advisory Framework | Accounticca',
    description: 'Our structured consulting roadmap: Audit & Diagnostic, Blueprint Strategy, Execution Sprints, and Scale Optimization.',
  },
  packages: {
    title: 'Advisory Packages & Retainer Pricing | Accounticca',
    description: 'Transparent, flexible business advisory packages and retainer plans for startups, growing SMEs, and established corporate enterprises. Strategic financial modeling, accounting automation, and fractional executive support.',
  },
  resources: {
    title: 'Knowledge Center & Insights | Accounticca',
    description: 'Access executive whitepapers, regulatory updates, financial growth guides, and corporate strategy breakdowns.',
  },
  casestudies: {
    title: 'Client Success Stories & Detailed Case Studies | Accounticca Impact',
    description: 'Explore verified client case studies across SaaS, Manufacturing, E-Commerce, and Healthcare detailing challenges, solutions, and measurable business outcomes.',
  },
  testimonials: {
    title: 'Executive Endorsements | Accounticca Advisory',
    description: 'Read what CEOs, CFOs, and Founders say about partnering with Accounticca for strategic growth.',
  },
  experts: {
    title: 'Senior Partners & Advisors | Accounticca Team',
    description: 'Meet our senior team of CPAs, legal strategists, M&A directors, and enterprise transformation leaders.',
  },
  faq: {
    title: 'Frequently Asked Questions | Accounticca Advisory',
    description: 'Answers to common questions regarding consultation timelines, retainer terms, NDA confidentiality, and fee structures.',
  },
  contact: {
    title: 'Contact Senior Partners | Accounticca',
    description: 'Get in touch with Accounticca headquarters or book a confidential executive consultation with our lead advisors.',
  },
};

function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string): void {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

export function updateDocumentMetadata(state: ActiveMetadataState): void {
  let title = 'Accounticca | Business Consultancy & Growth Advisory';
  let description = 'Strategic partner for enterprise growth, financial governance, legal risk mitigation, and operational scale.';

  // Check modals first (priority)
  if (state.isConsultationModalOpen) {
    if (state.consultationMode === 'meeting') {
      title = 'Schedule Executive Strategy Session | Accounticca';
      description = 'Book a 30-minute 1-on-1 strategy call with Accounticca senior partners.';
    } else {
      title = 'Request Confidential Consultation | Accounticca';
      description = 'Fill out the consultation request for customized financial, legal, and operational advisory.';
    }
  } else if (state.isHealthAssessmentOpen) {
    title = 'Business Health & Risk Diagnostic | Accounticca';
    description = 'Evaluate your corporate health score across Governance, Financial Stability, Operations, and Legal Risk.';
  } else if (state.articleTitle) {
    title = `${state.articleTitle} | Accounticca Knowledge Center`;
    description = `In-depth analysis and expert guide on ${state.articleTitle} by Accounticca senior advisors.`;
  } else if (state.isSearchModalOpen) {
    title = 'Search Advisory Resources & Solutions | Accounticca';
    description = 'Search across Accounticca services, articles, case studies, and corporate frameworks.';
  } else if (state.isShortcutsModalOpen) {
    title = 'Keyboard Shortcuts & Navigation | Accounticca';
    description = 'Quick keyboard navigation shortcuts for effortless platform browsing.';
  } else if (state.activeSection && SECTION_METADATA[state.activeSection]) {
    title = SECTION_METADATA[state.activeSection].title;
    description = SECTION_METADATA[state.activeSection].description;
  }

  // Update document title
  document.title = title;

  // Standard Meta Description
  setMetaTag('name', 'description', description);

  // Open Graph (OG) Tags for Social Media & Indexing
  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://accounticca.web.app';
  const defaultOgImage = 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80';

  setMetaTag('property', 'og:title', title);
  setMetaTag('property', 'og:description', description);
  setMetaTag('property', 'og:type', state.articleTitle ? 'article' : 'website');
  setMetaTag('property', 'og:url', currentUrl);
  setMetaTag('property', 'og:site_name', 'Accounticca Business Consultancy');
  setMetaTag('property', 'og:image', defaultOgImage);

  // Twitter Card Tags
  setMetaTag('name', 'twitter:card', 'summary_large_image');
  setMetaTag('name', 'twitter:title', title);
  setMetaTag('name', 'twitter:description', description);
  setMetaTag('name', 'twitter:image', defaultOgImage);
  setMetaTag('name', 'twitter:site', '@accounticca');
}
