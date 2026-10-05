import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { ApiService } from '../services/api';
import { 
  Users, 
  Heart, 
  Sparkles, 
  PackageCheck, 
  Building, 
  GraduationCap, 
  CheckCircle2, 
  Send, 
  MapPin, 
  Calendar,
  Clock,
  ShieldCheck,
  ArrowRight,
  Briefcase,
  FileCheck,
  Award,
  BookOpen,
  HelpCircle,
  Laptop,
  Check,
  ChevronRight
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface GetInvolvedPageProps {
  onOpenDonate: () => void;
}

export const GetInvolvedPage: React.FC<GetInvolvedPageProps> = ({ onOpenDonate }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get('tab');
  const roleParam = searchParams.get('role');
  const durationParam = searchParams.get('duration');

  const [activeTab, setActiveTab] = useState<'volunteer' | 'internship' | 'fellowship' | 'donate-cloth' | 'csr'>('volunteer');

  // Form State
  const [roleType, setRoleType] = useState<'volunteer' | 'intern' | 'fellow' | 'csr' | 'donate-cloth'>('volunteer');
  const [selectedDuration, setSelectedDuration] = useState<string>('1-month');
  const [isCustomDate, setIsCustomDate] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [mode, setMode] = useState<'on-ground' | 'hybrid' | 'remote'>('on-ground');
  const [weeklyHours, setWeeklyHours] = useState<string>('part-time');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [collegeOrOrg, setCollegeOrOrg] = useState('');
  const [domains, setDomains] = useState<string[]>(['School & Community Workshops']);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  // Handle URL sync
  useEffect(() => {
    if (tabParam === 'internship' || tabParam === 'intern') {
      setActiveTab('internship');
      setRoleType('intern');
    } else if (tabParam === 'volunteer') {
      setActiveTab('volunteer');
      setRoleType('volunteer');
    } else if (tabParam === 'fellowship') {
      setActiveTab('fellowship');
      setRoleType('fellow');
    } else if (tabParam === 'donate-cloth') {
      setActiveTab('donate-cloth');
      setRoleType('donate-cloth');
    } else if (tabParam === 'csr') {
      setActiveTab('csr');
      setRoleType('csr');
    }

    if (roleParam === 'intern') setRoleType('intern');
    if (roleParam === 'volunteer') setRoleType('volunteer');

    if (durationParam) {
      if (['1-week', '2-weeks', '1-month', '2-months', '3-months', '6-months'].includes(durationParam)) {
        setSelectedDuration(durationParam);
        setIsCustomDate(false);
      } else if (durationParam === 'custom') {
        setIsCustomDate(true);
      }
    }
  }, [tabParam, roleParam, durationParam]);

  // Compute duration display text
  const getDurationLabel = () => {
    if (isCustomDate && startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays > 0) {
        const weeks = Math.floor(diffDays / 7);
        const remainingDays = diffDays % 7;
        let str = `${diffDays} Days`;
        if (weeks > 0) str += ` (${weeks} Week${weeks > 1 ? 's' : ''}${remainingDays > 0 ? ` + ${remainingDays}d` : ''})`;
        return str;
      }
      return 'Custom Date Range';
    }

    switch (selectedDuration) {
      case '1-week': return '1 Week Intensive Sprint';
      case '2-weeks': return '2 Weeks Field Immersion';
      case '1-month': return '1 Month Structured Immersion';
      case '2-months': return '2 Months Academic / Summer Internship';
      case '3-months': return '3 Months In-Depth Program Internship';
      case '6-months': return '6 Months Full-Time Fellowship';
      default: return selectedDuration;
    }
  };

  const toggleDomain = (domainName: string) => {
    setDomains(prev => 
      prev.includes(domainName)
        ? prev.filter(d => d !== domainName)
        : [...prev, domainName]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) return;

    setStatus('loading');
    try {
      await ApiService.submitJoinUs({
        name,
        email,
        phone,
        city,
        interest: activeTab,
        roleType,
        duration: getDurationLabel(),
        startDate: isCustomDate ? startDate : undefined,
        endDate: isCustomDate ? endDate : undefined,
        mode,
        collegeOrOrg,
        domains,
        commitmentHours: weeklyHours,
        preferredWay: activeTab,
        message: notes
      });
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const handleSelectTab = (tab: 'volunteer' | 'internship' | 'fellowship' | 'donate-cloth' | 'csr') => {
    setActiveTab(tab);
    if (tab === 'volunteer') setRoleType('volunteer');
    if (tab === 'internship') setRoleType('intern');
    if (tab === 'fellowship') setRoleType('fellow');
    if (tab === 'donate-cloth') setRoleType('donate-cloth');
    if (tab === 'csr') setRoleType('csr');
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="getInvolved"
        sections={{
          // 11.1 HERO BANNER
          hero: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Get Involved Hero">
              <div className="bg-[#143D2B] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-emerald-800">
          
                {/* Background accent */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-700/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />

                <div className="max-w-3xl space-y-6 relative z-10">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-900/80 border border-emerald-700 text-[#D99B26] text-xs font-bold uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Volunteering & Internship Opportunities 2026</span>
                  </div>
            
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heading font-extrabold text-white leading-tight">
                    Lend Your Voice, Time & Skills to Menstrual Dignity
                  </h1>
            
                  <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
                    Join Samajbandh as a <strong>Volunteer</strong> (flexible weekend drives, awareness camps) or as an <strong>Intern</strong> (1 week to 3 months structured academic immersion with certified LOR). Choose your preferred duration, domain, and mode of engagement.
                  </p>

                  {/* Quick jump pills */}
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        handleSelectTab('volunteer');
                        document.getElementById('application-form-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-white text-[#143D2B] text-xs font-bold hover:bg-emerald-50 transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Users className="w-4 h-4 text-[#143D2B]" />
                      <span>Apply as Volunteer</span>
                    </button>
              
                    <button
                      onClick={() => {
                        handleSelectTab('internship');
                        document.getElementById('application-form-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-[#C85A32] text-white text-xs font-bold hover:bg-[#b54c26] transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <Briefcase className="w-4 h-4" />
                      <span>Apply for Internship (1 Wk - 3 Mo)</span>
                    </button>
              
                    <button
                      onClick={() => {
                        handleSelectTab('fellowship');
                        document.getElementById('application-form-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-emerald-800/80 border border-emerald-600 text-emerald-100 text-xs font-bold hover:bg-emerald-700 transition-colors flex items-center gap-1.5"
                    >
                      <GraduationCap className="w-4 h-4 text-[#D99B26]" />
                      <span>6-Month Fellowship</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>
          ),

          // 11.2 ENGAGEMENT PATHWAYS TABS
          pathways: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Engagement Pathways">
        
              {/* Navigation Tabs */}
              <div className="flex flex-wrap gap-2 border-b border-[#E5DFC5] pb-4">
                {[
                  { id: 'volunteer', label: 'Volunteer With Us', icon: <Users className="w-4 h-4" />, badge: 'Flexible' },
                  { id: 'internship', label: 'Internships (1 Wk - 3 Mo)', icon: <Briefcase className="w-4 h-4" />, badge: 'Academic Credit' },
                  { id: 'fellowship', label: 'Arogya Samwadak Fellowship', icon: <GraduationCap className="w-4 h-4" />, badge: '₹15,000/Mo' },
                  { id: 'donate-cloth', label: 'Donate Clean Cotton Cloth', icon: <PackageCheck className="w-4 h-4" /> },
                  { id: 'csr', label: 'CSR & Institutional Alliances', icon: <Building className="w-4 h-4" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => handleSelectTab(tab.id as any)}
                    className={`px-4 sm:px-5 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'bg-[#143D2B] text-white shadow-md'
                        : 'bg-[#FBF9F5] text-[#5C6760] hover:text-[#1F2421] border border-[#E5DFC5]'
                    }`}
                  >
                    {tab.icon}
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-tight ${
                        activeTab === tab.id ? 'bg-[#D99B26] text-[#143D2B]' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Dynamic Tab Content Cards */}
              <div className="pt-8">
          
                {/* TAB 1: VOLUNTEER */}
                {activeTab === 'volunteer' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFC5] shadow-lg space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-[#C85A32] text-xs font-bold uppercase">
                          <Users className="w-3.5 h-3.5" />
                          <span>Grassroots & Community Action</span>
                        </div>
                        <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#143D2B]">
                          Volunteer with Samajbandh in Communities & Schools
                        </h3>
                        <p className="text-sm text-[#5C6760] leading-relaxed">
                          Join our passionate network of over 300+ youth, medical students, educators, and social advocates across Maharashtra. Perfect for working professionals, college students, and changemakers looking for flexible engagement.
                        </p>

                        <div className="space-y-2.5 pt-2">
                          {[
                            'Facilitate menstrual myth-busting sessions in rural high schools and ZP institutions',
                            'Assist in sanitary pad packaging, inspection, and inventory sorting at micro-units',
                            'Participate in weekend health camps and community dialogues in tribal hamlets',
                            'Digital advocacy, creative writing, photography, and translation of Marathi educational kits'
                          ].map((role, i) => (
                            <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#1F2421]">
                              <CheckCircle2 className="w-4 h-4 text-[#143D2B] shrink-0 mt-0.5" />
                              <span>{role}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-4">
                          <button
                            onClick={() => {
                              setRoleType('volunteer');
                              document.getElementById('application-form-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#143D2B] text-white text-xs font-bold hover:bg-[#1E533B] transition-colors inline-flex items-center gap-2 shadow-sm"
                          >
                            <span>Fill Volunteer Form</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-5 space-y-3">
                        <div className="bg-[#FBF9F5] p-6 rounded-2xl border border-[#E5DFC5] space-y-3">
                          <span className="text-xs font-bold text-[#143D2B] uppercase tracking-wider block">Volunteer Highlights</span>
                    
                          <div className="p-3 bg-white rounded-xl border border-[#E5DFC5] text-xs space-y-1">
                            <div className="flex items-center gap-2 font-bold text-[#1F2421]">
                              <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
                              <span>Flexible Commitment:</span>
                            </div>
                            <p className="text-[#5C6760] pl-5">Weekend drives (Saturdays/Sundays) or 3-5 hours/week remote tasks.</p>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-[#E5DFC5] text-xs space-y-1">
                            <div className="flex items-center gap-2 font-bold text-[#1F2421]">
                              <Award className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Social Impact Certificate:</span>
                            </div>
                            <p className="text-[#5C6760] pl-5">Official certificate acknowledging your hours and grassroots service.</p>
                          </div>

                          <div className="p-3 bg-white rounded-xl border border-[#E5DFC5] text-xs space-y-1">
                            <div className="flex items-center gap-2 font-bold text-[#1F2421]">
                              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Locations:</span>
                            </div>
                            <p className="text-[#5C6760] pl-5">Pune, Gadchiroli, Nashik, Junnar, Thane, or Remote / Digital.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: INTERNSHIPS (1 WEEK, 1 MONTH, 2-3 MONTHS) */}
                {activeTab === 'internship' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFC5] shadow-lg space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                      <div className="lg:col-span-7 space-y-4">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold uppercase">
                          <Briefcase className="w-3.5 h-3.5" />
                          <span>Structured Academic & Field Internship</span>
                        </div>
                  
                        <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#143D2B]">
                          Internship Programs (1 Week to 3 Months)
                        </h3>
                  
                        <p className="text-sm text-[#5C6760] leading-relaxed">
                          Designed for students and researchers from Social Work (MSW/BSW), Public Health (MBBS/MPH/Nursing), Rural Development, Sociology, Media & Communications, and Management looking for verified field exposure, project mentorship, and official academic appraisal.
                        </p>

                        {/* Duration tracks */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                          <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#143D2B]">1 Week Field Sprint</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">Rapid Sprint</span>
                            </div>
                            <p className="text-xs text-[#5C6760] leading-relaxed">
                              Intensive 7-day rural immersion, school workshop facilitation, and pad packaging QA.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#143D2B]">1 Month Structured Immersion</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">Most Popular</span>
                            </div>
                            <p className="text-xs text-[#5C6760] leading-relaxed">
                              End-to-end community project, baseline survey data collection, and Arogya Samwadak mentoring.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#143D2B]">2-3 Months Academic Internship</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">College Credits</span>
                            </div>
                            <p className="text-xs text-[#5C6760] leading-relaxed">
                              Dedicated thesis/capstone project, LOR, faculty supervisor coordination, and longitudinal research.
                            </p>
                          </div>

                          <div className="p-3.5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs text-[#143D2B]">Custom Dates & Schedules</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">Flexible</span>
                            </div>
                            <p className="text-xs text-[#5C6760] leading-relaxed">
                              Align directly with your university semester breaks, winter vacations, or summer internships.
                            </p>
                          </div>
                        </div>

                        <div className="pt-4 flex items-center gap-3">
                          <button
                            onClick={() => {
                              setRoleType('intern');
                              document.getElementById('application-form-section')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-5 py-2.5 rounded-xl bg-[#C85A32] text-white text-xs font-bold hover:bg-[#b54c26] transition-colors inline-flex items-center gap-2 shadow-sm"
                          >
                            <span>Apply for Internship</span>
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="lg:col-span-5 space-y-3">
                        <div className="bg-[#143D2B] text-white p-6 rounded-2xl border border-emerald-800 space-y-4">
                          <span className="text-xs font-bold text-[#D99B26] uppercase tracking-wider block">
                            What Interns Receive
                          </span>
                    
                          <div className="space-y-2.5 text-xs text-emerald-100">
                            <div className="flex items-start gap-2.5">
                              <Award className="w-4 h-4 text-[#D99B26] shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white block">Official Internship Certificate:</strong>
                                <span>Authorized by Samajbandh Public Charitable Trust with verified project hours.</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <FileCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white block">Letter of Recommendation (LOR):</strong>
                                <span>Personalized evaluation signed by Founder Sachin Asha Subhash for higher education & jobs.</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <BookOpen className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white block">Academic Faculty Sign-off:</strong>
                                <span>We complete weekly progress diaries, performance evaluations, and institutional formats.</span>
                              </div>
                            </div>

                            <div className="flex items-start gap-2.5">
                              <MapPin className="w-4 h-4 text-rose-300 shrink-0 mt-0.5" />
                              <div>
                                <strong className="text-white block">Field Allowance & Travel Support:</strong>
                                <span>Local commute assistance provided during rural and tribal camp deployments.</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: FELLOWSHIP */}
                {activeTab === 'fellowship' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFC5] shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-4">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold uppercase">
                        <GraduationCap className="w-3.5 h-3.5" />
                        <span>6-Month Residential Leadership</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#143D2B]">
                        Arogya Samwadak Fellowship (Cohort 2026)
                      </h3>
                      <p className="text-sm text-[#5C6760] leading-relaxed">
                        An intensive 6-month grassroots fellowship for passionate youth (ages 20-30) to live and work in rural/tribal communities, leading MHM dialogue and rest shed reforms.
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#E5DFC5] text-xs">
                          <span className="font-bold text-[#143D2B] block">Monthly Stipend:</span>
                          <span className="text-[#5C6760]">₹15,000 / month + field travel allowance</span>
                        </div>
                        <div className="p-3 bg-[#FBF9F5] rounded-xl border border-[#E5DFC5] text-xs">
                          <span className="font-bold text-[#143D2B] block">Duration:</span>
                          <span className="text-[#5C6760]">6 Months Full-Time (Pune / Gadchiroli / Nashik)</span>
                        </div>
                      </div>

                      <div className="pt-4">
                        <button
                          onClick={() => {
                            setRoleType('fellow');
                            setSelectedDuration('6-months');
                            document.getElementById('application-form-section')?.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-5 py-2.5 rounded-xl bg-[#143D2B] text-white text-xs font-bold hover:bg-[#1E533B] transition-colors inline-flex items-center gap-2 shadow-sm"
                        >
                          <span>Apply for Fellowship</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-[#143D2B] text-white p-6 rounded-2xl border border-emerald-800 space-y-3">
                      <span className="text-xs font-bold text-[#D99B26] uppercase block">Selection Stages</span>
                      <div className="space-y-2 text-xs text-emerald-100">
                        <div className="p-2.5 rounded-lg bg-white/10">1. Online Application Form & Statement of Purpose</div>
                        <div className="p-2.5 rounded-lg bg-white/10">2. Telephonic Screening & Panel Interview</div>
                        <div className="p-2.5 rounded-lg bg-white/10">3. 3-Day Rural Field Immersion Camp in Junnar</div>
                        <div className="p-2.5 rounded-lg bg-white/10">4. 10-Day Residential Induction & Deployment</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 4: DONATE CLEAN COTTON CLOTH */}
                {activeTab === 'donate-cloth' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFC5] shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-4">
                      <span className="text-xs font-bold uppercase text-[#87986A]">Upcycling & Raw Material Support</span>
                      <h3 className="text-2xl font-serif-heading font-bold text-[#143D2B]">
                        Donate Clean 100% Cotton Cloth for Pad Liners
                      </h3>
                      <p className="text-sm text-[#5C6760] leading-relaxed">
                        We collect gently used or surplus clean cotton bedsheets, cotton dhotis, and unstitched fabric remnants to process into secondary absorption layers, reducing pad production costs for rural menstruators.
                      </p>

                      <div className="space-y-3 pt-2">
                        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1">
                          <span className="font-bold block uppercase">What We Accept:</span>
                          <span>100% Cotton fabrics, clean bedsheets, cotton kurtas, unprinted cotton yardage. (No synthetic, nylon, silk, or heavily dyed fabrics).</span>
                        </div>

                        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#143D2B] space-y-1">
                          <span className="font-bold block uppercase">How to Prepare & Send:</span>
                          <span>1. Wash with detergent • 2. Sun-dry thoroughly • 3. Pack in clean cardboard box or bag • 4. Ship to our Pune Collection Desk or drop off during weekend drives.</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-[#FBF9F5] p-6 rounded-2xl border border-[#E5DFC5] space-y-3">
                      <span className="text-xs font-bold text-[#143D2B] uppercase block">Collection Hub Address</span>
                      <div className="p-4 bg-white rounded-xl border border-[#E5DFC5] text-xs space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[#1F2421] block">Samajbandh Central Cloth Desk</span>
                            <span className="text-[#5C6760]">Office 402, Samajbandh Bhavan, Near Tilak Smarak Mandir, Sadashiv Peth, Pune, Maharashtra 411030</span>
                          </div>
                        </div>
                        <div className="text-[11px] text-[#87986A] font-semibold pt-1 border-t border-gray-100">
                          Contact: +91 98220 12345 / cloths@samajbandh.org
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: CSR */}
                {activeTab === 'csr' && (
                  <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFC5] shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-4">
                      <span className="text-xs font-bold uppercase text-[#C85A32]">Corporate & Foundation Alliances</span>
                      <h3 className="text-2xl font-serif-heading font-bold text-[#143D2B]">
                        CSR Alignment Under Schedule VII (Health & Sanitation)
                      </h3>
                      <p className="text-sm text-[#5C6760] leading-relaxed">
                        Partner with Samajbandh to fulfill corporate social responsibility mandates with audited impact, transparent ESG metrics, and direct employee volunteering engagement.
                      </p>

                      <div className="space-y-2 pt-2 text-xs sm:text-sm text-[#1F2421]">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#143D2B]" />
                          <span>Adopt a Village Cluster: Fund 1-year pad supply & fellowship for 500 menstruators</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#143D2B]" />
                          <span>Establish an SHG Micro-Production Centre: Provide sewing machines & artisan training</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#143D2B]" />
                          <span>Transform a Gaokor Rest Shed: Solar electrification, water tank & sanitation setup</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-5 bg-[#FBF9F5] p-6 rounded-2xl border border-[#E5DFC5] space-y-3 text-xs">
                      <span className="font-bold text-[#143D2B] uppercase block">CSR Compliance Credentials</span>
                      <div className="space-y-1.5 text-[#5C6760]">
                        <p>• MCA Registration: <strong>CSR-1 (CSR00049219)</strong></p>
                        <p>• Income Tax: <strong>80G & 12A Certified</strong></p>
                        <p>• Detailed quarterly audit & photo-verified impact reporting</p>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            </section>
          ),

          // 11.3 APPLICATION FORM WITH DATE RANGE & DURATION SELECTOR
          applicationForm: (
            <section 
              id="application-form-section" 
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24" 
              aria-label="Application Form"
            >
              <div className="bg-[#FBF9F5] rounded-3xl p-6 sm:p-10 lg:p-12 border border-[#E5DFC5] space-y-8 shadow-sm">
          
                <div className="max-w-3xl space-y-2">
                  <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-[#143D2B] tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#D99B26]" />
                    <span>Step Into Action • Cohorts Start 1st & 15th of Every Month</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-serif-heading font-bold text-[#1F2421]">
                    Volunteer & Internship Application Form
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5C6760] leading-relaxed">
                    Select your role, preferred duration (1 week, 1 month, or custom dates), location mode, and domain of interest. Our team will review your application and respond within 48 hours.
                  </p>
                </div>

                {status === 'success' ? (
                  <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#E5DFC5] text-center space-y-5 max-w-xl mx-auto shadow-lg">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-9 h-9" />
                    </div>
                    <h4 className="text-2xl font-bold font-serif-heading text-[#143D2B]">
                      Application Received!
                    </h4>
                    <p className="text-xs sm:text-sm text-[#5C6760] leading-relaxed">
                      Thank you, <strong className="text-slate-900">{name}</strong>! We have registered your application for the <strong className="text-[#143D2B]">{roleType.toUpperCase()}</strong> program for a duration of <strong className="text-[#C85A32]">{getDurationLabel()}</strong>.
                    </p>
                    <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-left text-xs text-emerald-950 space-y-1.5">
                      <div className="font-bold flex items-center gap-1.5 text-emerald-900">
                        <Check className="w-4 h-4 text-emerald-600" />
                        <span>Next Steps:</span>
                      </div>
                      <p>1. An onboarding information booklet and assignment details have been emailed to <strong>{email}</strong>.</p>
                      <p>2. Our volunteer & internship coordinator will connect with you via WhatsApp ({phone}) within 2 business days.</p>
                    </div>
                    <button
                      onClick={() => {
                        setStatus('idle');
                        setName('');
                        setEmail('');
                        setPhone('');
                        setCity('');
                        setCollegeOrOrg('');
                        setNotes('');
                      }}
                      className="px-6 py-3 rounded-xl bg-[#143D2B] text-white text-xs font-bold hover:bg-[#1E533B] transition-colors"
                    >
                      Submit Another Application
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E5DFC5] space-y-8 shadow-sm">
              
                    {/* STEP 1: ROLE SELECTION */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-[#1F2421] uppercase tracking-wider">
                        1. Choose Your Engagement Pathway *
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: 'volunteer', label: 'Volunteer', desc: 'Flexible weekend drives, community camps, school sessions' },
                          { id: 'intern', label: 'Internship', desc: '1 week to 3 months structured academic or field project + LOR' },
                          { id: 'fellow', label: 'Arogya Fellow', desc: '6-Month full-time rural cohort with ₹15,000/mo stipend' }
                        ].map((r) => (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => {
                              setRoleType(r.id as any);
                              if (r.id === 'volunteer') setActiveTab('volunteer');
                              if (r.id === 'intern') setActiveTab('internship');
                              if (r.id === 'fellow') setActiveTab('fellowship');
                            }}
                            className={`p-4 rounded-2xl border text-left transition-all ${
                              roleType === r.id
                                ? 'border-[#143D2B] bg-emerald-50/50 ring-2 ring-[#143D2B]'
                                : 'border-slate-200 hover:border-slate-300 bg-white'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm text-slate-900">{r.label}</span>
                              {roleType === r.id && <Check className="w-4 h-4 text-[#143D2B]" />}
                            </div>
                            <p className="text-xs text-slate-500 leading-snug">{r.desc}</p>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* STEP 2: DURATION PRESET & DATE RANGE PICKER */}
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold text-[#1F2421] uppercase tracking-wider">
                          2. Select Duration / Time Range *
                        </label>
                        <span className="text-xs font-bold text-[#C85A32]">
                          Selected: {getDurationLabel()}
                        </span>
                      </div>

                      {/* Preset Pills */}
                      <div className="flex flex-wrap gap-2">
                        {[
                          { id: '1-week', label: '1 Week (Sprint)' },
                          { id: '2-weeks', label: '2 Weeks (Immersion)' },
                          { id: '1-month', label: '1 Month (Standard)' },
                          { id: '2-months', label: '2 Months (Summer/Winter)' },
                          { id: '3-months', label: '3 Months (In-Depth)' },
                          { id: '6-months', label: '6 Months (Fellowship)' },
                          { id: 'custom', label: '📅 Custom Date Range' }
                        ].map((dur) => {
                          const isSelected = dur.id === 'custom' ? isCustomDate : (!isCustomDate && selectedDuration === dur.id);
                          return (
                            <button
                              key={dur.id}
                              type="button"
                              onClick={() => {
                                if (dur.id === 'custom') {
                                  setIsCustomDate(true);
                                } else {
                                  setIsCustomDate(false);
                                  setSelectedDuration(dur.id);
                                }
                              }}
                              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                                isSelected
                                  ? 'bg-[#143D2B] text-white shadow-sm'
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                              }`}
                            >
                              {dur.label}
                            </button>
                          );
                        })}
                      </div>

                      {/* Custom Date Range Pickers (Active when Custom is selected) */}
                      {isCustomDate && (
                        <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in-50">
                          <div>
                            <label className="block text-xs font-bold text-slate-900 mb-1">Proposed Start Date *</label>
                            <input
                              type="date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#143D2B] focus:outline-hidden"
                              required={isCustomDate}
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-slate-900 mb-1">Proposed End Date *</label>
                            <input
                              type="date"
                              value={endDate}
                              min={startDate}
                              onChange={(e) => setEndDate(e.target.value)}
                              className="w-full px-3.5 py-2.5 text-sm bg-white border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#143D2B] focus:outline-hidden"
                              required={isCustomDate}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* STEP 3: ENGAGEMENT MODE & WEEKLY AVAILABILITY */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2 border-t border-slate-100">
                      <div>
                        <label className="block text-xs font-bold text-[#1F2421] uppercase mb-2">
                          3. Mode of Engagement *
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                          {[
                            { id: 'on-ground', label: 'On-Ground', desc: 'Pune / Gadchiroli' },
                            { id: 'hybrid', label: 'Hybrid', desc: 'Field + Remote' },
                            { id: 'remote', label: 'Remote', desc: 'Digital / Content' }
                          ].map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => setMode(m.id as any)}
                              className={`p-2.5 rounded-xl border text-center transition-all ${
                                mode === m.id
                                  ? 'border-[#143D2B] bg-emerald-50 text-[#143D2B] font-bold ring-1 ring-[#143D2B]'
                                  : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                              }`}
                            >
                              <div className="text-xs font-bold">{m.label}</div>
                              <div className="text-[10px] text-slate-500">{m.desc}</div>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-[#1F2421] uppercase mb-2">
                          Weekly Commitment Hours *
                        </label>
                        <select
                          value={weeklyHours}
                          onChange={(e) => setWeeklyHours(e.target.value)}
                          className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                        >
                          <option value="weekend">Weekends Only (Saturdays / Sundays)</option>
                          <option value="part-time">Part-Time (10 - 15 Hours / Week)</option>
                          <option value="full-time">Full-Time (35 - 40 Hours / Week)</option>
                          <option value="flexible">Flexible / Project-Based</option>
                        </select>
                      </div>
                    </div>

                    {/* STEP 4: DOMAINS OF INTEREST */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-bold text-[#1F2421] uppercase tracking-wider">
                        4. Areas of Interest & Contribution (Select multiple)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                        {[
                          'School & Community Workshops',
                          'Micro-Centre Production & QA',
                          'Tribal Rest Shed (Kurma) Reforms',
                          'Public Health Research & Baseline Surveys',
                          'Social Media, Photography & Film',
                          'Marathi / Hindi Educational Translation'
                        ].map((dom) => {
                          const isChecked = domains.includes(dom);
                          return (
                            <button
                              key={dom}
                              type="button"
                              onClick={() => toggleDomain(dom)}
                              className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs text-left transition-all ${
                                isChecked
                                  ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-bold'
                                  : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                              }`}
                            >
                              <div className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border ${
                                isChecked ? 'bg-[#143D2B] border-[#143D2B] text-white' : 'border-slate-300 bg-white'
                              }`}>
                                {isChecked && <Check className="w-3 h-3" />}
                              </div>
                              <span className="leading-tight">{dom}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* STEP 5: PERSONAL & ACADEMIC COORDINATES */}
                    <div className="space-y-4 pt-2 border-t border-slate-100">
                      <label className="block text-xs font-bold text-[#1F2421] uppercase tracking-wider">
                        5. Contact & Academic Details
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-[#1F2421] mb-1">Full Name *</label>
                          <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g. Snehal Deshmukh"
                            className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1F2421] mb-1">City / District / State *</label>
                          <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="e.g. Pune, Maharashtra"
                            className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1F2421] mb-1">Email Address *</label>
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="snehal@example.com"
                            className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#1F2421] mb-1">WhatsApp / Phone *</label>
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                            required
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-[#1F2421] mb-1">
                            College / University / Company (Optional for Interns/Volunteers)
                          </label>
                          <input
                            type="text"
                            value={collegeOrOrg}
                            onChange={(e) => setCollegeOrOrg(e.target.value)}
                            placeholder="e.g. Tata Institute of Social Sciences (TISS) / Pune University / Symbiosis"
                            className="w-full px-3.5 py-2.5 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-xs font-bold text-[#1F2421] mb-1">
                            Why would you like to join? / Specific skills or requirements
                          </label>
                          <textarea
                            rows={3}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            placeholder="Tell us about your background, why menstrual health advocacy matters to you, or any college internship requirements..."
                            className="w-full px-3.5 py-2 text-sm bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
                          ></textarea>
                        </div>
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="pt-4 border-t border-slate-100">
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="w-full py-4 rounded-2xl bg-[#143D2B] hover:bg-[#1E533B] text-white font-bold text-sm shadow-lg shadow-emerald-950/10 transition-all flex items-center justify-center gap-2 transform active:scale-[0.99]"
                      >
                        <Send className="w-4 h-4" />
                        <span>
                          {status === 'loading' ? 'Submitting Application...' : `Submit Application (${roleType.toUpperCase()} • ${getDurationLabel()})`}
                        </span>
                      </button>
                      <p className="text-center text-xs text-slate-500 mt-2">
                        All applicants receive an orientation call and official confirmation pass via email.
                      </p>
                    </div>
                  </form>
                )}

              </div>
            </section>
          ),

          // 11.4 FREQUENTLY ASKED QUESTIONS ABOUT VOLUNTEERING & INTERNSHIPS
          faq: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Volunteer & Internship FAQ">
              <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E5DFC5] space-y-8">
                <div className="max-w-2xl space-y-2">
                  <span className="text-xs uppercase font-bold text-[#C85A32] tracking-wider">
                    Common Queries Answered
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#143D2B]">
                    Volunteering & Internship FAQs
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-2">
                    <h4 className="font-bold text-sm text-[#143D2B] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#D99B26] shrink-0" />
                      <span>Can I do a 1-week or 2-week internship?</span>
                    </h4>
                    <p className="text-xs text-[#5C6760] leading-relaxed">
                      Yes! We offer a <strong>1-Week Rapid Field Sprint</strong> and <strong>2-Week Immersion</strong> specifically structured for students on short semester breaks. You participate in rural school workshops, SHG production tours, and field data collection.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-2">
                    <h4 className="font-bold text-sm text-[#143D2B] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#D99B26] shrink-0" />
                      <span>Do I receive a certificate and Letter of Recommendation?</span>
                    </h4>
                    <p className="text-xs text-[#5C6760] leading-relaxed">
                      Yes. Every intern who completes their assigned tenure and project deliverable receives an official <strong>Certificate of Social Impact</strong> and a personalized <strong>Letter of Recommendation (LOR)</strong> signed by Founder Sachin Asha Subhash.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-2">
                    <h4 className="font-bold text-sm text-[#143D2B] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#D99B26] shrink-0" />
                      <span>Can I intern remotely or digitally?</span>
                    </h4>
                    <p className="text-xs text-[#5C6760] leading-relaxed">
                      Yes. We offer remote and hybrid roles for graphic design, video editing, social media management, Marathi/Hindi content translation, educational curriculum design, and secondary public health research.
                    </p>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#FBF9F5] border border-[#E5DFC5] space-y-2">
                    <h4 className="font-bold text-sm text-[#143D2B] flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-[#D99B26] shrink-0" />
                      <span>Is food and accommodation provided during rural field camps?</span>
                    </h4>
                    <p className="text-xs text-[#5C6760] leading-relaxed">
                      For designated field camps in Junnar and Gadchiroli, community stay with local host families or village community halls is arranged by Samajbandh, along with clean, hygienic vegetarian meals and field travel assistance.
                    </p>
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

    </div>
  );
};
