import { ServiceItem, IndustryItem, PackageItem, ArticleItem, FaqItem, CaseStudyItem, TestimonialItem, ExpertItem } from '../types';

export const SERVICES_DATA: ServiceItem[] = [
  {
    id: 'startup-consultancy',
    title: 'Business Startup Consultancy',
    tagline: 'Turn Your Business Idea Into Reality',
    description: 'Starting a business requires proper planning, market understanding, financial preparation, and operational structure. Our startup consultancy services help entrepreneurs build a strong foundation.',
    icon: 'Rocket',
    imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
    idealFor: 'New Entrepreneurs, Startups, First-Time Business Owners, Investors',
    features: [
      'Business Idea Evaluation',
      'Market Research & Analysis',
      'Business Model Development',
      'Startup Roadmap Creation',
      'Business Plan Preparation',
      'Financial Planning',
      'Revenue Model Development',
      'Cost Analysis',
      'Investment Planning',
      'Operational Setup Guidance',
      'Growth Strategy Development'
    ]
  },
  {
    id: 'business-planning',
    title: 'Business Planning & Strategy Consultancy',
    tagline: 'Create a Clear Roadmap for Growth',
    description: 'Many businesses fail because they operate without a clear strategy. Accounticca helps businesses create structured plans that improve decision-making and long-term performance.',
    icon: 'Target',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    idealFor: 'Growing SMEs, Established Businesses Seeking Expansion',
    features: [
      'Strategic Business Planning',
      'Annual Business Planning',
      'Growth Strategy formulation',
      'Expansion Planning & Execution',
      'Competitive Analysis & Benchmarking',
      'Market Positioning strategy',
      'Revenue Growth Strategy',
      'Business Performance Review',
      'Risk Assessment & Mitigation',
      'Milestone & OKR Tracking'
    ]
  },
  {
    id: 'accounting-financial',
    title: 'Accounting & Financial Consultancy',
    tagline: 'Better Financial Control. Better Business Decisions.',
    description: 'Financial discipline is the backbone of every successful business. We help organizations establish accurate financial systems and gain better control over their money.',
    icon: 'TrendingUp',
    imageUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80',
    idealFor: 'Companies seeking financial restructuring and management accounts',
    features: [
      'Accounting System Setup & Customization',
      'Financial Reporting Infrastructure',
      'Monthly Management Accounts',
      'Cash Flow Management & Forecasting',
      'Budget Preparation & Variance Analysis',
      'Financial Analysis & Health Checks',
      'Profitability Analysis by Product/Service',
      'Expense Optimization & Cost Control',
      'Financial Dashboard Development',
      'Business Performance Reports'
    ]
  },
  {
    id: 'bookkeeping',
    title: 'Bookkeeping Services',
    tagline: 'Keep Your Financial Records Organized',
    description: 'Our bookkeeping solutions help businesses maintain accurate and updated financial records seamlessly, ensuring complete compliance and visibility.',
    icon: 'BookOpen',
    imageUrl: 'https://images.unsplash.com/photo-1554224154-26032ffc0d07?auto=format&fit=crop&w=800&q=80',
    idealFor: 'SMEs & Startups looking to outsource daily ledger maintenance',
    features: [
      'Daily Transaction Recording',
      'Sales & Purchase Tracking',
      'Expense Management & Categorization',
      'Bank & Credit Card Reconciliation',
      'Invoice Management & Billing Support',
      'Account Receivable Tracking',
      'Account Payable Management',
      'Monthly Financial Statements',
      'Audit-Ready Documentation'
    ]
  },
  {
    id: 'business-process',
    title: 'Business Process Optimization',
    tagline: 'Improve Efficiency Through Better Systems',
    description: 'Growing businesses often face operational challenges due to inefficient processes. We analyze existing workflows and develop improved, streamlined systems.',
    icon: 'Cog',
    imageUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80',
    idealFor: 'Organizations experiencing bottlenecks or scaling pains',
    features: [
      'Business Process Analysis & Mapping',
      'Workflow Improvement & Streamlining',
      'SOP (Standard Operating Procedure) Development',
      'Operational Documentation',
      'Department Structure Planning',
      'Productivity Improvement Metrics',
      'Automation Recommendations & ROI',
      'Quality Control Frameworks'
    ]
  },
  {
    id: 'business-automation',
    title: 'Business Automation Consultancy',
    tagline: 'Make Your Business Smarter With Technology',
    description: 'Technology can reduce costs, improve productivity, and provide better control. We help you select and implement the right digital tools.',
    icon: 'Cpu',
    imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    idealFor: 'Traditional businesses transitioning to digital workflows',
    features: [
      'Business Software Consultation',
      'ERP System Advisory & Selection',
      'CRM Implementation Support',
      'Accounting Software Setup (Xero, QuickBooks, Zoho)',
      'Workflow Automation & Zapier Integration',
      'Digital Transformation Strategy',
      'Reporting Automation & BI Dashboards'
    ]
  },
  {
    id: 'hr-organizational',
    title: 'HR & Organizational Consultancy',
    tagline: 'Build Strong Teams & Better Organizations',
    description: 'People are the biggest asset of any company. We help businesses develop effective organizational structures, performance frameworks, and HR policies.',
    icon: 'Users',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    idealFor: 'Growing teams scaling beyond 10+ employees',
    features: [
      'Organization Structure Design',
      'Job Description Development',
      'Recruitment Support & Interview Frameworks',
      'HR Policy & Handbook Development',
      'Employee Performance System',
      'KPI Development & Scorecards',
      'Training Planning & Upskilling',
      'Team Management Consultancy'
    ]
  },
  {
    id: 'sales-marketing',
    title: 'Sales & Marketing Consultancy',
    tagline: 'Build a Strong Market Presence',
    description: 'We help businesses create effective customer acquisition, brand positioning, and revenue growth strategies.',
    icon: 'Megaphone',
    imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    idealFor: 'Businesses looking to accelerate customer acquisition and revenue',
    features: [
      'Sales Strategy Development',
      'Customer Journey Mapping',
      'Marketing Plan Development',
      'Brand Positioning Strategy',
      'Digital Marketing Planning & ROI',
      'Customer Retention Strategy',
      'Sales Funnel Optimization',
      'Sales Performance Analysis'
    ]
  },
  {
    id: 'sme-growth',
    title: 'SME Growth Consultancy',
    tagline: 'Helping Small Businesses Become Scalable Companies',
    description: 'Small businesses often struggle with systems, finance, and expansion. We help SMEs move from owner-dependent operations to structured organizations.',
    icon: 'Building2',
    imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    idealFor: 'Small and medium business owners looking to step back from day-to-day chaos',
    features: [
      'Comprehensive Business Health Check',
      'Growth Planning & Scaling Roadmap',
      'Process Improvement & Delegation',
      'Financial Management & Control',
      'Team Building & Leadership Advisory',
      'Expansion Strategy',
      'Performance Monitoring Frameworks'
    ]
  },
  {
    id: 'outsourced-support',
    title: 'Outsourced Business Support',
    tagline: 'Your Extended Business Team',
    description: 'Instead of building expensive internal departments, businesses can outsource professional support across finance, operations, and administration.',
    icon: 'Briefcase',
    imageUrl: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80',
    idealFor: 'Startups and leaner SMEs needing expert fractional support',
    features: [
      'Fractional Accounting Support',
      'Executive Business Reporting',
      'Administrative Support & Management',
      'Financial Analysis & Advisory',
      'Operational Support & Oversight',
      'Management Reporting Dashboards',
      'Specialized Project Support'
    ]
  }
];

export const INDUSTRIES_DATA: IndustryItem[] = [
  {
    id: 'startups',
    title: 'Startups & Entrepreneurs',
    description: 'Helping visionary founders build sustainable, investor-ready businesses from scratch.',
    icon: 'Rocket',
    keyMetrics: 'Over 120+ successful startup launches and funding preparations'
  },
  {
    id: 'ecommerce',
    title: 'E-Commerce Businesses',
    description: 'Improving digital operations, multi-channel finance, inventory accounting, and CAC/LTV growth strategy.',
    icon: 'ShoppingCart',
    keyMetrics: 'Streamlined multi-marketplace reconciliation and cash flow control'
  },
  {
    id: 'manufacturing',
    title: 'Manufacturing Companies',
    description: 'Optimizing product costing, shop-floor operations, waste reduction, and supply chain productivity.',
    icon: 'Factory',
    keyMetrics: 'Average 18% cost reduction in operational overhead'
  },
  {
    id: 'service',
    title: 'Service Businesses',
    description: 'Creating scalable service delivery systems, utilization tracking, and better client management workflows.',
    icon: 'Smile',
    keyMetrics: 'Improved client retention and standardized project delivery'
  },
  {
    id: 'trading',
    title: 'Trading Companies',
    description: 'Improving financial control, working capital management, accounts payable/receivable, and inventory turnover.',
    icon: 'Truck',
    keyMetrics: 'Enhanced cash conversion cycle and robust supplier negotiations'
  },
  {
    id: 'professional',
    title: 'Professional Firms',
    description: 'Helping advisory, consulting, and service providers build stronger organizational models beyond technical delivery.',
    icon: 'Scale',
    keyMetrics: 'Structured partnership models and efficient billing processes'
  }
];

export const PACKAGES_DATA: PackageItem[] = [
  {
    id: 'startup-pkg',
    name: 'Startup Package',
    targetAudience: 'For new entrepreneurs and early-stage ventures.',
    description: 'Essential guidance, financial modeling, and operational foundations to launch with absolute confidence.',
    features: [
      'Business Model Review & Refinement',
      'Startup Roadmap & Milestone Planning',
      'Financial Projections & Startup Budget',
      'Revenue & Pricing Strategy',
      'Basic Accounting System Setup',
      'Initial Incorporation & Setup Guidance'
    ],
    popular: false
  },
  {
    id: 'sme-growth-pkg',
    name: 'SME Growth Package',
    targetAudience: 'For existing businesses ready to scale.',
    description: 'Comprehensive analysis, financial control, and process optimization to accelerate profitable growth.',
    features: [
      'Comprehensive Business Health Check',
      'Process Improvement & SOP Development',
      'Monthly Management Accounts & Review',
      'Cash Flow Forecasting & Optimization',
      'Sales & Marketing Strategy Audit',
      'Dedicated Senior Growth Consultant'
    ],
    popular: true
  },
  {
    id: 'enterprise-advisory-pkg',
    name: 'Enterprise Advisory Package',
    targetAudience: 'For established organizations seeking excellence.',
    description: 'High-level strategic consulting, automation advisory, organizational structuring, and expansion planning.',
    features: [
      'Strategic Business Planning & Board Advisory',
      'Organizational Structure & KPI Design',
      'Business Automation & ERP/CRM Advisory',
      'Expansion & M&A Readiness Planning',
      'Risk Assessment & Governance Review',
      'Priority Access to Senior Partners'
    ],
    popular: false
  }
];

export const ARTICLES_DATA: ArticleItem[] = [
  {
    id: 'start-business-successfully',
    title: 'How to Start a Business Successfully in Today’s Market',
    category: 'Guide',
    readTime: '6 min read',
    date: 'August 1, 2026',
    author: 'Accounticca Advisory Team',
    excerpt: 'Key pillars of launching a resilient enterprise, from validation to financial runway planning.',
    content: `Starting a business is an exhilarating journey, but statistical hurdles mean preparation is paramount. In this guide, we explore the fundamental steps required to transition from a napkin idea to a thriving, scalable enterprise.

1. Rigorous Market Validation: Do not assume customers want your solution. Talk to at least 30 potential target users before writing code or ordering inventory.
2. Unit Economics & Cash Runway: Many profitable businesses fail simply because they run out of cash before accounts receivable clear. Maintain a minimum 6-month cash buffer.
3. Operational Systems from Day One: Document your core workflows early. When founders do everything themselves, growth hits a rigid ceiling.`
  },
  {
    id: 'common-startup-mistakes',
    title: '5 Common Startup Mistakes and How to Avoid Them',
    category: 'Article',
    readTime: '5 min read',
    date: 'July 24, 2026',
    author: 'Senior Financial Consultant',
    excerpt: 'Avoid cash burn, premature scaling, and blurred founder responsibilities with these proven preventive strategies.',
    content: `Even brilliant entrepreneurs stumble into recurring traps that stunt growth or lead to failure. Here are the 5 most common mistakes we observe:
- Premature Scaling: Spending on aggressive marketing before achieving true product-market fit.
- Ignoring Financial Recordkeeping: Mixing personal and business accounts or failing to reconcile monthly.
- Hiring Too Fast: Adding headcount before standardizing processes.
- Lack of Delegation: Founder bottleneck syndrome.
- Undervaluing Your Offering: Competing solely on price rather than value.`
  },
  {
    id: 'financial-management-tips',
    title: 'Financial Management Tips Every Business Owner Needs',
    category: 'Article',
    readTime: '4 min read',
    date: 'July 15, 2026',
    author: 'Accounting Advisory Lead',
    excerpt: 'Master cash flow forecasting, profit margins, and working capital management for ultimate financial peace of mind.',
    content: `Financial literacy is non-negotiable for business leaders. You do not need to be a CPA, but you must understand three key statements: The Profit & Loss Statement, the Balance Sheet, and the Cash Flow Statement.
- Monitor Gross Margins weekly.
- Implement strict aging reports for receivables over 30 days.
- Forecast cash flow on a rolling 13-week basis.`
  },
  {
    id: 'business-growth-strategies',
    title: 'Scaling Up: Strategic Growth Frameworks for SMEs',
    category: 'Guide',
    readTime: '8 min read',
    date: 'July 10, 2026',
    author: 'Strategy Practice',
    excerpt: 'How to transition your company from founder-led hustle to a self-sustaining corporate engine.',
    content: `Scaling requires shifting your mindset from working *in* the business to working *on* the business. Discover our proprietary 4-stage SME growth framework covering systems, leadership delegation, financial controls, and strategic expansion.`
  }
];

export const FREE_RESOURCES = [
  {
    id: 'business-plan-template',
    title: 'Comprehensive Business Plan Template',
    type: 'Template (Word/PDF)',
    description: 'A 25-page structured template covering executive summary, market analysis, financial projections, and operations.'
  },
  {
    id: 'startup-checklist',
    title: 'Ultimate Startup Launch Checklist',
    type: 'Checklist (PDF)',
    description: '50 crucial checkpoints across legal, financial, HR, branding, and operations before you open your doors.'
  },
  {
    id: 'financial-planning-model',
    title: '3-Year Financial Projection Model',
    type: 'Excel / Sheets Tool',
    description: 'Dynamic financial model with automated P&L, cash flow statement, and break-even calculator.'
  },
  {
    id: 'business-health-assessment',
    title: 'Business Health Assessment Scorecard',
    type: 'Interactive Tool',
    description: 'Evaluate your business across 6 core operational and financial dimensions in under 3 minutes.'
  }
];

export const FAQ_DATA: FaqItem[] = [
  {
    question: 'What does Accounticca do?',
    answer: 'Accounticca provides comprehensive business consultancy services including business planning, accounting support, financial advisory, operational improvement, workflow automation, HR structuring, and growth strategy.'
  },
  {
    question: 'Is Accounticca a legal consultancy firm?',
    answer: 'No. Legal services, incorporations, and legal compliance are handled separately by our partner in the E-Lawyers ecosystem. Accounticca focuses exclusively on business growth, finance, management, and operational consulting.'
  },
  {
    question: 'Who can use Accounticca services?',
    answer: 'Our services are tailored for startups, SMEs, entrepreneurs, family-owned businesses, and established companies looking to scale efficiently and improve profitability.'
  },
  {
    question: 'Can Accounticca help me start a new business?',
    answer: 'Yes! We help entrepreneurs with business idea validation, business planning, financial modeling, operational setup, market research, and step-by-step growth strategies.'
  },
  {
    question: 'Can Accounticca manage accounting for my company?',
    answer: 'Yes, we provide full-suite bookkeeping, accounting system setup, monthly management accounts, financial reporting, and fractional CFO advisory.'
  }
];

export const CASE_STUDIES: CaseStudyItem[] = [
  {
    id: 'cs-1',
    clientType: 'SaaS Startup (Pre-Series A)',
    industry: 'Technology / SaaS',
    timeframe: '6 Month Advisory Sprint',
    heroMetric: '+9 Months Runway',
    keyOutcomeValue: '$1.5M Capital Raised',
    challenge: 'Uncontrolled cash burn rate, chaotic bookkeeping, and undefined CAC/LTV unit economics causing investor hesitation during Series A diligence.',
    solution: 'Accounticca restructured cloud & headcount cost centers, instituted a 13-week rolling cash forecast, built investor-grade financial models, and established automated cloud accounting.',
    results: [
      'Extended cash runway by 9 months without reducing core engineering headcount',
      'Successfully secured $1.5M in Series A venture funding with zero valuation haircut',
      'Reduced monthly reconciliation and administrative reporting turnaround time by 70%'
    ],
    tags: ['Financial Modeling', 'Fundraising Prep', 'Unit Economics'],
    clientQuote: {
      quote: 'Accounticca gave us the financial discipline and clear unit economics we needed to win over top-tier VCs.',
      author: 'Sarah Jenkins',
      role: 'CEO, NexusTech SaaS'
    }
  },
  {
    id: 'cs-2',
    clientType: 'Mid-Sized Manufacturing Enterprise',
    industry: 'Manufacturing & Industrial',
    timeframe: '12 Month Operational Turnaround',
    heroMetric: '-18% Raw Waste',
    keyOutcomeValue: '+5.4% Net Profit Margin',
    challenge: 'Owner-dependent daily operations, unstandardized shop-floor workflows, and escalating material waste that severely eroded gross operating margins.',
    solution: 'Engineered lean business process SOPs, conducted an end-to-end workflow audit, guided ERP system selection, and implemented middle-management KPI scorecards.',
    results: [
      'Achieved an 18% reduction in raw material scrap and production downtime',
      'Transitioned daily plant oversight from owner to empowered department leads',
      'Expanded net profit margin by 5.4% within 6 months of SOP deployment'
    ],
    tags: ['Process SOPs', 'ERP Advisory', 'Cost Reduction'],
    clientQuote: {
      quote: 'For the first time in 10 years, I can step away from daily operations knowing our plant runs smoothly on SOPs.',
      author: 'Marcus Vance',
      role: 'Managing Director, Apex Precision'
    }
  },
  {
    id: 'cs-3',
    clientType: 'Multi-Channel E-Commerce Brand',
    industry: 'E-Commerce & Retail',
    timeframe: '4 Month Scaled Growth',
    heroMetric: '+45% Revenue Scale',
    keyOutcomeValue: '22-Day Faster Cash Cycle',
    challenge: 'Multi-marketplace inventory reconciliation chaos across Amazon & Shopify, sluggish cash conversion cycles, and blurred channel profitability.',
    solution: 'Implemented multi-channel accounting automation, streamlined supplier payment schedules, optimized SKU-level gross margins, and introduced real-time BI dashboard reporting.',
    results: [
      'Eliminated inventory stockout discrepancies across 4 major sales channels',
      'Shortened cash conversion cycle by 22 days, unlocking $240K in working capital',
      'Scaled monthly top-line revenue by 45% with stabilized customer acquisition cost'
    ],
    tags: ['Inventory Control', 'E-Commerce Accounting', 'Cash Conversion'],
    clientQuote: {
      quote: 'Accounticca helped us turn inventory chaos into predictable cash flow and rapid expansion.',
      author: 'Elena Rostova',
      role: 'Founder, Lumina Lifestyle'
    }
  },
  {
    id: 'cs-4',
    clientType: 'Regional Logistics & Freight Operator',
    industry: 'Logistics & Fleet',
    timeframe: '8 Month Overhead Optimization',
    heroMetric: '-14% Fleet Overhead',
    keyOutcomeValue: '+$320K EBITDA Gain',
    challenge: 'Uncapped fuel expenditure, manual fleet dispatch bottlenecks, and uncoordinated vendor payables creating severe seasonal cash crunches.',
    solution: 'Built dynamic route cost analysis models, negotiated extended 60-day vendor payables terms, automated driver expense tracking, and implemented weekly cash flow forecasting.',
    results: [
      'Cut total fleet operational expenditure by 14% through route margin optimization',
      'Secured a 30-day extended credit buffer from key fuel and parts suppliers without interest penalty',
      'Delivered +$320,000 in net annual EBITDA improvement'
    ],
    tags: ['Fleet Optimization', 'Working Capital', 'Vendor Negotiation']
  },
  {
    id: 'cs-5',
    clientType: 'Private Healthcare & Clinic Group',
    industry: 'Healthcare Services',
    timeframe: '5 Month Governance Revamp',
    heroMetric: '18-Day Receivables',
    keyOutcomeValue: '100% Regulatory Score',
    challenge: 'Delays in patient insurance billing collection exceeding 60 days, compliance audit vulnerabilities, and high clinical staff turnover.',
    solution: 'Redesigned medical billing workflows, instituted HIPAA/regulatory compliance checklists, automated patient invoicing, and restructured clinical team incentives.',
    results: [
      'Reduced average billing collection cycle from 60 days to 18 days',
      'Achieved a 100% flawless score during external health regulatory compliance audit',
      'Increased clinical staff retention by 28% through transparent performance scorecards'
    ],
    tags: ['Healthcare Billing', 'Compliance Audit', 'HR Structuring']
  },
  {
    id: 'cs-6',
    clientType: 'Corporate Advisory & Legal Practice',
    industry: 'Professional Services',
    timeframe: '6 Month Partner Restructure',
    heroMetric: '+25% Billable Hours',
    keyOutcomeValue: '+32% Partner Profit',
    challenge: 'Uncaptured partner billable hours, equity distribution disputes, and inefficient client onboarding that delayed engagement start dates.',
    solution: 'Introduced cloud time-tracking software integration, drafted transparent performance-based equity compensation frameworks, and streamlined client onboarding SLAs.',
    results: [
      'Captured 25% previously unbilled partner advisory hours',
      'Boosted overall partner net dividend distribution by 32% year-over-year',
      'Accelerated client contract onboarding SLA turnaround from 5 days to 24 hours'
    ],
    tags: ['Partner Governance', 'Time Tracking', 'Profitability']
  }
];

export const TESTIMONIALS_DATA: TestimonialItem[] = [
  {
    id: 't-1',
    clientName: 'Sarah Jenkins',
    clientRole: 'CEO & Founder',
    company: 'NexusTech SaaS',
    industry: 'Technology / SaaS',
    quote: 'Accounticca transformed our financial clarity prior to our Series A round. Their cash runway model and financial restructuring gave our investors absolute confidence.',
    rating: 5,
    outcomeHighlight: 'Secured $1.5M Funding',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-2',
    clientName: 'Marcus Vance',
    clientRole: 'Managing Director',
    company: 'Apex Precision Manufacturing',
    industry: 'Industrial & Manufacturing',
    quote: 'The operational process audit performed by Accounticca revealed bottlenecks we had overlooked for years. They helped us delegate day-to-day operations seamlessly.',
    rating: 5,
    outcomeHighlight: '18% Waste Reduction',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-3',
    clientName: 'Elena Rostova',
    clientRole: 'Founder & Creative Director',
    company: 'Lumina Apparel',
    industry: 'E-Commerce & Retail',
    quote: 'Managing multi-channel inventory and cash flow was overwhelming. Accounticca built custom management dashboards that brought immediate order to our finances.',
    rating: 5,
    outcomeHighlight: '+45% Scaled Revenue',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-4',
    clientName: 'David Chen',
    clientRole: 'Co-Founder & COO',
    company: 'Horizon Global Logistics',
    industry: 'Logistics & Supply Chain',
    quote: 'As a rapidly growing SME, having fractional CFO guidance from Accounticca gave us enterprise-grade financial control without the overhead of an executive headcount.',
    rating: 5,
    outcomeHighlight: '22-Day Faster Cash Cycle',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 't-5',
    clientName: 'Tariq Al-Mansoor',
    clientRole: 'Principal Partner',
    company: 'Vantage Capital Advisory',
    industry: 'Professional Services',
    quote: 'The synergy with the E-Lawyers ecosystem allowed us to address both corporate legal structuring and business growth operations under one cohesive strategy.',
    rating: 5,
    outcomeHighlight: '360° Ops & Legal Synergy',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  }
];

export const EXPERTS_DATA: ExpertItem[] = [
  {
    id: 'exp-1',
    name: 'David Miller, FCA',
    role: 'Senior Financial & Advisory Partner',
    specialty: 'Fractional CFO & Capital Restructuring',
    bio: 'Over 16 years guiding SMEs through financial optimization, valuation audits, and investor pitch readiness across SaaS, retail, and manufacturing sectors.',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80',
    linkedinUrl: 'https://linkedin.com/in/david-miller-accounticca',
    credentials: ['Fellow Chartered Accountant (FCA)', 'Ex-Big4 Senior Audit Manager', 'MSc Financial Economics']
  },
  {
    id: 'exp-2',
    name: 'Victoria Sterling, MBA',
    role: 'Head of Operations & Systems Strategy',
    specialty: 'Process Automation & Org Scaling',
    bio: 'Specializes in transforming operational friction into streamlined workflows. Has engineered lean management systems for over 80 high-growth enterprises.',
    photoUrl: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80',
    linkedinUrl: 'https://linkedin.com/in/victoria-sterling-ops',
    credentials: ['Six Sigma Black Belt', 'INSEAD MBA', 'Certified Management Consultant']
  },
  {
    id: 'exp-3',
    name: 'Harrison Brooks, CPA',
    role: 'Lead Tax & Corporate Governance Director',
    specialty: 'Tax Strategy & E-Lawyers Compliance Synergy',
    bio: 'Bridges the gap between corporate legal structure and fiscal compliance, ensuring business owners minimize tax drag while remaining audit-ready.',
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=80',
    linkedinUrl: 'https://linkedin.com/in/harrison-brooks-tax',
    credentials: ['Certified Public Accountant (CPA)', 'Corporate Governance Specialist', 'LL.M. Business Law']
  },
  {
    id: 'exp-4',
    name: 'Amara Okafor, M.Fin',
    role: 'Senior Business Valuation & Growth Strategist',
    specialty: 'M&A Advisory & Profitability Engineering',
    bio: 'Expert in revenue model optimization, unit economics analysis, and strategic positioning for business sales, mergers, or debt financing.',
    photoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80',
    linkedinUrl: 'https://linkedin.com/in/amara-okafor-growth',
    credentials: ['Chartered Financial Analyst (CFA)', 'Master of Finance (LBS)', 'M&A Certified Advisor']
  }
];


