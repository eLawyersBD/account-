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

