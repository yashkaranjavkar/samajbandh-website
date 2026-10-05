import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { PROGRAMS_DATA } from '../data/mockData';
import { Program } from '../types';
import { 
  Layers, 
  MapPin, 
  Users, 
  Target, 
  CheckCircle2, 
  FileText, 
  Heart, 
  ArrowRight, 
  Sparkles,
  Activity,
  Filter
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface OurWorkPageProps {
  onOpenDonate: () => void;
  onOpenProgramDetail: (program: Program) => void;
}

export const OurWorkPage: React.FC<OurWorkPageProps> = ({
  onOpenDonate,
  onOpenProgramDetail
}) => {
  const [searchParams] = useSearchParams();
  const programParam = searchParams.get('program');
  const categoryParam = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [categoryParam]);

  useEffect(() => {
    if (programParam) {
      const match = PROGRAMS_DATA.find((p) => p.slug === programParam);
      if (match) {
        onOpenProgramDetail(match);
      }
    }
  }, [programParam]);

  const categories = [
    { id: 'all', label: 'All Programs (9)' },
    { id: 'awareness', label: 'Menstrual Literacy' },
    { id: 'fellowship', label: 'Fellowships & Youth' },
    { id: 'livelihood', label: 'Decentralized Production' },
    { id: 'tribal-outreach', label: 'Tribal Gaokor Reforms' },
    { id: 'school-college', label: 'Schools & Colleges' }
  ];

  const filteredPrograms = selectedCategory === 'all'
    ? PROGRAMS_DATA
    : PROGRAMS_DATA.filter((p) => p.category === selectedCategory);

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="ourWork"
        sections={{
          // 7.1 HERO ARCHITECTURE BANNER
          hero: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Our Work Hero">
              <div className="bg-[#143D2B] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-emerald-800">
                <div className="max-w-3xl space-y-6 relative z-10">
                  <span className="text-xs uppercase font-bold text-[#D99B26] tracking-widest block">
                    PROGRAMMATIC ECOSYSTEM
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heading font-extrabold text-white leading-tight">
                    Community-Driven, Scientifically Backed & Scalable Programs
                  </h1>
                  <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
                    We tackle the root causes of menstrual exclusion across three interconnected pillars: <span className="text-[#D99B26] font-semibold">Educate</span> (demystifying biology), <span className="text-[#C85A32] font-semibold">Engage</span> (youth fellows & tribal mediation), and <span className="text-emerald-300 font-semibold">Sustain</span> (women-led cloth pad manufacturing).
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                      <span className="text-xs font-bold text-[#D99B26] uppercase block mb-1">PILLAR 1: EDUCATE</span>
                      <p className="text-xs text-emerald-100">School gender modules, adolescent workshops, and scientific biology guides.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                      <span className="text-xs font-bold text-[#C85A32] uppercase block mb-1">PILLAR 2: ENGAGE</span>
                      <p className="text-xs text-emerald-100">Arogya Samwadak youth champions, tribal elder dialogue, and Gaokor rest shed safety.</p>
                    </div>
                    <div className="p-4 rounded-2xl bg-white/10 border border-white/15">
                      <span className="text-xs font-bold text-emerald-300 uppercase block mb-1">PILLAR 3: SUSTAIN</span>
                      <p className="text-xs text-emerald-100">15 decentralized micro-production centres providing fair artisan livelihoods.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ),

          // 7.2 CATEGORY FILTER TABS & SEARCH
          filters: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Program Filter Tabs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E5DFC5] pb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-[#143D2B]" />
                  <span className="text-xs font-bold uppercase text-[#143D2B] tracking-wider">
                    Filter by Focus Area
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedCategory === cat.id
                          ? 'bg-[#143D2B] text-white shadow-md'
                          : 'bg-[#FBF9F5] text-[#5C6760] hover:text-[#1F2421] border border-[#E5DFC5]'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ),

          // 7.3 DETAILED PROGRAMS GRID
          programsGrid: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Programs Grid">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="bg-white rounded-3xl overflow-hidden border border-[#E5DFC5] shadow-sm hover:shadow-xl hover:border-[#143D2B]/30 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image & Badges */}
                      <div className="relative h-56 overflow-hidden">
                        <img
                          src={program.image}
                          alt={program.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-3 left-3 bg-[#143D2B]/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs">
                          {program.category.replace('-', ' ')}
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-xs px-3 py-1.5 rounded-xl text-white text-xs flex items-center justify-between">
                          <span className="flex items-center gap-1 text-emerald-200">
                            <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                            {program.locations.join(', ')}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 space-y-4">
                        <div>
                          <h3 className="text-xl font-serif-heading font-bold text-[#1F2421] group-hover:text-[#143D2B] transition-colors">
                            {program.title}
                          </h3>
                          <p className="text-xs font-semibold text-[#87986A] mt-0.5">
                            {program.tagline}
                          </p>
                        </div>

                        {/* Impact Stats Banner */}
                        <div className="grid grid-cols-3 gap-2 p-3 bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl text-center">
                          {program.impactMetrics.map((m, idx) => (
                            <div key={idx}>
                              <span className="text-sm font-bold text-[#143D2B] block">{m.value}</span>
                              <span className="text-[10px] text-[#5C6760] font-medium block leading-tight">{m.label}</span>
                            </div>
                          ))}
                        </div>

                        <p className="text-xs text-[#5C6760] leading-relaxed line-clamp-3">
                          {program.shortDescription}
                        </p>

                        {/* Strategic Objectives Preview */}
                        <div className="space-y-1.5 pt-1">
                          {program.objectives.slice(0, 2).map((obj, i) => (
                            <div key={i} className="flex items-start gap-1.5 text-xs text-[#1F2421]">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#143D2B] shrink-0 mt-0.5" />
                              <span className="line-clamp-1">{obj}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer Actions */}
                    <div className="p-6 pt-0 space-y-2">
                      <div className="pt-3 border-t border-[#E5DFC5] flex gap-2">
                        <button
                          onClick={() => onOpenProgramDetail(program)}
                          className="flex-1 py-2.5 px-3 rounded-xl bg-[#143D2B] text-white font-bold text-xs hover:bg-[#1E533B] transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>View Full Dossier</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={onOpenDonate}
                          className="py-2.5 px-3 rounded-xl border border-[#C85A32] text-[#C85A32] hover:bg-[#C85A32]/10 font-bold text-xs transition-colors flex items-center gap-1"
                          title="Sponsor this program"
                        >
                          <Heart className="w-3.5 h-3.5 fill-[#C85A32]" />
                          <span>Sponsor</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            </section>
          ),

          // 7.4 DISTRICT FOOTPRINT BREAKDOWN
          districtFootprint: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="District Footprint">
              <div className="bg-[#FBF9F5] rounded-3xl p-8 sm:p-12 border border-[#E5DFC5] space-y-8">
                <SectionHeading
                  eyebrow="Coverage Scale"
                  title="Geographic Hubs & Field Clusters"
                  subtitle="Explore our decentralized presence across coastal, western, central and eastern tribal Maharashtra."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    { district: 'Pune District & Peri-Urban', units: '4 Production Units', reached: '18,500+ Women Reached', focus: 'State Coordination & School Samata' },
                    { district: 'Gadchiroli Tribal Forest Belt', units: '3 Production Units', reached: '14,200+ Women Reached', focus: 'Kurma Sudhar & Tribal Fellowships' },
                    { district: 'Nashik & Trimbakeshwar', units: '3 Production Units', reached: '8,900+ Women Reached', focus: 'Asha Cloth Pad Micro-Centres' },
                    { district: 'Nandurbar Satpuda Belt', units: '2 Production Units', reached: '5,400+ Women Reached', focus: 'Tribal Health & ASHA Training' },
                    { district: 'Satara Western Ghats', units: '2 Production Units', reached: '4,800+ Women Reached', focus: 'Eco-Hygiene & Organic Cotton' },
                    { district: 'Solapur Drought-Prone Area', units: '1 Production Unit', reached: '3,200+ Women Reached', focus: 'Water-Smart Wash Protocols' }
                  ].map((hub, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-white border border-[#E5DFC5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[#143D2B] flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                          {hub.district}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-[#1F2421]">{hub.units}</div>
                      <p className="text-xs text-[#5C6760] font-medium">{hub.reached}</p>
                      <div className="pt-2 text-[11px] text-[#87986A] border-t border-[#E5DFC5]/60 font-semibold">
                        Focus: {hub.focus}
                      </div>
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

    </div>
  );
};
