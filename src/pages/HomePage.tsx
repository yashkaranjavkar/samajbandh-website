import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, 
  Users, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  Play, 
  Pause, 
  ChevronLeft, 
  ChevronRight, 
  MapPin, 
  Calendar, 
  BookOpen, 
  ShoppingBag, 
  Target, 
  Leaf, 
  CheckCircle2, 
  Send,
  Building,
  GraduationCap
} from 'lucide-react';
import { SectionHeading } from '../components/common/SectionHeading';
import { SdgGoals } from '../components/common/SdgGoals';
import { StoriesStrip } from '../components/interactive/StoriesStrip';
import { ImpactCounter } from '../components/interactive/ImpactCounter';
import { InteractiveMap } from '../components/interactive/InteractiveMap';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { CountUpNumber } from '../components/common/CountUpNumber';
import { 
  HERO_SLIDES,
  PROGRAMS_DATA, 
  IMPACT_STATS, 
  IMPACT_STORIES, 
  NEWS_DATA, 
  PRODUCTS_DATA, 
  PARTNERS_DATA, 
  AWARDS_DATA,
  VIDEOS_DATA,
  DONATION_PAYMENT_URL,
} from '../data/mockData';
import { Program, EventItem } from '../types';
import { ApiService } from '../services/api';
import { PageSections } from '../components/layout/PageSections';
import { toYouTubeEmbedUrl } from '../services/youtube';

interface HomePageProps {
  onOpenDonate: () => void;
  onOpenProgramDetail: (program: Program) => void;
  onOpenRegistration: (event: EventItem) => void;
}


export const HomePage: React.FC<HomePageProps> = ({
  onOpenDonate,
  onOpenProgramDetail,
  onOpenRegistration
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const [isDocumentaryPlaying, setIsDocumentaryPlaying] = useState(false);

  // Live event seat availability (loaded from the backend).
  type EventAvailability = {
    eventId: string;
    eventTitle: string;
    totalSeats: number;
    registered: number;
    seatsLeft: number;
    isFull: boolean;
  };

  const [events, setEvents] = useState<EventItem[]>([]);
  const [eventAvailability, setEventAvailability] = useState<Record<string, EventAvailability>>({});
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availabilityError, setAvailabilityError] = useState(false);

  // Join us form state
  const [joinType, setJoinType] = useState('volunteer');
  const [joinName, setJoinName] = useState('');
  const [joinEmail, setJoinEmail] = useState('');
  const [joinPhone, setJoinPhone] = useState('');
  const [joinCity, setJoinCity] = useState('');
  const [joinMsg, setJoinMsg] = useState('');
  const [joinStatus, setJoinStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Hero carousel timer
  useEffect(() => {
    if (!isHeroPlaying) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, [isHeroPlaying]);

  // Fetch current registrations and remaining seats for every event.
  const fetchEventAvailability = useCallback(async () => {
    // Events are admin-managed, so reload them together with the seat counts.
    ApiService.getEvents().then(setEvents).catch(() => undefined);
    try {
      const result = await ApiService.getEventAvailability();
      if (!result?.success || !result?.data) {
        throw new Error('Unable to fetch event availability');
      }
      setEventAvailability(result.data as Record<string, EventAvailability>);
      setAvailabilityError(false);
    } catch (error) {
      console.error('Event availability error:', error);
      setAvailabilityError(true);
    } finally {
      setAvailabilityLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEventAvailability();

    // Refresh when the user returns to this tab.
    const handleFocus = () => fetchEventAvailability();
    // Refresh immediately after the registration modal reports success.
    const handleRegistrationSuccess = () => fetchEventAvailability();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('event-registration-success', handleRegistrationSuccess);
    const intervalId = window.setInterval(fetchEventAvailability, 30000);

    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('event-registration-success', handleRegistrationSuccess);
      window.clearInterval(intervalId);
    };
  }, [fetchEventAvailability]);

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinName.trim() || !joinEmail.trim() || !joinPhone.trim()) return;

    setJoinStatus('loading');
    try {
      await ApiService.submitJoinUs({
        name: joinName,
        email: joinEmail,
        phone: joinPhone,
        city: joinCity,
        interest: joinType,
        preferredWay: joinType,
        message: joinMsg
      });
      setJoinStatus('success');
    } catch {
      setJoinStatus('error');
    }
  };

  const featuredProgram = PROGRAMS_DATA[0]; // Arogya Samwadak
  const documentary = VIDEOS_DATA[0];
  const hasDocumentaryVideo = documentary.videoUrl.trim() !== '';


  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="home"
        sections={{
          // 5.1 PICTORIAL HERO - Bento Hero Card
          hero: (
            <section className="relative bg-slate-900 text-white min-h-[580px] sm:min-h-[640px] lg:min-h-[680px] rounded-[2.5rem] flex items-center overflow-hidden border border-slate-800 shadow-2xl" aria-label="Hero Pictorial Story">
        
              {/* Background Image Carousel */}
              {HERO_SLIDES.map((slide, idx) => (
                <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={slide.image}
                    alt={slide.headline}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  {/* Editorial Multi-layer Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-r from-slate-950/95 via-slate-900/80 to-transparent"></div>
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-transparent to-black/30"></div>
                </div>
              ))}

              {/* Hero Content Container */}
              <div className="relative z-20 px-6 sm:px-12 lg:px-16 py-16 w-full">
                <div className="max-w-2xl lg:max-w-3xl space-y-6">
            
                  {/* Tag Pill */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold uppercase tracking-widest text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-[#C85A32] animate-ping"></span>
                    <span>{HERO_SLIDES[currentSlide].tag}</span>
                  </div>

                  {/* Main Headline */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                    {HERO_SLIDES[currentSlide].headline}
                  </h1>

                  {/* Subtitle Statement */}
                  <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                    {HERO_SLIDES[currentSlide].subtext}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3.5 pt-2">
                    <Link
                      id="hero-explore-work-btn"
                      to="/our-work"
                      className="px-7 py-3.5 rounded-2xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      <span>Explore Our Work</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <Link
                      id="hero-volunteer-btn"
                      to="/get-involved"
                      className="px-6 py-3.5 rounded-2xl bg-slate-800/80 hover:bg-slate-700/80 text-white font-bold text-xs uppercase tracking-wider backdrop-blur-md border border-slate-700 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>Become a Volunteer</span>
                    </Link>

                    <button
                      id="hero-donate-btn"
                      // onClick={onOpenDonate}
                      onClick={() => window.open(DONATION_PAYMENT_URL, "_blank", "noopener,noreferrer")}
                      className="px-6 py-3.5 rounded-2xl bg-[#C85A32] hover:bg-[#b54c26] text-white font-bold text-xs uppercase tracking-wider shadow-xl shadow-rose-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
                    >
                      <Heart className="w-4 h-4 fill-white" />
                      <span>Donate Now</span>
                    </button>
                  </div>

                  {/* Slide Metadata & Controls */}
                  <div className="pt-6 flex items-center justify-between border-t border-slate-800/80 max-w-xl text-xs text-slate-400">
                    <span className="font-medium">{HERO_SLIDES[currentSlide].caption}</span>
              
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setIsHeroPlaying(!isHeroPlaying)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        title={isHeroPlaying ? 'Pause Hero' : 'Play Hero'}
                        aria-label={isHeroPlaying ? 'Pause slide rotation' : 'Resume slide rotation'}
                      >
                        {isHeroPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        aria-label="Previous slide"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="font-mono text-xs text-slate-300 font-bold px-1">{currentSlide + 1} / {HERO_SLIDES.length}</span>
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
                        aria-label="Next slide"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          ),

          // 5.1.1 PICTORIAL STORIES STRIP
          storiesStrip: (
            <StoriesStrip />
          ),

          // 5.2 THE PROBLEM & 5.3 VISION & MISSION - Bento Grid Structure
          challengeVision: (
            <section className="aria-label-challenge-vision" aria-label="The Challenge and Vision">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
                {/* Problem Editorial Story Bento Card */}
                <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-50 text-[#C85A32] border border-rose-200/80 text-xs font-bold uppercase tracking-widest">
                      <Target className="w-3.5 h-3.5" />
                      The Root Challenge
                    </div>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 leading-tight">
                      Why Menstrual Equity Remains India’s Most Urgent Unspoken Crisis
                    </h2>

                    <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                      In millions of rural and peri-urban households, menstruation is still shrouded in secrecy, shame, and unhygienic practices. Over <span className="font-bold text-slate-900">70% of reproductive tract infections</span> stem from unhygienic cloth management, lack of clean drying sunlight, and unaffordability of recurring commercial pads.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="p-5 rounded-2xl bg-rose-50/50 border border-rose-100">
                      <span className="text-xs font-bold text-[#C85A32] uppercase tracking-wider block mb-1">Dignity & Access Barrier</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Adolescent girls routinely miss 3-4 school days each month, leading to high dropout rates at puberty.
                      </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-100">
                      <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">Ecological Plastic Burden</span>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        Single-use pads contain up to 90% plastic, creating un-degradable waste in villages without incinerators.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Vision & Mission Side-by-Side Bento Card */}
                <div className="lg:col-span-6 bg-slate-900 text-white p-8 sm:p-10 rounded-[2.5rem] shadow-xl space-y-6 relative overflow-hidden border border-slate-800 flex flex-col justify-between">
                  <div className="absolute right-0 bottom-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

                  {/* Vision */}
                  <div className="space-y-3 border-b border-slate-800 pb-6 relative z-10">
                    <span className="text-xs uppercase font-bold text-amber-400 tracking-widest block">
                      OUR VISION
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white leading-snug">
                      A society where every individual experiences menstruation with bodily autonomy, health, and complete dignity.
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                      Free from discriminatory isolation, fear, shame, and environmental pollution.
                    </p>
                  </div>

                  {/* Mission */}
                  <div className="space-y-4 relative z-10">
                    <span className="text-xs uppercase font-bold text-rose-400 tracking-widest block">
                      OUR MISSION
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      To democratize menstrual literacy and sustainable hygiene solutions through 3 pillars:
                    </h3>
                    <div className="grid grid-cols-3 gap-3 pt-1 text-center text-xs">
                      <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80">
                        <span className="font-bold text-amber-400 block uppercase tracking-wider text-[11px]">EDUCATE</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">Demystify Biology</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80">
                        <span className="font-bold text-rose-400 block uppercase tracking-wider text-[11px]">ENGAGE</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">Fellows & Reforms</span>
                      </div>
                      <div className="p-3.5 rounded-2xl bg-slate-800/90 border border-slate-700/80">
                        <span className="font-bold text-emerald-400 block uppercase tracking-wider text-[11px]">SUSTAIN</span>
                        <span className="text-[10px] text-slate-400 mt-0.5 block">Asha Production</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>
          ),

          // 5.5 IMPACT NUMBERS - Bento Telemetry Card
          impactNumbers: (
            <section className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm" aria-label="Key Impact Statistics">
              <SectionHeading
                eyebrow="Measurable Grassroots Scale"
                title="Impact Created Across Maharashtra"
                subtitle="Verified data driven by community-owned production units, youth fellows, and participatory village health circles."
                centered
              />
              <div className="mt-6">
                <ImpactCounter stats={IMPACT_STATS} />
              </div>
            </section>
          ),

          // FIELD DOCUMENTARY VIDEO
          documentary: (
            <section className="bg-slate-900 text-white py-12 sm:py-16 px-6 sm:px-10 lg:px-14 rounded-[2.5rem] border border-slate-800 shadow-2xl" aria-label="Field Documentary">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-5 space-y-4">
                  <span className="text-xs uppercase font-bold text-amber-400 tracking-widest block">
                    Field Documentary
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {documentary.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
                    {documentary.description}
                  </p>
                  {hasDocumentaryVideo && !isDocumentaryPlaying && (
                    <button
                      onClick={() => setIsDocumentaryPlaying(true)}
                      className="px-6 py-3.5 bg-[#C85A32] hover:bg-[#b54c26] text-white font-bold text-xs uppercase tracking-wider rounded-2xl transition-all flex items-center gap-2 shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>Watch Documentary ({documentary.duration})</span>
                    </button>
                  )}
                </div>

                <div className="lg:col-span-7 relative rounded-[2rem] overflow-hidden shadow-2xl border-2 border-slate-700 aspect-video bg-black">
                  {isDocumentaryPlaying ? (
                    <iframe
                      // src={`${documentary.videoUrl}?autoplay=1`}
                      src={toYouTubeEmbedUrl(documentary.videoUrl, { autoplay: true })}
                      title={documentary.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : !hasDocumentaryVideo ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={documentary.thumbnailUrl}
                        alt="Documentary thumbnail"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                      />
                      <span className="relative px-4 py-2 rounded-full bg-black/70 backdrop-blur-xs border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                        Video coming soon
                      </span>
                    </div>
                    
                  ) : (
                    <button
                      onClick={() => setIsDocumentaryPlaying(true)}
                      className="w-full h-full flex items-center justify-center group"
                      aria-label={`Play ${documentary.title}`}
                    >
                      <img
                        src={documentary.thumbnailUrl}
                        alt="Documentary thumbnail"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                      />
                      <span className="relative w-16 h-16 rounded-full bg-[#C85A32] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                        <Play className="w-7 h-7 fill-white ml-1" />
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </section>
          ),

          // 5.4 KEY PROGRAMS SHOWCASE - Bento Grid Array
          programs: (
            <section aria-label="Signature Programs" className="space-y-8">
              <SectionHeading
                eyebrow="Signature Initiatives"
                title="Transformative Grassroots Programs"
                subtitle="Addressing menstrual stigma, women’s livelihood creation, and safe sanitation across rural and tribal ecosystems."
                action={
                  <Link
                    to="/our-work#programs"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-[#C85A32] transition-colors"
                  >
                    <span>View All Programs</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {PROGRAMS_DATA.slice(0, 6).map((program) => (
                  <div
                    key={program.id}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl hover:border-slate-300 transition-all flex flex-col p-3 group"
                  >
                    {/* Card Image inside Bento Mask */}
                    <div className="relative h-56 rounded-[1.5rem] overflow-hidden">
                      <img
                        src={program.image}
                        alt={program.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-xs border border-slate-700">
                        {program.category.replace('-', ' ')}
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs bg-slate-900/80 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/10">
                        <span className="flex items-center gap-1.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          {program.locations[0]}
                        </span>
                        <span className="font-bold text-emerald-400">
                          {program.impactMetrics[0].value} {program.impactMetrics[0].label.split(' ')[0]}
                        </span>
                      </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 group-hover:text-emerald-800 transition-colors line-clamp-1">
                          {program.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-2 leading-relaxed line-clamp-3">
                          {program.shortDescription}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <button
                          onClick={() => onOpenProgramDetail(program)}
                          className="text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-[#C85A32] flex items-center gap-1.5 transition-colors"
                        >
                          <span>Explore Program</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] text-slate-500 font-semibold">
                          {program.beneficiaries.split(',')[0]}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ),

          // UN SUSTAINABLE DEVELOPMENT GOALS
          sdgGoals: (
            <SdgGoals />
          ),

          // 5.6 WHERE DO WE WORK? - Interactive Map in Bento Wrapper
          map: (
            <section aria-label="Interactive Map">
              <InteractiveMap 
                onSelectProgram={(slug) => {
                  const prog = PROGRAMS_DATA.find(p => p.slug === slug);
                  if (prog) onOpenProgramDetail(prog);
                }}
              />
            </section>
          ),

          // FEATURED INITIATIVE - Spotlight Bento Card
          featuredInitiative: (
            <section aria-label="Featured Initiative Spotlight">
              <div className="bg-white rounded-[2.5rem] p-6 sm:p-10 border border-slate-200 shadow-md grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
                <div className="lg:col-span-6 relative h-72 sm:h-96 rounded-[2rem] overflow-hidden shadow-sm">
                  <img
                    src={featuredProgram.image}
                    alt={featuredProgram.title}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 bg-[#C85A32] text-white text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full shadow-md">
                    Featured Initiative
                  </div>
                </div>

                <div className="lg:col-span-6 space-y-4">
                  <span className="text-xs font-bold uppercase text-emerald-700 tracking-widest block">
                    Flagship Youth Leadership
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight">
                    {featuredProgram.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {featuredProgram.fullDescription}
                  </p>

                  <div className="grid grid-cols-3 gap-3 py-2 text-center">
                    {featuredProgram.impactMetrics.map((m, i) => (
                      <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200">
                        <span className="text-lg font-black text-slate-900 block">
                          <CountUpNumber value={m.value} duration={1800} />
                        </span>
                        <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">{m.label}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-wrap gap-3">
                    <button
                      onClick={() => onOpenProgramDetail(featuredProgram)}
                      className="px-6 py-3.5 rounded-2xl bg-slate-900 text-white font-bold text-xs uppercase tracking-wider hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-md"
                    >
                      <span>Learn More →</span>
                    </button>
                    <Link
                      to="/get-involved"
                      className="px-6 py-3.5 rounded-2xl border border-slate-300 text-slate-700 font-bold text-xs uppercase tracking-wider hover:bg-slate-50 transition-colors"
                    >
                      Apply for Fellowship
                    </Link>
                  </div>
                </div>

              </div>
            </section>
          ),

          // 5.10 PRODUCTS & SERVICES PREVIEW - Bento Grid
          productsPreview: (
            <section aria-label="Products and Services" className="space-y-8">
              <SectionHeading
                eyebrow="Sustain The Mission"
                title="Asha Products & Health Kits"
                subtitle="Every purchase supports rural women tailors with fair living wages and supplies high-absorbency, zero-plastic reusable pads."
                action={
                  <Link
                    to="/products-services"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-[#C85A32] transition-colors"
                  >
                    <span>Explore All Products & Kits</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {PRODUCTS_DATA.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between p-3 group"
                  >
                    <div className="relative h-60 rounded-[1.5rem] overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      {product.badge && (
                        <div className="absolute top-3 left-3 bg-[#C85A32] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
                          {product.badge}
                        </div>
                      )}
                      <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-slate-900 font-black text-sm px-3.5 py-1.5 rounded-xl shadow-md border border-slate-100">
                        ₹{product.price}
                      </div>
                    </div>

                    <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800">
                          {product.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed line-clamp-2">
                          {product.subtitle}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex gap-2">
                        <Link
                          to="/products-services"
                          className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-colors shadow-sm"
                        >
                          Buy / Order
                        </Link>
                        <button
                          // onClick={onOpenDonate}
                          onClick={() => window.open(DONATION_PAYMENT_URL, "_blank", "noopener,noreferrer")}
                          className="flex-1 py-3 text-center text-xs font-bold uppercase tracking-wider rounded-xl border border-rose-300 text-[#C85A32] hover:bg-rose-50 transition-colors"
                        >
                          Sponsor Pack
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ),

          // 5.7 LATEST UPDATES / NEWS BLOG - Bento Grid
          latestNews: (
            <section aria-label="Latest Updates" className="space-y-8">
              <SectionHeading
                eyebrow="News & Dispatches"
                title="Latest Updates & Field Stories"
                subtitle="Real dispatches documenting program milestones, state health summits, and community voices."
                action={
                  <Link
                    to="/news-events"
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900 hover:text-[#C85A32] transition-colors"
                  >
                    <span>View All News & Events</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                }
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                {NEWS_DATA.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-[2rem] overflow-hidden border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col p-3 group"
                  >
                    <div className="relative h-52 rounded-[1.5rem] overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-slate-900/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-slate-700">
                        {item.type}
                      </div>
                    </div>

                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-bold uppercase tracking-wider mb-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{item.date}</span>
                          {item.source && <span className="text-slate-400 font-normal">• {item.source}</span>}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-emerald-800 line-clamp-2 leading-snug">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                          {item.summary}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <Link
                          to="/news-events"
                          className="text-xs font-bold uppercase tracking-wider text-slate-900 group-hover:text-[#C85A32] flex items-center gap-1"
                        >
                          <span>Read More</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ),

          // 5.8 UPCOMING OPPORTUNITIES & WORKSHOPS - Live seat availability
          upcomingEvents: (
            <section id="upcoming-events" className="scroll-mt-28 bg-slate-900 text-white py-14 px-6 sm:px-10 lg:px-12 rounded-[2.5rem] shadow-2xl border border-slate-800" aria-label="Upcoming Programs and Registration">
              <SectionHeading
                eyebrow="Participate & Learn"
                title="Join an Upcoming Program or Workshop"
                subtitle="Open fellowship camps, school educator webinars, and community MHM drives across Maharashtra."
                light
              />

              {availabilityError && (
                <p role="status" className="mt-5 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-200">
                  Seat availability is temporarily unavailable. Please try again shortly.
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
                {events.length === 0 && (
                  <p className="text-sm text-slate-300 col-span-full">
                    {availabilityLoading ? 'Loading upcoming programs...' : 'No upcoming programs are open right now. Please check back soon.'}
                  </p>
                )}
                {events.map((ev) => {
                  const availability = eventAvailability[ev.id];
                  const hasAvailability = Boolean(availability) && !availabilityError;
                  const totalSeats = availability?.totalSeats ?? 0;
                  const registered = availability?.registered ?? 0;
                  const seatsLeft = availability?.seatsLeft ?? 0;
                  const progress = totalSeats > 0
                    ? Math.min(100, Math.round((registered / totalSeats) * 100))
                    : 0;
                  const isFull = hasAvailability && (availability?.isFull || seatsLeft <= 0);
                  const registrationClosed = ev.registrationOpen === false;
                  const canRegister = !availabilityLoading && hasAvailability && !isFull && !registrationClosed;

                  return (
                    <article
                      key={ev.id}
                      className="bg-slate-800/90 rounded-[2rem] p-6 border border-slate-700/80 shadow-md flex flex-col justify-between gap-5 hover:border-slate-600 transition-all"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between gap-3 text-xs text-emerald-400">
                          <span className="bg-slate-700/80 px-3 py-1 rounded-full font-bold uppercase tracking-wider text-[10px]">
                            {ev.type}
                          </span>
                          <span className="flex items-center gap-1 text-slate-300 font-medium">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            {ev.date.split('(')[0]}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-white leading-snug">{ev.title}</h3>
                        <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{ev.description}</p>
                        <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span>{ev.location}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-700 space-y-3">
                        {availabilityLoading ? (
                          <p className="text-xs text-slate-300">Checking seat availability...</p>
                        ) : hasAvailability ? (
                          <>
                            <div className="flex items-center justify-between gap-3 text-xs">
                              <span className="text-slate-300">
                                {registered} / {totalSeats} registered
                              </span>
                              <span className={isFull ? 'text-rose-300 font-semibold' : 'text-emerald-300 font-semibold'}>
                                {isFull ? 'Fully booked' : `${seatsLeft} seats left`}
                              </span>
                            </div>
                            <div className="h-2 rounded-full bg-slate-700 overflow-hidden" role="progressbar" aria-label={`${ev.title} registration progress`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={progress}>
                              <div className="h-full rounded-full bg-emerald-400 transition-all duration-500" style={{ width: `${progress}%` }} />
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-amber-200">Seat count could not be verified.</p>
                        )}

                        <div className="flex items-center justify-between gap-3">
                          <button
                            type="button"
                            onClick={() => onOpenRegistration(ev)}
                            disabled={!canRegister}
                            className="px-4 py-2 rounded-xl bg-[#C85A32] hover:bg-[#b54c26] disabled:bg-slate-600 disabled:text-slate-300 disabled:cursor-not-allowed text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md"
                          >
                            <span>{registrationClosed ? 'Registration Closed' : isFull ? 'Fully Booked' : 'Register Now'}</span>
                            {!registrationClosed && !isFull && <ArrowRight className="w-3.5 h-3.5" />}
                          </button>
                          {hasAvailability && (
                            <span className="text-[10px] text-slate-400">Capacity: {totalSeats}</span>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ),

          // 5.11 PARTNERS & 6.10 AWARDS & RECOGNITION - Bento Pods
          partnersAwards: (
            <section className="text-center space-y-8" aria-label="Partners and Recognition">
              <div>
                <span className="text-xs uppercase font-bold text-emerald-700 tracking-widest block">
                  Institutional Alliances
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Partners, Supporters & CSR Collaborators
                </h3>
              </div>

              {/* Partner Logos Bento Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {PARTNERS_DATA.map((partner) => (
                  <div
                    key={partner.id}
                    className="p-6 rounded-[2rem] bg-white border border-slate-200 flex flex-col items-center justify-center text-center shadow-xs hover:border-slate-300 hover:scale-[1.02] transition-all"
                  >
                    {partner.logo ? (
                      <div className="h-20 w-full flex items-center justify-center mb-3">
                        <img
                          src={partner.logo}
                          alt={`${partner.name} logo`}
                          className="max-h-full max-w-[85%] object-contain"
                          loading="lazy"
                        />
                      </div>
                    ) : (
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center mb-3 border border-slate-100">
                      <Building className="w-6 h-6 text-slate-700" />
                    </div>
                  )}
                    <h4 className="text-xs font-bold text-slate-900">{partner.name}</h4>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">{partner.partnershipYear}</span>
                  </div>
                ))}
              </div>

              {/* Awards Bento Band */}
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                  Awards & Recognition
                </h3>
              <div className="pt-6">
                {/* <span className="text-xs uppercase font-bold text-amber-600 tracking-widest block mb-4">
                  Awards & Recognition (2025, 2024, 2023)
                </span> */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {AWARDS_DATA.map((award) => (
                    <div key={award.id} className="p-5 rounded-[2rem] bg-white border border-slate-200 text-left shadow-xs hover:shadow-md transition-all">
                      <span className="text-[10px] font-bold text-[#C85A32] uppercase tracking-wider bg-rose-50 px-2.5 py-1 rounded-full border border-rose-100">{award.year} Recognition</span>
                      <h4 className="text-sm font-bold text-slate-900 mt-2">{award.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{award.awardingBody}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ),

          // 5.13 BOTTOM CTA BAND
          bottomCta: (
            <BottomCTABand onOpenDonate={onOpenDonate} />
          ),
        }}
      />

    </div>
  );
};
