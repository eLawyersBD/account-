export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  icon: string;
  features: string[];
  idealFor?: string;
  imageUrl?: string;
}

export interface IndustryItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  keyMetrics: string;
}

export interface PackageItem {
  id: string;
  name: string;
  targetAudience: string;
  description: string;
  features: string[];
  popular?: boolean;
}

export interface ArticleItem {
  id: string;
  title: string;
  category: 'Article' | 'Template' | 'Guide';
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
  author: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface CaseStudyItem {
  id: string;
  clientType: string;
  industry: string;
  timeframe: string;
  heroMetric: string;
  keyOutcomeValue: string;
  challenge: string;
  solution: string;
  results: string[];
  tags: string[];
  clientQuote?: {
    quote: string;
    author: string;
    role: string;
  };
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientRole: string;
  company: string;
  industry: string;
  quote: string;
  rating: number;
  outcomeHighlight: string;
  avatarUrl?: string;
}

export interface ExpertItem {
  id: string;
  name: string;
  role: string;
  specialty: string;
  bio: string;
  photoUrl: string;
  linkedinUrl: string;
  credentials: string[];
}

export interface CourseItem {
  id: string;
  title: string;
  subtitle: string;
  level: 'Executive' | 'Advanced' | 'Masterclass';
  duration: string;
  modulesCount: number;
  certificationTitle: string;
  badge: string;
  description: string;
  curriculum: string[];
  skillsLearned: string[];
  instructor: string;
  enrolledStudents: number;
  rating: number;
}

// Client Portal Entities
export interface ClientProfile {
  userId: string;
  email: string;
  displayName: string;
  companyName: string;
  phone?: string;
  role?: string;
  photoURL?: string;
  createdAt?: string;
}

export type ProjectStatus = 'discovery' | 'in_progress' | 'review' | 'completed' | 'on_hold';

export type MilestoneStatus = 'in_progress' | 'completed' | 'delayed' | 'upcoming' | 'review' | 'on_hold' | 'finalized';
export type MilestonePriority = 'low' | 'medium' | 'high';

export interface ProjectMilestone {
  id: string;
  title: string;
  startDate?: string;
  dueDate: string;
  status: MilestoneStatus | string;
  priority: MilestonePriority;
  description?: string;
  phase?: string;
  progress?: number;
  owner?: string;
  deliverableName?: string;
  keyOutputs?: string[];
  delayReason?: string;
}

export interface ProjectDeliverable {
  id: string;
  name: string;
  fileType: string;
  size: string;
  date: string;
  downloadUrl?: string;
  status: 'approved' | 'in_review' | 'draft';
}

export interface ProjectUpdateLog {
  id: string;
  date: string;
  author: string;
  role: string;
  text: string;
}

export interface ClientProject {
  id: string;
  userId: string;
  title: string;
  serviceType: string;
  companyName: string;
  status: ProjectStatus;
  progressPercentage: number;
  startDate: string;
  targetCompletionDate: string;
  leadConsultantName: string;
  leadConsultantRole: string;
  leadConsultantEmail: string;
  leadConsultantAvatar?: string;
  budgetTotal: number;
  budgetSpent: number;
  description: string;
  milestones: ProjectMilestone[];
  deliverables: ProjectDeliverable[];
  recentUpdates: ProjectUpdateLog[];
  kpis?: BusinessKPI[];
  createdAt?: any;
  updatedAt?: any;
}

export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'in_review';

export interface InvoiceLineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ClientInvoice {
  id: string;
  userId: string;
  projectId?: string;
  projectTitle?: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  description: string;
  items: InvoiceLineItem[];
  paidAt?: string;
  paymentMethod?: string;
  downloadUrl?: string;
  createdAt?: any;
}

export type DocumentCategory = 
  | 'Strategy Deck' 
  | 'Financial Model' 
  | 'Audit Report' 
  | 'SOP Playbook' 
  | 'Contract / NDA' 
  | 'Deliverable'
  | 'Tax Document'
  | 'Operational Brief';

export interface ClientDocument {
  id: string;
  userId: string;
  projectId?: string;
  projectTitle?: string;
  title: string;
  category: DocumentCategory;
  fileName: string;
  fileSize: string;
  fileType: string;
  downloadUrl?: string;
  storagePath?: string;
  version: string;
  confidential: boolean;
  sharedBy: string;
  uploadedAt: string;
  description?: string;
  createdAt?: any;
}

export interface PortalMessage {
  id: string;
  userId: string;
  projectId?: string;
  senderName: string;
  senderRole: string;
  senderType: 'client' | 'consultant';
  message: string;
  read: boolean;
  createdAt?: any;
}

export type CommentTag = 
  | 'Status Update' 
  | 'Clarification' 
  | 'Approval' 
  | 'Deliverable Review' 
  | 'Feedback' 
  | 'General';

export interface MilestoneComment {
  id: string;
  projectId: string;
  milestoneId: string;
  milestoneTitle?: string;
  userId: string;
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  authorType: 'client' | 'consultant';
  content: string;
  tag?: CommentTag | string;
  attachments?: {
    name: string;
    fileType?: string;
    size?: string;
    url?: string;
  }[];
  createdAt?: any;
}

export interface TimeEntry {
  id: string;
  projectId: string;
  milestoneId: string;
  userId: string;
  consultantName: string;
  hours: number;
  description: string;
  date: string;
  createdAt?: any;
}

export interface BusinessKPI {
  name: string;
  value: number;
  target: number;
  unit: string;
  description: string;
}

