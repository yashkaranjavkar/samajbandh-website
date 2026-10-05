import fs from 'fs';
import path from 'path';

export interface VolunteerRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  collegeOrOrg?: string;
  roleType: 'volunteer' | 'intern' | 'fellow' | 'donate-cloth' | 'csr';
  duration: string;
  startDate?: string;
  endDate?: string;
  mode?: 'on-ground' | 'hybrid' | 'remote';
  commitmentHours?: string;
  domains: string[];
  message?: string;
  status: 'pending' | 'reviewed' | 'approved' | 'contacted' | 'completed';
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DonationRecord {
  id: string;
  amount: number;
  type: 'one-time' | 'monthly';
  fullName: string;
  email: string;
  phone: string;
  panNumber?: string;
  address?: string;
  is80GRequired: boolean;
  purpose?: string;
  transactionId?: string;
  status: 'completed' | 'pending' | 'failed';
  receiptNumber: string;
  createdAt: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  organization?: string;
  message: string;
  status: 'new' | 'responded' | 'archived';
  createdAt: string;
}

export interface BulkOrderRecord {
  id: string;
  product: string;
  quantity: number;
  name: string;
  organization: string;
  email: string;
  phone: string;
  deliveryAddress: string;
  notes?: string;
  status: 'inquiry' | 'quoted' | 'confirmed' | 'dispatched' | 'fulfilled';
  createdAt: string;
}

export interface EventRegistrationRecord {
  id: string;
  eventId: string;
  eventTitle: string;
  name: string;
  email: string;
  phone: string;
  organization?: string;
  notes?: string;
  createdAt: string;
}

export interface MediaAssetRecord {
  id: string;
  section: string;
  key: string;
  title: string;
  description?: string;
  url: string;
  docUrl?: string;
  category: 'hero' | 'program' | 'product' | 'team' | 'gallery' | 'document';
  updatedAt: string;
}

interface DatabaseSchema {
  volunteers: VolunteerRecord[];
  donations: DonationRecord[];
  contacts: ContactRecord[];
  bulkOrders: BulkOrderRecord[];
  eventRegistrations: EventRegistrationRecord[];
  newsletter: { id: string; email: string; subscribedAt: string }[];
  mediaAssets: MediaAssetRecord[];
  settings: Record<string, any>;
}

// Initial Seed Data for immediate testing
const INITIAL_DB: DatabaseSchema = {
  volunteers: [
    {
      id: 'vol-101',
      name: 'Snehal Deshmukh',
      email: 'snehal.deshmukh@gmail.com',
      phone: '+91 98220 54321',
      city: 'Pune',
      collegeOrOrg: 'Karve Institute of Social Service (MSW)',
      roleType: 'intern',
      duration: '1 Month Structured Immersion',
      startDate: '2026-09-01',
      endDate: '2026-09-30',
      mode: 'on-ground',
      commitmentHours: 'full-time',
      domains: ['School & Community Workshops', 'Public Health Research & Baseline Surveys'],
      message: 'MSW 2nd year student wishing to conduct fieldwork in Junnar and analyze menstrual taboos.',
      status: 'approved',
      adminNotes: 'Assigned to Junnar cluster coordinator Dr. Patil.',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'vol-102',
      name: 'Aditya Kulkarni',
      email: 'aditya.k@outlook.com',
      phone: '+91 94230 11223',
      city: 'Mumbai',
      collegeOrOrg: 'TISS Mumbai',
      roleType: 'volunteer',
      duration: '1 Week Intensive Sprint',
      startDate: '2026-09-10',
      endDate: '2026-09-17',
      mode: 'hybrid',
      commitmentHours: 'weekend',
      domains: ['Social Media, Photography & Film', 'Marathi / Hindi Educational Translation'],
      message: 'Documentary filmmaker and writer available for weekend field drives in Gadchiroli.',
      status: 'contacted',
      adminNotes: 'Connected via telephonic interview on 18th.',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'vol-103',
      name: 'Dr. Pooja Waghmare',
      email: 'pooja.w@health.gov.in',
      phone: '+91 97654 88990',
      city: 'Nashik',
      collegeOrOrg: 'Nashik Civil Hospital',
      roleType: 'fellow',
      duration: '6 Months Full-Time Fellowship',
      mode: 'on-ground',
      commitmentHours: 'full-time',
      domains: ['Tribal Rest Shed (Kurma) Reforms', 'School & Community Workshops'],
      message: 'Medical graduate applying for the 2026 Arogya Samwadak Fellowship in Bhamragad tribal belt.',
      status: 'pending',
      adminNotes: 'Panel interview scheduled for coming Saturday.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }
  ],
  donations: [
    {
      id: 'don-501',
      amount: 5000,
      type: 'one-time',
      fullName: 'Rahul S. Shinde',
      email: 'rahul.shinde@tcs.com',
      phone: '+91 98811 23456',
      panNumber: 'ABCPS1234F',
      address: 'Kothrud, Pune, Maharashtra',
      is80GRequired: true,
      purpose: 'Sponsor 5 Tribal Women with Asha Pads for 3 Years',
      transactionId: 'TXN_SB_8874129',
      status: 'completed',
      receiptNumber: 'SB-80G-2026-0412',
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'don-502',
      amount: 15000,
      type: 'one-time',
      fullName: 'Sunita Patil Foundation',
      email: 'csr@patiltrust.org',
      phone: '+91 98223 99881',
      panNumber: 'AABTS9901M',
      address: 'Shivajinagar, Pune',
      is80GRequired: true,
      purpose: 'Establishment of SHG Micro-Production Unit in Junnar',
      transactionId: 'TXN_SB_9918234',
      status: 'completed',
      receiptNumber: 'SB-80G-2026-0413',
      createdAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  contacts: [
    {
      id: 'cnt-301',
      name: 'Meera Kadam',
      email: 'meera.k@rotarypune.org',
      phone: '+91 98221 00998',
      organization: 'Rotary Club of Pune Central',
      subject: 'School Awareness Camp Partnership',
      message: 'We would like to collaborate with Samajbandh for 10 ZP schools in Haveli Taluka next month.',
      status: 'new',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  bulkOrders: [
    {
      id: 'ord-201',
      product: 'Asha Reusable Cloth Pads (Pack of 4)',
      quantity: 500,
      name: 'Vikas Deshpande',
      organization: 'Gramin Vikas Pratishthan',
      email: 'vikas@gvp.org',
      phone: '+91 94220 88776',
      deliveryAddress: 'At Post Bhamragad, Gadchiroli, Maharashtra - 442710',
      notes: 'For distribution during monsoon health outreach drive.',
      status: 'quoted',
      createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
    }
  ],
  eventRegistrations: [],
  newsletter: [
    { id: 'nl-1', email: 'supporter1@gmail.com', subscribedAt: new Date().toISOString() },
    { id: 'nl-2', email: 'advocate.pune@yahoo.com', subscribedAt: new Date().toISOString() }
  ],
  mediaAssets: [
    {
      id: 'media-hero-1',
      section: 'Hero Banner',
      key: 'hero_main',
      title: 'Women Artisans at Pune Micro-Center',
      url: '/images/fellowship/arogya-samwadak-session.jpg',
      category: 'hero',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'media-pad-1',
      section: 'Products & Kits',
      key: 'asha_pad_box',
      title: 'Asha 4-Layer Zero Plastic Pad Kit',
      url: '/images/products/asha-menstrual-kit.jpg',
      category: 'product',
      updatedAt: new Date().toISOString()
    }
  ],
  settings: {
    siteName: 'Samajbandh - Menstrual Dignity Movement',
    helpline: '+91 98765 43210',
    email: 'info@samajbandh.org',
    address: 'Sadashiv Peth, Pune, Maharashtra 411030',
    taxExemption80G: 'CIT(E)/80G/2021-22/A/1042',
    csrRegistration: 'CSR00049219'
  }
};

const EMPTY_DB: DatabaseSchema = {
  volunteers: [],
  donations: [],
  contacts: [],
  bulkOrders: [],
  eventRegistrations: [],
  newsletter: [],
  mediaAssets: [],
  settings: {}
};

class DatabaseService {
  private dbPath: string;
  private data: DatabaseSchema;

  constructor() {
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch {
        // Fallback for restricted filesystems
      }
    }
    this.dbPath = path.join(dataDir, 'samajbandh_db.json');
    this.data = this.loadData();
  }

  private loadData(): DatabaseSchema {
    try {
      if (fs.existsSync(this.dbPath)) {
        const raw = fs.readFileSync(this.dbPath, 'utf-8');
        // Merge over an empty schema so older db files missing newer collections still load
        return { ...structuredClone(EMPTY_DB), ...JSON.parse(raw) };
      }
    } catch (err) {
      console.warn('[DB] Could not read db file, loading initial memory store:', err);
    }
    this.saveData(INITIAL_DB);
    return INITIAL_DB;
  }

  private saveData(data: DatabaseSchema) {
    this.data = data;
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.warn('[DB] Memory fallback, could not write to disk:', err);
    }
  }

  // --- VOLUNTEER & INTERN OPERATIONS ---
  public getVolunteers(filter?: { roleType?: string; status?: string; search?: string }): VolunteerRecord[] {
    let list = [...this.data.volunteers];
    if (filter?.roleType && filter.roleType !== 'all') {
      list = list.filter(v => v.roleType === filter.roleType);
    }
    if (filter?.status && filter.status !== 'all') {
      list = list.filter(v => v.status === filter.status);
    }
    if (filter?.search) {
      const q = filter.search.toLowerCase();
      list = list.filter(v => 
        v.name.toLowerCase().includes(q) || 
        v.email.toLowerCase().includes(q) || 
        v.city.toLowerCase().includes(q) ||
        (v.collegeOrOrg && v.collegeOrOrg.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addVolunteer(record: Omit<VolunteerRecord, 'id' | 'status' | 'createdAt' | 'updatedAt'>): VolunteerRecord {
    const newRecord: VolunteerRecord = {
      ...record,
      id: `vol-${Date.now().toString().slice(-6)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.data.volunteers.unshift(newRecord);
    this.saveData(this.data);
    return newRecord;
  }

  public updateVolunteer(id: string, updates: Partial<VolunteerRecord>): VolunteerRecord | null {
    const idx = this.data.volunteers.findIndex(v => v.id === id);
    if (idx === -1) return null;
    this.data.volunteers[idx] = {
      ...this.data.volunteers[idx],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    this.saveData(this.data);
    return this.data.volunteers[idx];
  }

  public deleteVolunteer(id: string): boolean {
    const initLen = this.data.volunteers.length;
    this.data.volunteers = this.data.volunteers.filter(v => v.id !== id);
    if (this.data.volunteers.length !== initLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- DONATIONS OPERATIONS ---
  public getDonations(): DonationRecord[] {
    return [...this.data.donations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addDonation(record: Omit<DonationRecord, 'id' | 'status' | 'receiptNumber' | 'transactionId' | 'createdAt'>): DonationRecord {
    const newRecord: DonationRecord = {
      ...record,
      id: `don-${Date.now().toString().slice(-6)}`,
      transactionId: `TXN_SB_${Date.now().toString().slice(-7)}`,
      status: 'completed',
      receiptNumber: `SB-80G-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString()
    };
    this.data.donations.unshift(newRecord);
    this.saveData(this.data);
    return newRecord;
  }

  // --- CONTACTS OPERATIONS ---
  public getContacts(): ContactRecord[] {
    return [...this.data.contacts].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addContact(record: Omit<ContactRecord, 'id' | 'status' | 'createdAt'>): ContactRecord {
    const newRecord: ContactRecord = {
      ...record,
      id: `cnt-${Date.now().toString().slice(-6)}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    this.data.contacts.unshift(newRecord);
    this.saveData(this.data);
    return newRecord;
  }

  public updateContactStatus(id: string, status: 'new' | 'responded' | 'archived'): boolean {
    const item = this.data.contacts.find(c => c.id === id);
    if (item) {
      item.status = status;
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- BULK ORDERS OPERATIONS ---
  public getBulkOrders(): BulkOrderRecord[] {
    return [...this.data.bulkOrders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addBulkOrder(record: Omit<BulkOrderRecord, 'id' | 'status' | 'createdAt'>): BulkOrderRecord {
    const newRecord: BulkOrderRecord = {
      ...record,
      id: `ord-${Date.now().toString().slice(-6)}`,
      status: 'inquiry',
      createdAt: new Date().toISOString()
    };
    this.data.bulkOrders.unshift(newRecord);
    this.saveData(this.data);
    return newRecord;
  }

  public updateBulkOrderStatus(id: string, status: BulkOrderRecord['status']): boolean {
    const item = this.data.bulkOrders.find(o => o.id === id);
    if (item) {
      item.status = status;
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- EVENT REGISTRATION OPERATIONS ---
  public getEventRegistrations(): EventRegistrationRecord[] {
    return [...this.data.eventRegistrations].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addEventRegistration(record: Omit<EventRegistrationRecord, 'id' | 'createdAt'>): EventRegistrationRecord {
    const newRecord: EventRegistrationRecord = {
      ...record,
      id: `evt-${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };
    this.data.eventRegistrations.unshift(newRecord);
    this.saveData(this.data);
    return newRecord;
  }

  // --- MEDIA ASSETS OPERATIONS ---
  public getMediaAssets(): MediaAssetRecord[] {
    return [...this.data.mediaAssets];
  }

  public upsertMediaAsset(asset: MediaAssetRecord): MediaAssetRecord {
    const idx = this.data.mediaAssets.findIndex(m => m.id === asset.id || m.key === asset.key);
    if (idx !== -1) {
      this.data.mediaAssets[idx] = { ...asset, updatedAt: new Date().toISOString() };
    } else {
      this.data.mediaAssets.push({ ...asset, updatedAt: new Date().toISOString() });
    }
    this.saveData(this.data);
    return asset;
  }

  // --- NEWSLETTER OPERATIONS ---
  public addNewsletter(email: string): boolean {
    if (!this.data.newsletter.some(n => n.email.toLowerCase() === email.toLowerCase())) {
      this.data.newsletter.push({
        id: `nl-${Date.now().toString().slice(-6)}`,
        email,
        subscribedAt: new Date().toISOString()
      });
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- OVERVIEW STATS ---
  public getOverviewStats() {
    const totalVolunteers = this.data.volunteers.length;
    const pendingVolunteers = this.data.volunteers.filter(v => v.status === 'pending').length;
    const activeInterns = this.data.volunteers.filter(v => v.roleType === 'intern').length;
    const totalDonated = this.data.donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    const newContacts = this.data.contacts.filter(c => c.status === 'new').length;
    const pendingOrders = this.data.bulkOrders.filter(o => o.status === 'inquiry' || o.status === 'quoted').length;

    return {
      totalVolunteers,
      pendingVolunteers,
      activeInterns,
      totalDonated,
      newContacts,
      pendingOrders,
      lastUpdated: new Date().toISOString()
    };
  }

  // Full backup
  public getFullBackup(): DatabaseSchema {
    return this.data;
  }
}

export const db = new DatabaseService();
