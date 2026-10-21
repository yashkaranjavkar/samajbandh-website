import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { NEWS_DATA, EVENTS_DATA } from '../data/mockData';
import { NewsItem, EventItem } from '../types';
import { 
  Calendar, 
  MapPin, 
  Search, 
  FileText, 
  ArrowRight, 
  Newspaper, 
  Sparkles, 
  Download, 
  ExternalLink,
  Users
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface NewsEventsPageProps {
  onOpenDonate: () => void;
  onOpenRegistration: (event: EventItem) => void;
}

export const NewsEventsPage: React.FC<NewsEventsPageProps> = ({
  onOpenDonate,
  onOpenRegistration
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'news' | 'events'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNews = NEWS_DATA.filter(n => 
    searchQuery === '' || 
    n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    n.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEvents = EVENTS_DATA.filter(e =>
    searchQuery === '' ||
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="newsEvents"
        sections={{
          // 12.1 HERO HEADER
          hero: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="News and Events Hero">
              <div className="bg-[#143D2B] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-emerald-800">
                <div className="max-w-3xl space-y-6 relative z-10">
                  <span className="text-xs uppercase font-bold text-[#D99B26] tracking-widest block">
                    DISPATCHES & SCHEDULES
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heading font-extrabold text-white leading-tight">
                    News, Press Releases & Upcoming Field Events
                  </h1>
                  <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
                    Stay connected with policy milestones, grassroots field breakthroughs, media coverage, and upcoming MHM masterclasses across Maharashtra.
                  </p>
                </div>
              </div>
            </section>
          ),

          // 12.2 FILTER & SEARCH BAR
          filters: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="News and Events Filter">
              <div className="bg-[#FBF9F5] p-6 rounded-3xl border border-[#E5DFC5] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'all'
                        ? 'bg-[#143D2B] text-white shadow-xs'
                        : 'bg-white text-[#5C6760] border border-[#E5DFC5]'
                    }`}
                  >
                    All Updates ({NEWS_DATA.length + EVENTS_DATA.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('events')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'events'
                        ? 'bg-[#143D2B] text-white shadow-xs'
                        : 'bg-white text-[#5C6760] border border-[#E5DFC5]'
                    }`}
                  >
                    Upcoming Events ({EVENTS_DATA.length})
                  </button>
                  <button
                    onClick={() => setActiveTab('news')}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeTab === 'news'
                        ? 'bg-[#143D2B] text-white shadow-xs'
                        : 'bg-white text-[#5C6760] border border-[#E5DFC5]'
                    }`}
                  >
                    Press & News ({NEWS_DATA.length})
                  </button>
                </div>

                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search news or events..."
                    className="w-full pl-9 pr-3 py-2 bg-white border border-[#E5DFC5] rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                  />
                </div>

              </div>
            </section>
          ),

          // 12.3 UPCOMING EVENTS SECTION
          upcomingEvents:
            (activeTab === 'all' || activeTab === 'events') && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Upcoming Events">
                <SectionHeading
                  eyebrow="Calendar & Schedules"
                  title="Upcoming Workshops, Camps & Webinars"
                  subtitle="Register for public educational workshops, fellowship selection camps, and master training sessions."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="bg-white rounded-3xl overflow-hidden border border-[#E5DFC5] shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
                    >
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#143D2B]/10 text-[#143D2B]">
                            {ev.type}
                          </span>
                          <span className="text-xs text-[#C85A32] font-bold flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {ev.date.split('(')[0]}
                          </span>
                        </div>

                        <h3 className="text-lg font-serif-heading font-bold text-[#1F2421]">
                          {ev.title}
                        </h3>

                        <p className="text-xs text-[#5C6760] leading-relaxed">
                          {ev.description}
                        </p>

                        <div className="space-y-1.5 pt-2 border-t border-[#E5DFC5]/60 text-xs text-[#5C6760]">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                            <span>{ev.location}</span>
                          </div>
                          {ev.eligibility && (
                            <div className="text-[11px] text-[#87986A] font-medium">
                              Eligibility: {ev.eligibility}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        <div className="pt-3 border-t border-[#E5DFC5] flex items-center justify-between">
                          <button
                            onClick={() => onOpenRegistration(ev)}
                            className="flex-1 py-2.5 rounded-xl bg-[#143D2B] hover:bg-[#1E533B] text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                          >
                            <span>Register to Participate</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </section>
            ),

          // 12.4 NEWS & PRESS COVERAGE
          news:
            (activeTab === 'all' || activeTab === 'news') && (
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="News Articles">
                <SectionHeading
                  eyebrow="Media & Field Reports"
                  title="Press Dispatches & Coverage"
                  subtitle="Articles, published white papers, and field updates covering our grassroots journey."
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {filteredNews.map((news) => (
                    <div
                      key={news.id}
                      className="bg-white rounded-3xl overflow-hidden border border-[#E5DFC5] shadow-sm hover:shadow-lg transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-52 overflow-hidden">
                          <img
                            src={news.image}
                            alt={news.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 bg-[#143D2B]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase">
                            {news.type}
                          </div>
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-2 text-[11px] text-[#87986A] font-semibold">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{news.date}</span>
                            {news.source && <span>• {news.source}</span>}
                          </div>

                          <h3 className="text-base font-serif-heading font-bold text-[#1F2421] group-hover:text-[#143D2B] leading-snug">
                            {news.title}
                          </h3>

                          <p className="text-xs text-[#5C6760] leading-relaxed line-clamp-4">
                            {news.summary}
                          </p>
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        <div className="pt-3 border-t border-[#E5DFC5] flex items-center justify-between text-xs font-bold text-[#143D2B]">
                          <span>Read Article</span>
                          <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#143D2B]" />
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              </section>
            ),

          // 12.5 MEDIA KIT & PRESS INQUIRIES BANNER
          mediaInquiries: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Media Inquiries">
              <div className="bg-[#F4EFE6] rounded-3xl p-8 sm:p-12 border border-[#E5DFC5] flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase text-[#C85A32]">Media Desk</span>
                  <h3 className="text-xl sm:text-2xl font-serif-heading font-bold text-[#143D2B]">
                    Journalist, Filmmaker or Researcher?
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6760] max-w-xl">
                    Download our high-resolution press kit, spokesperson bios, photo archive permissions, and statistical citations for your reportage.
                  </p>
                </div>

                <button
                  onClick={() => alert('Downloading Samajbandh Media Kit (PDF & High-Res Assets - 14.2 MB)...')}
                  className="px-6 py-3 rounded-xl bg-[#143D2B] hover:bg-[#1E533B] text-white text-xs font-bold flex items-center gap-2 shrink-0 shadow-md"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Official Press Kit (PDF)</span>
                </button>
              </div>
            </section>
          ),

          // BOTTOM CTA BAND
          bottomCta: (
            <BottomCTABand onOpenDonate={onOpenDonate} />
          ),
        }}
      />

    </div>
  );
};
