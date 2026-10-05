import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { TestimonialSlider } from '../components/interactive/TestimonialSlider';
import { LightboxModal } from '../components/modals/LightboxModal';
import { CountUpNumber } from '../components/common/CountUpNumber';
import { IMPACT_STATS, IMPACT_STORIES, TESTIMONIALS_DATA } from '../data/mockData';
import { 
  Users, 
  MapPin, 
  Leaf, 
  CheckCircle2, 
  TrendingUp, 
  Play, 
  ArrowRight, 
  Sparkles, 
  Heart, 
  Quote,
  Activity,
  Layers
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface ImpactStoriesPageProps {
  onOpenDonate: () => void;
}

export const ImpactStoriesPage: React.FC<ImpactStoriesPageProps> = ({ onOpenDonate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxMedia, setLightboxMedia] = useState<any>(null);

  const filterCategories = [
    { id: 'all', label: 'All Testimonies' },
    { id: 'student', label: 'School Students' },
    { id: 'artisan', label: 'Women Artisans' },
    { id: 'tribal-elder', label: 'Tribal Community' },
    { id: 'fellow', label: 'Youth Fellows' },
    { id: 'partner', label: 'Principals & Doctors' }
  ];

  const filteredTestimonials = selectedCategory === 'all'
    ? TESTIMONIALS_DATA
    : TESTIMONIALS_DATA.filter(t => t.category === selectedCategory);

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="impactStories"
        sections={{
          // 9.1 IMPACT DASHBOARD HERO BENTO
          hero: (
            <section aria-label="Impact Dashboard Hero">
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-slate-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="max-w-4xl space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold uppercase tracking-widest text-emerald-400">
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Verified Longitudinal Field Report</span>
                  </div>
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                    Human Lives Transformed, Taboos Broken, Dignity Reclaimed
                  </h1>
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
                    Real progress is measured not just in numbers of pads distributed, but in every girl who stays in school, every woman who earns a fair livelihood, and every village that ends harmful period isolation.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
                    <div className="p-5 rounded-[1.75rem] bg-slate-800/80 border border-slate-700/80">
                      <span className="text-2xl sm:text-3xl font-black text-amber-400 block">
                        <CountUpNumber value={50000} suffix="+" duration={2000} />
                      </span>
                      <span className="text-xs text-slate-300 font-semibold mt-1 block">Menstruators Equipped</span>
                    </div>
                    <div className="p-5 rounded-[1.75rem] bg-slate-800/80 border border-slate-700/80">
                      <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">
                        <CountUpNumber value={120} suffix="+" duration={2200} />
                      </span>
                      <span className="text-xs text-slate-300 font-semibold mt-1 block">Villages Transformed</span>
                    </div>
                    <div className="p-5 rounded-[1.75rem] bg-slate-800/80 border border-slate-700/80">
                      <span className="text-2xl sm:text-3xl font-black text-[#C85A32] block">
                        <CountUpNumber value={82} suffix="%" duration={2000} />
                      </span>
                      <span className="text-xs text-slate-300 font-semibold mt-1 block">RTI Symptoms Reduction</span>
                    </div>
                    <div className="p-5 rounded-[1.75rem] bg-slate-800/80 border border-slate-700/80">
                      <span className="text-2xl sm:text-3xl font-black text-white block">
                        <CountUpNumber value={180} suffix="+ Tonnes" duration={2400} />
                      </span>
                      <span className="text-xs text-slate-300 font-semibold mt-1 block">Plastic Waste Prevented</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ),

          // 9.4 BEFORE VS AFTER COMPARATIVE METRICS BENTO
          beforeAfter: (
            <section aria-label="Before and After Indicators" className="space-y-8">
              <SectionHeading
                eyebrow="Measurable Transformation"
                title="Baseline vs. Post-Intervention Indicators"
                subtitle="Longitudinal impact data collected from 1,200 sampled households across Pune and Gadchiroli districts."
                centered
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: 'Adolescent School Attendance During Periods',
                    baseline: '71% Regular Attendance',
                    post: '94% Regular Attendance',
                    change: '+23% Attendance Gain',
                    description: 'Zero absenteeism due to fear of stains or lack of changing pads in schools.'
                  },
                  {
                    title: 'Hygienic Sunlight Drying of Cloth Pads',
                    baseline: '22% Sun Dried (78% Hidden Damp)',
                    post: '89% Open Sunlight UV Dried',
                    change: '+67% Safe Practice Adherence',
                    description: 'Demystifying the sight of drying pads eradicated fungal and bacterial growth.'
                  },
                  {
                    title: 'Safe Rest Shed Compliance in Tribal Belts',
                    baseline: '5 Nights in Dilapidated Huts',
                    post: 'Safe Hygienic Rest Homes or House Stay',
                    change: '100% Risk Elimination',
                    description: 'Access to running water, solar lanterns, and secure doors eliminated reptile bites.'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-7 rounded-[2rem] bg-white border border-slate-200 space-y-4 shadow-sm hover:border-slate-300 transition-all flex flex-col justify-between">
                    <div>
                      <h4 className="text-base font-black text-slate-900 leading-snug">
                        {item.title}
                      </h4>

                      <div className="space-y-2.5 pt-4">
                        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-100 text-xs">
                          <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">Before Samajbandh:</span>
                          <span className="font-bold text-rose-900 text-sm mt-0.5 block">{item.baseline}</span>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs">
                          <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider block">With Samajbandh Intervention:</span>
                          <span className="font-bold text-emerald-950 text-sm mt-0.5 block">{item.post}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2">
                      <div className="text-xs font-black text-[#C85A32] flex items-center gap-1.5">
                        <TrendingUp className="w-4 h-4" />
                        <span>{item.change}</span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ),

          // 9.3 IN-DEPTH CASE STUDIES & PHOTO ESSAYS
          caseStudies: (
            <section aria-label="In-depth Case Studies" className="space-y-8">
              <SectionHeading
                eyebrow="Field Case Studies"
                title="Documentary Stories of Dignity & Agency"
                subtitle="Read how individuals and entire village councils forged new paths of resilience."
              />

              <div className="space-y-8">
                {IMPACT_STORIES.map((story, idx) => (
                  <div
                    key={story.id}
                    className={`bg-white rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-sm p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center ${
                      idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
                    }`}
                  >
                    <div className="lg:col-span-5 relative h-72 sm:h-96 rounded-[2rem] overflow-hidden">
                      <img
                        src={story.image}
                        alt={story.title}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs border border-slate-700">
                        {story.category.replace('-', ' ')}
                      </div>
                      <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-xs p-3.5 rounded-2xl text-white text-xs flex items-center justify-between border border-slate-800">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                          {story.location}
                        </span>
                        <span className="font-bold text-emerald-400">
                          {story.beneficiaryName}
                        </span>
                      </div>
                    </div>

                    <div className="lg:col-span-7 p-2 sm:p-4 space-y-5">
                      <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                        {story.title}
                      </h3>

                      <blockquote className="p-4 rounded-2xl bg-amber-50/80 border-l-4 border-[#C85A32] text-sm text-slate-800 italic leading-relaxed font-medium">
                        "{story.quote}"
                      </blockquote>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                        {story.story}
                      </p>

                      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-950 flex items-center gap-2.5 font-bold">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Key Result: {story.impactResult}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ),

          // 9.2 FEATURED TESTIMONIAL SLIDER & FILTERABLE VOICES
          testimonials: (
            <section aria-label="Community Testimonials" className="space-y-8">
              <SectionHeading
                eyebrow="Community Voices"
                title="What Menstruators, Elders & Educators Say"
                subtitle="Unfiltered voices from adolescent girls, tribal leaders, and ASHA health coordinators."
                centered
              />

              <TestimonialSlider testimonials={TESTIMONIALS_DATA} />

              {/* Filterable Grid of All Testimonials */}
              <div className="pt-8 space-y-6">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {filterCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs ${
                        selectedCategory === cat.id
                          ? 'bg-slate-900 text-white shadow-md'
                          : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredTestimonials.map((t) => (
                    <div key={t.id} className="p-7 rounded-[2rem] bg-white border border-slate-200 shadow-sm flex flex-col justify-between space-y-5">
                      <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed font-medium">
                        "{t.content}"
                      </p>

                      <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                        <img
                          src={t.avatar}
                          alt={t.name}
                          className="w-11 h-11 rounded-2xl object-cover border border-slate-200 shadow-xs"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h5 className="text-xs font-black text-slate-900">{t.name}</h5>
                          <p className="text-[10px] text-slate-500 font-semibold">{t.designation} • {t.location}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ),

          // 9.5 FIELD DOCUMENTARY VIDEO VIEWER PREVIEW
          documentary: (
            <section className="bg-slate-900 text-white py-12 sm:py-16 px-6 sm:px-10 lg:px-14 rounded-[2.5rem] border border-slate-800 shadow-2xl" aria-label="Field Documentary">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-6 space-y-4">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-widest block">
                    Field Documentary Reel
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    Watch: "Asha — The Threads of Dignity"
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    A 7-minute documentary capturing the daily lives of tribal women in Gadchiroli who transformed a taboo seclusion hut into a thriving solar-powered health hub.
                  </p>
                  <button
                    onClick={() => setLightboxMedia({
                      type: 'video',
                      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                      title: 'Asha — The Threads of Dignity (Field Documentary)',
                      caption: 'Filmed on location in Bhamragad and Kurkheda, Maharashtra.',
                      location: 'Gadchiroli Tribal District',
                      date: '2025'
                    })}
                    className="px-6 py-3.5 bg-[#C85A32] hover:bg-[#b54c26] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Watch Short Film (7 mins)</span>
                  </button>
                </div>

                <div className="lg:col-span-6 relative rounded-[2rem] overflow-hidden shadow-2xl border-2 border-slate-700 aspect-video bg-black flex items-center justify-center group cursor-pointer"
                  onClick={() => setLightboxMedia({
                    type: 'video',
                    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                    title: 'Asha — The Threads of Dignity (Field Documentary)',
                    caption: 'Filmed on location in Bhamragad and Kurkheda, Maharashtra.',
                    location: 'Gadchiroli Tribal District',
                    date: '2025'
                  })}
                >
                  <img
                    src="/images/kurma/kurma-hut-night.jpg"
                    alt="Documentary thumbnail"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute w-16 h-16 rounded-full bg-[#C85A32] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                    <Play className="w-7 h-7 fill-white ml-1" />
                  </div>
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
