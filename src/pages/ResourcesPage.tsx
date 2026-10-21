import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { LightboxModal } from '../components/modals/LightboxModal';
import { RESOURCES_DATA } from '../data/mockData';
import { ResourceItem } from '../types';
import { 
  BookOpen, 
  Download, 
  Search, 
  FileText, 
  Globe, 
  Sparkles, 
  CheckCircle2, 
  Eye, 
  HelpCircle,
  Video,
  Layers,
  Filter
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface ResourcesPageProps {
  onOpenDonate: () => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onOpenDonate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('all');
  const [lightboxMedia, setLightboxMedia] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'All Knowledge (9)' },
    { id: 'school-toolkit', label: 'School & Educator Kits' },
    { id: 'iec-material', label: 'IEC Posters & Infographics' },
    { id: 'research-paper', label: 'Research & White Papers' },
    { id: 'guidebook', label: 'Community Guides & FAQs' }
  ];

  const filteredResources = RESOURCES_DATA.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesLang = selectedLanguage === 'all' || item.language.toLowerCase().includes(selectedLanguage.toLowerCase());
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.topics.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesLang && matchesSearch;
  });

  const handleDownload = (res: ResourceItem) => {
    alert(`Downloading "${res.title}" (${res.fileFormat} • ${res.fileSize})...\n\nThis material is published under Creative Commons (CC-BY-NC) for free educational use.`);
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="resources"
        sections={{
          // 10.1 HERO KNOWLEDGE HUB BANNER
          hero: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Knowledge Hub Hero">
              <div className="bg-[#143D2B] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-emerald-800">
                <div className="max-w-3xl space-y-6 relative z-10">
                  <span className="text-xs uppercase font-bold text-[#D99B26] tracking-widest block">
                    OPEN ACCESS KNOWLEDGE REPOSITORY
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heading font-extrabold text-white leading-tight">
                    Learn With Samajbandh: Free Pedagogical & Research Toolkits
                  </h1>
                  <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
                    Demystifying biological taboos through peer-reviewed research, culturally contextualized Marathi and Hindi posters, and ready-to-use classroom modules for educators and health workers.
                  </p>

                  <div className="flex flex-wrap gap-2 pt-2 text-xs">
                    <span className="bg-white/10 px-3 py-1 rounded-full text-emerald-200">Open-Access (CC-BY-NC)</span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-emerald-200">Marathi • Hindi • English</span>
                    <span className="bg-white/10 px-3 py-1 rounded-full text-emerald-200">Printable & High-Res</span>
                  </div>
                </div>
              </div>
            </section>
          ),

          // 10.2 SEARCH & MULTI-FILTER BAR
          filters: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Resource Filters">
              <div className="bg-[#FBF9F5] p-6 rounded-3xl border border-[#E5DFC5] space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
                  {/* Search Input */}
                  <div className="md:col-span-6 relative">
                    <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by keyword, topic, or title (e.g. 'cloth care', 'Gaokor', 'school')..."
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E5DFC5] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                    />
                  </div>

                  {/* Language Filter */}
                  <div className="md:col-span-3">
                    <select
                      value={selectedLanguage}
                      onChange={(e) => setSelectedLanguage(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-[#E5DFC5] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                    >
                      <option value="all">All Languages</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="English">English</option>
                    </select>
                  </div>

                  {/* Reset Filter Button */}
                  <div className="md:col-span-3">
                    <button
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedLanguage('all');
                        setActiveCategory('all');
                      }}
                      className="w-full py-2.5 bg-white hover:bg-gray-100 border border-[#E5DFC5] rounded-xl text-xs font-bold text-[#1F2421] transition-colors"
                    >
                      Reset All Filters
                    </button>
                  </div>

                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-[#E5DFC5]/60">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setActiveCategory(cat.id)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeCategory === cat.id
                          ? 'bg-[#143D2B] text-white shadow-xs'
                          : 'bg-white text-[#5C6760] hover:text-[#1F2421] border border-[#E5DFC5]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ),

          // 10.3 RESOURCES GRID
          resourcesGrid: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Resources Grid">
              {filteredResources.length === 0 ? (
                <div className="text-center py-16 bg-[#FBF9F5] rounded-3xl border border-[#E5DFC5] space-y-3">
                  <BookOpen className="w-10 h-10 text-gray-400 mx-auto" />
                  <h4 className="text-base font-bold text-[#1F2421]">No resources matched your search criteria</h4>
                  <p className="text-xs text-[#5C6760]">Try clearing search keywords or choosing "All Languages".</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredResources.map((res) => (
                    <div
                      key={res.id}
                      className="bg-white rounded-3xl overflow-hidden border border-[#E5DFC5] shadow-sm hover:shadow-xl hover:border-[#143D2B]/30 transition-all flex flex-col justify-between group"
                    >
                      <div>
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={res.thumbnail}
                            alt={res.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute top-3 left-3 bg-[#143D2B]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase backdrop-blur-xs">
                            {res.category.replace('-', ' ')}
                          </div>
                          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[#143D2B] font-mono text-[11px] font-bold px-2.5 py-0.5 rounded-md shadow-xs">
                            {res.fileFormat} • {res.fileSize}
                          </div>
                        </div>

                        <div className="p-6 space-y-3">
                          <div className="flex items-center gap-2 text-[11px] text-[#87986A] font-semibold">
                            <Globe className="w-3.5 h-3.5" />
                            <span>{res.language}</span>
                          </div>

                          <h3 className="text-base font-serif-heading font-bold text-[#1F2421] group-hover:text-[#143D2B] transition-colors leading-snug">
                            {res.title}
                          </h3>

                          <p className="text-xs text-[#5C6760] line-clamp-3 leading-relaxed">
                            {res.summary}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {res.topics.map((top, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#FBF9F5] border border-[#E5DFC5] text-[#5C6760]">
                                #{top}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        <div className="pt-4 border-t border-[#E5DFC5] flex items-center justify-between">
                          <button
                            onClick={() => handleDownload(res)}
                            className="flex-1 py-2.5 rounded-xl bg-[#143D2B] hover:bg-[#1E533B] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs"
                          >
                            <Download className="w-3.5 h-3.5" />
                            <span>Download Free ({res.fileSize})</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </section>
          ),

          // 10.4 MENSTRUAL MYTH-BUSTING FAQ SECTION
          mythBustingFaq: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Myth Busting FAQs">
              <div className="bg-[#FBF9F5] rounded-3xl p-8 sm:p-12 border border-[#E5DFC5] space-y-8">
                <SectionHeading
                  eyebrow="Medical Clarifications"
                  title="Frequently Debunked Menstrual Myths"
                  subtitle="Clear, science-backed anatomical explanations addressing prevalent cultural superstitions."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    {
                      myth: 'Myth: "Menstrual blood is impure, dirty, or toxic bodily waste."',
                      fact: 'Fact: Menstrual fluid consists of natural blood, endometrial lining tissue, and cervical mucus. It is completely non-toxic and a biological sign of a functioning reproductive system.'
                    },
                    {
                      myth: 'Myth: "Drying cloth pads under open sunlight is shameful and unhygienic."',
                      fact: 'Fact: Direct ultraviolet (UV) sunlight is nature’s strongest free antibacterial sanitizer. Drying pads hidden in dark, damp spaces breeds fungal infections.'
                    },
                    {
                      myth: 'Myth: "Physical exercise, bathing, or touching plants will harm menstruators."',
                      fact: 'Fact: Warm water baths maintain personal hygiene and relieve cramps. Moderate exercise releases endorphins which actively alleviate menstrual pain.'
                    },
                    {
                      myth: 'Myth: "Cloth pads are outdated and inferior to commercial plastic pads."',
                      fact: 'Fact: Multi-layered, properly washed and sun-dried cotton pads are dermatologically safer than single-use plastic pads containing bleach and perfumes.'
                    }
                  ].map((faq, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white border border-[#E5DFC5] space-y-2">
                      <span className="text-xs font-bold text-rose-700 block">{faq.myth}</span>
                      <p className="text-xs text-[#143D2B] font-medium leading-relaxed">{faq.fact}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ),

          // BOTTOM CTA BAND
          bottomCta: (
            <BottomCTABand onOpenDonate={onOpenDonate} />
          ),
        }}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={!!lightboxMedia}
        onClose={() => setLightboxMedia(null)}
        media={lightboxMedia}
      />

    </div>
  );
};
