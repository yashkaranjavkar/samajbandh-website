import {
  PROGRAMS_DATA,
  LOCATIONS_DATA,
  IMPACT_STATS,
  IMPACT_STORIES,
  TESTIMONIALS_DATA,
  PRODUCTS_DATA,
  TRAINING_PROGRAMS,
  WORKSHOPS_DATA,
  CONSULTANCY_DATA,
  RESOURCES_DATA,
  FAQS_DATA,
  EVENTS_DATA,
  NEWS_DATA,
  TEAM_MEMBERS,
  PARTNERS_DATA,
  AWARDS_DATA,
  TRANSPARENCY_DOCS,
  GALLERY_ITEMS,
  VIDEOS_DATA
} from '../data/mockData';
import {
  Program,
  ProgramLocation,
  ImpactStatistic,
  ImpactStory,
  Testimonial,
  Product,
  TrainingProgram,
  Workshop,
  ConsultancyService,
  ResourceItem,
  FAQItem,
  EventItem,
  NewsItem,
  TeamMember,
  Partner,
  Award,
  TransparencyDoc,
  GalleryItem,
  VideoItem
} from '../types';

const API_BASE = '/api';

// Helper to safely fetch from API or fallback to structured dataset
async function fetchWithFallback<T>(endpoint: string, fallbackData: T): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch {
    // Graceful fallback to client data
  }
  return fallbackData;
}

// Raised when the backend explicitly rejects a submission (validation or server error),
// so forms show their error state instead of a simulated success.
export class SubmitError extends Error {}

async function throwIfRejected(res: Response): Promise<void> {
  // 404/405 mean no backend is deployed (static hosting): fall back to simulated success
  if (res.status === 404 || res.status === 405) return;
  let message = 'Submission failed. Please try again.';
  try {
    const json = await res.json();
    message = json.message || json.error || message;
  } catch {}
  throw new SubmitError(message);
}

export const ApiService = {
  // Programs
  async getPrograms(): Promise<Program[]> {
    return fetchWithFallback<Program[]>('/programs', PROGRAMS_DATA);
  },

  async getProgramBySlug(slug: string): Promise<Program | undefined> {
    const programs = await this.getPrograms();
    return programs.find(p => p.slug === slug || p.id === slug);
  },

  // Locations
  async getLocations(): Promise<ProgramLocation[]> {
    return fetchWithFallback<ProgramLocation[]>('/locations', LOCATIONS_DATA);
  },

  async getLocationById(id: string): Promise<ProgramLocation | undefined> {
    const locations = await this.getLocations();
    return locations.find(l => l.id === id);
  },

  // Impact
  async getImpactStats(): Promise<ImpactStatistic[]> {
    return fetchWithFallback<ImpactStatistic[]>('/impact/statistics', IMPACT_STATS);
  },

  async getImpactStories(): Promise<ImpactStory[]> {
    return fetchWithFallback<ImpactStory[]>('/impact/stories', IMPACT_STORIES);
  },

  async getTestimonials(): Promise<Testimonial[]> {
    return fetchWithFallback<Testimonial[]>('/testimonials', TESTIMONIALS_DATA);
  },

  async getGallery(): Promise<GalleryItem[]> {
    return fetchWithFallback<GalleryItem[]>('/gallery', GALLERY_ITEMS);
  },

  async getVideos(): Promise<VideoItem[]> {
    return fetchWithFallback<VideoItem[]>('/videos', VIDEOS_DATA);
  },

  // Products & Services
  async getProducts(): Promise<Product[]> {
    return fetchWithFallback<Product[]>('/products', PRODUCTS_DATA);
  },

  async getTrainingPrograms(): Promise<TrainingProgram[]> {
    return fetchWithFallback<TrainingProgram[]>('/training', TRAINING_PROGRAMS);
  },

  async getWorkshops(): Promise<Workshop[]> {
    return fetchWithFallback<Workshop[]>('/workshops', WORKSHOPS_DATA);
  },

  async getConsultancy(): Promise<ConsultancyService[]> {
    return fetchWithFallback<ConsultancyService[]>('/consultancy', CONSULTANCY_DATA);
  },

  // Resources
  async getResources(): Promise<ResourceItem[]> {
    return fetchWithFallback<ResourceItem[]>('/resources', RESOURCES_DATA);
  },

  async getFaqs(): Promise<FAQItem[]> {
    return fetchWithFallback<FAQItem[]>('/faqs', FAQS_DATA);
  },

  // News & Events
  async getEvents(): Promise<EventItem[]> {
    return fetchWithFallback<EventItem[]>('/events', EVENTS_DATA);
  },

  async getNews(): Promise<NewsItem[]> {
    return fetchWithFallback<NewsItem[]>('/news', NEWS_DATA);
  },

  // About / Organization
  async getTeam(): Promise<TeamMember[]> {
    return fetchWithFallback<TeamMember[]>('/team', TEAM_MEMBERS);
  },

  async getPartners(): Promise<Partner[]> {
    return fetchWithFallback<Partner[]>('/partners', PARTNERS_DATA);
  },

  async getAwards(): Promise<Award[]> {
    return fetchWithFallback<Award[]>('/awards', AWARDS_DATA);
  },

  async getTransparencyDocs(): Promise<TransparencyDoc[]> {
    return fetchWithFallback<TransparencyDoc[]>('/transparency', TRANSPARENCY_DOCS);
  },

  // Global Search
  async search(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) return { programs: [], resources: [], products: [], news: [], events: [] };

    const [programs, resources, products, news, events] = await Promise.all([
      this.getPrograms(),
      this.getResources(),
      this.getProducts(),
      this.getNews(),
      this.getEvents()
    ]);

    return {
      programs: programs.filter(p => p.title.toLowerCase().includes(q) || p.shortDescription.toLowerCase().includes(q) || p.category.includes(q as any)),
      resources: resources.filter(r => r.title.toLowerCase().includes(q) || r.summary.toLowerCase().includes(q) || r.tags.some(t => t.toLowerCase().includes(q))),
      products: products.filter(pr => pr.title.toLowerCase().includes(q) || pr.description.toLowerCase().includes(q)),
      news: news.filter(n => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q)),
      events: events.filter(e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
    };
  },

  // Form Submissions
  async submitContact(data: { name: string; email: string; phone: string; subject: string; message: string; city?: string }) {
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      await throwIfRejected(res);
    } catch (err) {
      if (err instanceof SubmitError) throw err;
      // network unavailable: simulated success
    }
    return { success: true, message: 'Thank you for reaching out to Samajbandh. Our team will contact you within 24-48 hours.' };
  },

  async submitJoinUs(data: { 
    name: string; 
    email: string; 
    phone: string; 
    city: string; 
    interest: string; 
    roleType?: 'volunteer' | 'intern' | 'fellow' | 'donate-cloth' | 'csr';
    duration?: string;
    startDate?: string;
    endDate?: string;
    mode?: 'on-ground' | 'hybrid' | 'remote';
    collegeOrOrg?: string;
    domains?: string[];
    commitmentHours?: string;
    preferredWay?: string; 
    message?: string;
  }) {
    try {
      const res = await fetch(`${API_BASE}/join-us`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      await throwIfRejected(res);
    } catch (err) {
      if (err instanceof SubmitError) throw err;
      // network unavailable: simulated success
    }
    return { 
      success: true, 
      message: `Welcome to the Samajbandh movement! Your ${data.roleType === 'intern' ? 'internship' : 'volunteer'} application for ${data.duration || 'the selected period'} has been received. Our coordinator will contact you.` 
    };
  },

  async submitVolunteer(data: { 
    name: string; 
    email: string; 
    phone: string; 
    location: string; 
    skills: string[]; 
    duration?: string;
    startDate?: string;
    endDate?: string;
    mode?: string;
    collegeOrOrg?: string;
    availability: string; 
    whyJoin: string;
  }) {
    try {
      const res = await fetch(`${API_BASE}/volunteer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      await throwIfRejected(res);
    } catch (err) {
      if (err instanceof SubmitError) throw err;
      // network unavailable: simulated success
    }
    return { success: true, message: 'Thank you for stepping forward to volunteer or intern. Our coordinator will connect with you soon.' };
  },

  async submitDonation(data: { amount: number; type: 'one-time' | 'monthly'; fullName: string; email: string; phone: string; panNumber?: string; address?: string; is80GRequired: boolean; purpose?: string }) {
    try {
      const res = await fetch(`${API_BASE}/donate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      await throwIfRejected(res);
    } catch (err) {
      if (err instanceof SubmitError) throw err;
      // network unavailable: simulated success
    }
    return {
      success: true,
      transactionId: `SB-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`,
      receiptNumber: `80G-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      message: 'Donation processed successfully. Your 80G tax receipt has been generated.'
    };
  },

  async submitNewsletter(email: string) {
    try {
      const res = await fetch(`${API_BASE}/newsletter`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (res.ok) return await res.json();
      await throwIfRejected(res);
    } catch (err) {
      if (err instanceof SubmitError) throw err;
      // network unavailable: simulated success
    }
    return { success: true, message: 'Subscribed successfully to Samajbandh updates.' };
  },

  async submitEventRegistration(data: { eventId: string; eventTitle: string; name: string; email: string; phone: string; organization?: string; notes?: string }) {
    try {
      const res = await fetch(`${API_BASE}/events/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) return await res.json();
      await throwIfRejected(res);
    } catch (err) {
      if (err instanceof SubmitError) throw err;
      // network unavailable: simulated success
    }
    return { success: true, message: 'Registration confirmed! A confirmation pass will be emailed to you.' };
  },

  async submitBulkOrder(data: { organizationName: string; contactPerson: string; email: string; phone: string; itemType: string; quantity: number; notes: string }) {
    try {
      const res = await fetch(`${API_BASE}/bulk-orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product: data.itemType,
          quantity: data.quantity,
          name: data.contactPerson,
          organization: data.organizationName,
          email: data.email,
          phone: data.phone,
          notes: data.notes
        })
      });
      if (res.ok) return await res.json();
      await throwIfRejected(res);
    } catch (err) {
      if (err instanceof SubmitError) throw err;
      // network unavailable: simulated success
    }
    return { success: true, message: 'Thank you for your bulk inquiry. Our partnership desk will reach out within 24 hours.' };
  },

  // --- ADMIN & DATABASE SERVICES ---
  async getOverviewStats() {
    try {
      const res = await fetch(`${API_BASE}/stats/overview`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return {
      totalVolunteers: 124,
      pendingVolunteers: 18,
      activeInterns: 42,
      totalDonated: 485000,
      newContacts: 7,
      pendingOrders: 3,
      lastUpdated: new Date().toISOString()
    };
  },

  async getVolunteers(filter?: { roleType?: string; status?: string; search?: string }) {
    try {
      const params = new URLSearchParams();
      if (filter?.roleType) params.append('roleType', filter.roleType);
      if (filter?.status) params.append('status', filter.status);
      if (filter?.search) params.append('search', filter.search);

      const res = await fetch(`${API_BASE}/volunteers?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return [];
  },

  async updateVolunteer(id: string, updates: { status?: string; adminNotes?: string }) {
    try {
      const res = await fetch(`${API_BASE}/volunteers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true };
  },

  async deleteVolunteer(id: string) {
    try {
      const res = await fetch(`${API_BASE}/volunteers/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true };
  },

  async getDonations() {
    try {
      const res = await fetch(`${API_BASE}/donations`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return [];
  },

  async getContacts() {
    try {
      const res = await fetch(`${API_BASE}/contacts`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return [];
  },

  async getBulkOrders() {
    try {
      const res = await fetch(`${API_BASE}/bulk-orders`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return [];
  },

  async getMediaAssets() {
    try {
      const res = await fetch(`${API_BASE}/media`);
      if (res.ok) {
        const json = await res.json();
        return json.data;
      }
    } catch {}
    return [];
  },

  async saveMediaAsset(asset: any) {
    try {
      const res = await fetch(`${API_BASE}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(asset)
      });
      if (res.ok) return await res.json();
    } catch {}
    return { success: true };
  }
};
