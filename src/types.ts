export type CategoryType = 
  | 'all'
  | 'menstrual-health'
  | 'production'
  | 'fellowship'
  | 'education'
  | 'rural-outreach'
  | 'research'
  | 'csr'
  | 'capacity-building'
  | 'awareness'
  | 'livelihood'
  | 'tribal-outreach'
  | 'school-college';

export interface Program {
  id: string;
  title: string;
  slug: string;
  category: CategoryType;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  problemAddressed: string;
  objectives: string[];
  locations: string[];
  beneficiaries: string;
  impactMetrics: { label: string; value: string }[];
  image: string;
  galleryImages: string[];
  activities: { title: string; description: string; frequency?: string }[];
  featured?: boolean;
  reports?: { title: string; fileUrl: string; size: string }[];
  relatedStoryId?: string;
}

export interface ProgramLocation {
  id: string;
  name: string;
  state: string;
  district: string;
  coordinates: { lat: number; lng: number };
  activeSince: string;
  productionCentresCount: number;
  villagesCovered: number;
  womenReached: number;
  activePrograms: string[]; // program IDs
  leadContact?: string;
  description: string;
  image: string;
  activitiesList: string[];
}

export interface ImpactStatistic {
  id: string;
  value: number;
  suffix: string;
  label: string;
  description: string;
  category: string;
  iconName: string;
}

export interface ImpactStory {
  id: string;
  title: string;
  beneficiaryName: string;
  age?: number;
  location: string;
  programName: string;
  quote: string;
  summary: string;
  story?: string;
  fullStory: string;
  impactSummary: string;
  impactResult?: string;
  category?: string;
  image: string;
  beforeAfter?: { before: string; after: string };
  date: string;
  author?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  designation: string;
  organization?: string;
  location: string;
  avatar: string;
  content: string;
  category: 'beneficiary' | 'volunteer' | 'partner' | 'educator' | 'fellows' | 'student' | 'artisan' | 'tribal-elder' | 'fellow';
  featured?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  caption: string;
  category: 'workshops' | 'production' | 'field' | 'events' | 'community' | 'tribal' | 'fellowship' | 'video' | 'workshop';
  imageUrl?: string;
  url: string;
  type: 'image' | 'video';
  videoUrl?: string;
  location: string;
  date: string;
  programSlug?: string;
}

export interface VideoItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  videoUrl: string;
  thumbnailUrl: string;
  category: 'documentary' | 'interview' | 'workshop' | 'impact';
  date: string;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  category: 'cloth-pads' | 'kits' | 'accessories';
  price: number;
  sponsorPrice?: number;
  description: string;
  impactStatement: string;
  features: string[];
  layersTech?: string[];
  usageGuide: string[];
  sustainabilityScore: string;
  inStock: boolean;
  images: string[];
  badge?: string;
  contents?: string[];
}

export interface TrainingProgram {
  id: string;
  title: string;
  category: 'training';
  targetAudience: string;
  duration: string;
  format: 'Offline / On-ground' | 'Hybrid' | 'Online Workshops';
  eligibility: string;
  description: string;
  curriculum: string[];
  outcomes: string[];
  nextBatchDate?: string;
  image: string;
}

export interface Workshop {
  id: string;
  title: string;
  category: 'workshops';
  clientType: 'Schools & Colleges' | 'Corporate CSR' | 'Rural SHGs' | 'Community Centers';
  duration: string;
  locationType: 'On-site / Pan-India' | 'Virtual';
  description: string;
  keyTopics: string[];
  outcomes: string[];
  image: string;
  upcomingDates?: string[];
}

export interface ConsultancyService {
  id: string;
  title: string;
  category: 'consultancy';
  targetClients: string;
  description: string;
  offerings: string[];
  deliverables: string[];
  image: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  category: 'article' | 'faq' | 'iec' | 'report' | 'research' | 'school-toolkit' | 'iec-material' | 'research-paper' | 'guidebook';
  slug: string;
  summary: string;
  content?: string;
  author?: string;
  date: string;
  readTime?: string;
  fileSize: string;
  fileFormat: string;
  downloadUrl?: string;
  language: string;
  topics: string[];
  tags: string[];
  thumbnail: string;
  image?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'menstrual-health' | 'cloth-pads' | 'donation' | 'volunteering';
}

export interface EventItem {
  id: string;
  title: string;
  type: 'Workshop' | 'Fellowship Camp' | 'Webinar' | 'Awareness Drive' | 'Fundraiser';
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  registrationOpen: boolean;
  seatsLeft?: number;
  eligibility: string;
  description: string;
  image: string;
}

export interface NewsItem {
  id: string;
  title: string;
  type: 'news' | 'press' | 'media';
  date: string;
  source?: string;
  summary: string;
  content: string;
  externalLink?: string;
  image: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  category: 'board' | 'advisory' | 'leadership' | 'core' | 'fellows';
  education: string;
  bio: string;
  image: string;
  linkedin?: string;
  email?: string;
  isPlaceholder?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  type: 'CSR' | 'Institutional' | 'Government' | 'Academic' | 'NGO';
  logo: string;
  description: string;
  partnershipYear: string;
}

export interface Award {
  id: string;
  year: string;
  title: string;
  awardingBody: string;
  description: string;
  image?: string;
}

export interface TransparencyDoc {
  id: string;
  title: string;
  category: 'annual-report' | 'financial' | 'audit' | 'policy' | 'certificate';
  year?: string;
  description: string;
  fileSize: string;
  fileUrl: string;
  verifiedDate: string;
}
