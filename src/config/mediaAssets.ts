/**
 * Central Media and Document Assets Registry
 * 
 * Non-Technical Admin Guide:
 * To change an image or document, you can either:
 * 1. Place the new file in `/public/images/...` or `/public/docs/...`
 * 2. Or update the URL in `/public/content/media-config.json`
 * 3. Or use the built-in Admin Panel at `/admin`
 */

export interface MediaItem {
  id: string;
  title: string;
  description?: string;
  url: string;
  localFallback?: string;
  category: 'hero' | 'program' | 'product' | 'team' | 'gallery' | 'document';
}

export interface DocumentItem {
  id: string;
  title: string;
  category: string;
  url: string;
  fileSize: string;
}

export const MEDIA_REGISTRY = {
  hero: {
    main: {
      id: 'hero_main',
      title: 'Arogya Samwadak Grassroots Drive',
      description: 'Women artisans and volunteers leading menstrual health awareness in Junnar and Pune.',
      url: '/images/fellowship/arogya-samwadak-session.jpg',
      localFallback: '/images/fellowship/arogya-samwadak-session.jpg',
      category: 'hero' as const
    },
    tribalShed: {
      id: 'tribal_shed',
      title: 'Gaokor (Kurma Ghar) Reform Project',
      description: 'Tribal women in Gadchiroli accessing dignified and hygienic rest quarters.',
      url: '/images/kurma/community-session-under-tree.jpg',
      localFallback: '/images/kurma/community-session-under-tree.jpg',
      category: 'hero' as const
    },
    schoolWorkshop: {
      id: 'school_workshop',
      title: 'Myth-Busting Workshop in ZP High School',
      description: 'Adolescent girls and boys learning reproductive health biology with anatomical charts.',
      url: '/images/samata-yatra/gender-equality-school.jpg',
      localFallback: '/images/samata-yatra/gender-equality-school.jpg',
      category: 'hero' as const
    }
  },
  products: {
    ashaPadKit: {
      id: 'asha_pad_box',
      title: 'Asha Reusable 4-Layer Cotton Pad Kit',
      description: '100% breathable unbleached cotton pad with leakproof barrier, lasting 3+ years.',
      url: '/images/products/asha-menstrual-kit.jpg',
      localFallback: '/images/products/asha-menstrual-kit.jpg',
      category: 'product' as const
    },
    travelPouch: {
      id: 'travel_pouch',
      title: 'Waterproof Storage & Travel Pouch',
      description: 'Dual-compartment zippered pouch for carrying fresh and used pads safely.',
      url: '/images/products/asha-menstrual-kit.jpg',
      localFallback: '/images/products/asha-menstrual-kit.jpg',
      category: 'product' as const
    }
  },
  documents: {
    annualReport2025: {
      id: 'doc_annual_report_2025',
      title: 'Samajbandh Audited Annual Impact Report 2025-26',
      category: 'Annual Reports',
      url: '/public/docs/transparency/annual_report_2025_26.pdf',
      fileSize: '2.4 MB'
    },
    taxExemption80G: {
      id: 'doc_80g_cert',
      title: 'Income Tax 80G Approval Certificate (CIT(E)/80G/2021-22/A/1042)',
      category: 'Tax Exemptions',
      url: '/public/docs/transparency/80G_certificate_samajbandh.pdf',
      fileSize: '840 KB'
    },
    csr1Filing: {
      id: 'doc_csr1',
      title: 'Ministry of Corporate Affairs CSR-1 Filing (CSR00049219)',
      category: 'CSR Compliance',
      url: '/public/docs/transparency/CSR1_registration.pdf',
      fileSize: '510 KB'
    },
    volunteerHandbook: {
      id: 'doc_vol_handbook',
      title: 'Volunteer & Field Internship Handbook (Guidelines & Code of Conduct)',
      category: 'Volunteers & Interns',
      url: '/public/docs/volunteer/internship_field_handbook.pdf',
      fileSize: '1.8 MB'
    }
  }
};
