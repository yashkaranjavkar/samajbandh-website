/**
 * ============================================================
 *  SITE LAYOUT — one place to control every section of every page
 * ============================================================
 *
 *  HOW TO USE
 *  - Hide a section:     change  show: true  to  show: false
 *  - Show it again:      change it back to  show: true
 *  - Reorder a page:     move the whole line up or down in that page's list
 *
 *  RULES
 *  - Do NOT rename an `id`. Each id is wired to a block in the page file.
 *  - `label` is only a note for you; changing it does not change the website.
 *  - Deleting a line hides that section too, but `show: false` is safer
 *    because it keeps the line around so you can turn it back on later.
 *
 *  After saving, the dev server (`npm run dev`) updates the site immediately.
 *  For the live server, run `npm run build` and restart `npm start`.
 */

export interface SectionConfig {
  id: string;
  label: string;
  show: boolean;
}

export const SITE_LAYOUT = {
  // Shown on every page
  global: [
    { id: 'topBar', label: 'Thin dark bar above the menu (NGO status, helpline)', show: true },
    { id: 'header', label: 'Main menu with logo, links and Donate button', show: true },
    { id: 'footer', label: 'Footer with links, newsletter and contact details', show: true },
  ],

  // Page: /  (Home)
  home: [
    { id: 'hero', label: 'Hero photo slideshow (3 slides)', show: true },
    { id: 'storiesStrip', label: 'Scrolling strip of photo story cards', show: true },
    { id: 'challengeVision', label: 'The root challenge + Vision & Mission', show: true },
    { id: 'impactNumbers', label: 'Impact numbers (counters)', show: true },
    { id: 'programs', label: 'Signature programs cards', show: true },
    { id: 'map', label: 'Interactive “Where we work” map', show: true },
    { id: 'featuredInitiative', label: 'Featured initiative spotlight', show: true },
    { id: 'productsPreview', label: 'Products & services preview', show: true },
    { id: 'latestNews', label: 'Latest updates / news', show: true },
    { id: 'upcomingEvents', label: 'Upcoming opportunities & workshops', show: true },
    { id: 'partnersAwards', label: 'Partners & awards', show: true },
    { id: 'joinForm', label: 'Join the movement form', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band (Donate / Volunteer)', show: true },
  ],

  // Page: /about
  about: [
    { id: 'founderStory', label: 'Genesis & founder story (with founder photo)', show: true },
    { id: 'visionMission', label: 'Vision, mission & core values', show: true },
    { id: 'theoryOfChange', label: 'Theory of change', show: true },
    { id: 'timeline', label: 'Milestones timeline', show: true },
    { id: 'organogram', label: 'Governance structure / organogram', show: true },
    { id: 'compliance', label: 'Statutory compliance & annual reports', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /our-work
  ourWork: [
    { id: 'hero', label: 'Page banner', show: true },
    { id: 'filters', label: 'Program category tabs & search', show: true },
    { id: 'programsGrid', label: 'Programs grid', show: true },
    { id: 'districtFootprint', label: 'District footprint breakdown', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /products-services
  productsServices: [
    { id: 'hero', label: 'Asha cloth pad spotlight', show: true },
    { id: 'padLayers', label: 'Pad layers diagram', show: true },
    { id: 'washingGuide', label: 'Washing, care & drying guide', show: true },
    { id: 'productsCatalog', label: 'All products & kits', show: true },
    { id: 'workshopsTraining', label: 'Workshops & training services', show: true },
    { id: 'manufacturing', label: 'Decentralized manufacturing & fair wages', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Pages: /impact  and  /impact-stories  (same page)
  impactStories: [
    { id: 'hero', label: 'Impact dashboard banner', show: true },
    { id: 'beforeAfter', label: 'Before vs after indicators', show: true },
    { id: 'caseStudies', label: 'In-depth case studies', show: true },
    { id: 'testimonials', label: 'Testimonials slider & voices', show: true },
    { id: 'documentary', label: 'Field documentary video', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /transparency
  // Note: if you hide `tabs`, visitors only see the first tab (financials).
  transparency: [
    { id: 'hero', label: 'Page banner', show: true },
    { id: 'tabs', label: 'Tab buttons (Financials / Certifications / ...)', show: true },
    { id: 'financials', label: 'Financials tab content', show: true },
    { id: 'certifications', label: 'Certifications tab content', show: true },
    { id: 'safeguarding', label: 'Safeguarding & policies tab content', show: true },
    { id: 'fundUtilization', label: 'Fund utilization tab content', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /policies
  policies: [
    { id: 'hero', label: 'Page banner', show: true },
    { id: 'tabs', label: 'Policy tab buttons', show: true },
    { id: 'content', label: 'Selected policy text', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /resources
  resources: [
    { id: 'hero', label: 'Knowledge hub banner', show: true },
    { id: 'filters', label: 'Search & filter bar', show: true },
    { id: 'resourcesGrid', label: 'Resources grid', show: true },
    { id: 'mythBustingFaq', label: 'Menstrual myth-busting FAQ', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /get-involved
  getInvolved: [
    { id: 'hero', label: 'Page banner', show: true },
    { id: 'pathways', label: 'Ways to engage (tabs)', show: true },
    { id: 'applicationForm', label: 'Volunteer / internship application form', show: true },
    { id: 'faq', label: 'Volunteering & internship FAQ', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /news-events
  newsEvents: [
    { id: 'hero', label: 'Page banner', show: true },
    { id: 'filters', label: 'Filter & search bar', show: true },
    { id: 'upcomingEvents', label: 'Upcoming events', show: true },
    { id: 'news', label: 'News & press coverage', show: true },
    { id: 'mediaInquiries', label: 'Media kit & press inquiries banner', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /gallery
  gallery: [
    { id: 'hero', label: 'Page banner', show: true },
    { id: 'filters', label: 'Category filter buttons', show: true },
    { id: 'grid', label: 'Photo & video grid', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /contact
  contact: [
    { id: 'hero', label: 'Page banner', show: true },
    { id: 'officeHubs', label: 'Contact details & office hubs', show: true },
    { id: 'contactForm', label: 'Contact form & map', show: true },
    { id: 'bottomCta', label: 'Bottom call-to-action band', show: true },
  ],

  // Page: /admin  (internal dashboard)
  admin: [
    { id: 'header', label: 'Dashboard header & export buttons', show: true },
    { id: 'metrics', label: 'Metrics bar', show: true },
    { id: 'tabNav', label: 'Tab buttons', show: true },
    { id: 'volunteersTab', label: 'Volunteers database tab', show: true },
    { id: 'donationsTab', label: 'Donations & 80G receipts tab', show: true },
    { id: 'contactsTab', label: 'Contacts & bulk orders tab', show: true },
    { id: 'mediaTab', label: 'Media & documents manager tab', show: true },
    { id: 'systemTab', label: 'Database & system tab', show: true },
  ],
} satisfies Record<string, SectionConfig[]>;

export type PageKey = keyof typeof SITE_LAYOUT;

export function isSectionVisible(page: PageKey, id: string): boolean {
  return SITE_LAYOUT[page].some(s => s.id === id && s.show);
}
