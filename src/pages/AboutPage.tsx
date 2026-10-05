import React from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { SdgGoals } from '../components/common/SdgGoals';
import { Timeline } from '../components/interactive/Timeline';
import { Organogram } from '../components/interactive/Organogram';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { CountUpNumber } from '../components/common/CountUpNumber';
import { AWARDS_DATA } from '../data/mockData';
import { 
  Heart, 
  ShieldCheck, 
  Target, 
  Sparkles, 
  BookOpen, 
  FileText, 
  Award, 
  Users, 
  CheckCircle2, 
  ArrowRight,
  Download
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface AboutPageProps {
  onOpenDonate: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenDonate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="about"
        sections={{
          // 6.1 GENESIS & FOUNDER'S STORY HERO BENTO
          founderStory: (
            <section aria-label="Genesis and Founder Story">
              <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-slate-800">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
                  <div className="lg:col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold uppercase tracking-widest text-emerald-400">
                      <Sparkles className="w-4 h-4 text-emerald-400" />
                      <span>Genesis & Origins</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
                      Born From Maternal Tribute, Grounded in Human Dignity
                    </h1>
                    <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                      Founded by social worker <span className="text-white font-bold">Sachin Asha Subhash</span> (who proudly took his mother Asha’s name as his middle name), Samajbandh began with a simple yet radical realization: <span className="italic text-emerald-300">Menstrual equity is not just a women's hygiene issue; it is a foundational human rights, economic, and ecological priority.</span>
                    </p>
                    <p className="text-sm text-slate-400 leading-relaxed">
                      Witnessing rural mothers and adolescent girls suffer reproductive infections from damp rags hidden away from sunlight, and witnessing tribal women banished to perilous Gaokor seclusion huts in Gadchiroli, Sachin mobilized grassroots collectives to create an integrated ecosystem of education, livelihoods, and dignity.
                    </p>

                    <div className="pt-2 flex flex-wrap gap-4">
                      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-200">
                        <span className="font-bold text-amber-400 block uppercase tracking-wider text-[10px]">NGO Registration</span>
                        <span className="font-medium text-sm mt-0.5 block">Public Charitable Trust (Maharashtra)</span>
                      </div>
                      <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700 text-xs text-slate-200">
                        <span className="font-bold text-[#C85A32] block uppercase tracking-wider text-[10px]">Statutory Approvals</span>
                        <span className="font-medium text-sm mt-0.5 block">12A & 80G Certified • CSR-1 Registered</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-5">
                    <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-2 border-slate-700">
                      <img
                        src="/images/team/founder-trustee-sachin.jpg"
                        alt="Sachin Asha Subhash - Founder Samajbandh"
                        className="w-full h-96 object-cover object-top bg-white"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-6">
                        <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Founder & Managing Trustee</span>
                        <h3 className="text-xl font-black text-white mt-0.5">Sachin Asha Subhash</h3>
                        <p className="text-xs text-emerald-300 font-medium">MSW (Tata Institute of Social Sciences) • Grassroots Innovator</p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </section>
          ),

          // 6.2 VISION, MISSION & CORE VALUES
          visionMission: (
            <section aria-label="Vision Mission and Values">
              <SectionHeading
                eyebrow="Our Guiding Compass"
                title="Vision, Mission & Core Values"
                subtitle="The moral and methodological principles that shape every workshop, pad pattern, and tribal dialogue."
                centered
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 mt-6">
                <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 space-y-4 shadow-sm">
                  <span className="text-xs font-bold uppercase text-emerald-700 tracking-wider block">
                    OUR VISION
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    A Society Where Period Shame is Eradicated and Bodily Autonomy is Guaranteed.
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    We envision every girl in every rural and tribal hamlet attending school uninterrupted, every mother having access to safe and eco-friendly menstrual care, and every community speaking about natural biological cycles without fear or humiliation.
                  </p>
                </div>

                <div className="bg-white p-8 sm:p-10 rounded-[2rem] border border-slate-200 space-y-4 shadow-sm">
                  <span className="text-xs font-bold uppercase text-[#C85A32] tracking-wider block">
                    OUR MISSION
                  </span>
                  <h3 className="text-2xl font-black text-slate-900">
                    Decentralize Menstrual Health & Green Economic Dignity.
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    To empower grassroots women as pad entrepreneurs, train rural youth as community health fellows, and partner with schools and tribal councils to eliminate dangerous isolation practices through scientifically validated interventions.
                  </p>
                </div>
              </div>

              {/* 5 Core Values Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {[
                  { title: 'Dignity First', desc: 'Preserving bodily respect, confidentiality, and cultural sensitivity in every interaction.' },
                  { title: 'Grassroots Ownership', desc: 'Interventions are managed and led by local women tailors and indigenous fellows.' },
                  { title: 'Ecological Responsibility', desc: 'Zero single-use plastic. Promoting washable, biodegradable 100% cotton alternatives.' },
                  { title: 'Scientific Demystification', desc: 'Replacing taboos with accurate biological, anatomical, and gynecological education.' },
                  { title: 'Uncompromising Transparency', desc: 'Audited financials, 80G tax exemptions, and verified public impact reports.' }
                ].map((val, i) => (
                  <div key={i} className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-2 hover:border-slate-300 transition-colors">
                    <span className="text-xs font-black text-[#C85A32]">0{i + 1}</span>
                    <h4 className="text-sm font-bold text-slate-900">{val.title}</h4>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">{val.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          ),

          // 6.3 THEORY OF CHANGE WITH COUNT-UP NUMBERS
          theoryOfChange: (
            <section className="bg-slate-900 text-white py-12 sm:py-16 px-6 sm:px-10 lg:px-14 rounded-[2.5rem] border border-slate-800 shadow-2xl" aria-label="Theory of Change">
              <SectionHeading
                eyebrow="Systemic Pathway"
                title="Theory of Change: From Stigma to Sovereignty"
                subtitle="How our structured interventions translate grassroots inputs into enduring inter-generational transformation."
                light
                centered
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-6">
                {[
                  {
                    step: '1. INPUTS & CAPACITY',
                    title: 'Decentralized Toolkits',
                    items: ['Clean cotton fabric sourcing', 'Sewing machines & QA standards', 'Medical-verified MHM curriculum', 'Fellowship stipends & mentorship']
                  },
                  {
                    step: '2. ACTIVITIES & FIELDWORK',
                    title: 'Community Interventions',
                    items: ['School gender equity circles', 'Asha pad micro-manufacturing', 'Gaokor seclusion hut reforms', 'Master ToT certifications for ASHAs']
                  },
                  {
                    step: '3. DIRECT OUTPUTS',
                    title: 'Tangible Milestones',
                    items: [
                      '50,000+ menstruators equipped',
                      '15 operational stitching units',
                      '300+ youth fellows & volunteers',
                      '120+ villages stigma-free'
                    ]
                  },
                  {
                    step: '4. LONG-TERM OUTCOMES',
                    title: 'Generational Impact',
                    items: ['Zero school dropouts at puberty', 'Lower reproductive infections', 'Stable livelihoods for women', 'Abolition of punitive Gaokor isolation']
                  }
                ].map((tier, idx) => (
                  <div key={idx} className="p-6 rounded-[2rem] bg-slate-800/90 border border-slate-700/80 flex flex-col justify-between space-y-4">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 block mb-1">
                        {tier.step}
                      </span>
                      <h4 className="text-lg font-bold text-white">
                        {tier.title}
                      </h4>
                      <ul className="mt-3 space-y-2 text-xs text-slate-300">
                        {tier.items.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] shrink-0"></span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ),

          // 6.4 UN SUSTAINABLE DEVELOPMENT GOALS
          sdgGoals: (
            <SdgGoals />
          ),

          // 6.5 TIMELINE (Milestone History)
          timeline: (
            <section aria-label="Organizational Milestones">
              <SectionHeading
                eyebrow="Our Journey"
                title="Milestones in Menstrual Equity (2018 - 2026)"
                subtitle="From a grassroots pilot in Junnar to a statewide movement touching over 120 villages."
                centered
              />
              <div className="mt-6">
                <Timeline />
              </div>
            </section>
          ),

          // 6.6 ORGANOGRAM / GOVERNANCE STRUCTURE
          organogram: (
            <section aria-label="Governance and Structure">
              <Organogram />
            </section>
          ),

          // 6.9 STATUTORY COMPLIANCE & TRANSPARENCY (80G, 12A, FCRA, Audits)
          compliance: (
            <section aria-label="Statutory Compliance">
              <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 border border-slate-200 shadow-sm space-y-8">
          
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-6">
                  <div>
                    <span className="text-xs uppercase font-bold text-emerald-700 tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Institutional Integrity
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                      Statutory Compliance & Legal Registrations
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                      Samajbandh operates with audited transparency, strict financial governance, and full legal accountability.
                    </p>
                  </div>

                  <button
                    onClick={onOpenDonate}
                    className="px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shrink-0 shadow-md flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Donate with 80G Tax Exemption</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    {
                      title: 'Section 80G Tax Exemption',
                      desc: 'All individual and corporate donations to Samajbandh are eligible for 50% income tax exemption under Section 80G.',
                      idNumber: 'AAATS8923PF20214'
                    },
                    {
                      title: 'Section 12A Registration',
                      desc: 'Recognized as an official charitable institution under the Income Tax Act, 1961.',
                      idNumber: '12A/PNE/2019/332'
                    },
                    {
                      title: 'Ministry of Corporate Affairs (CSR-1)',
                      desc: 'Certified to receive Corporate Social Responsibility (CSR) funds under Section 135 of the Companies Act.',
                      idNumber: 'CSR00049219'
                    },
                    {
                      title: 'Maharashtra Public Trusts Act',
                      desc: 'Registered with the Charity Commissioner, Pune Division.',
                      idNumber: 'E/7892/PUNE'
                    }
                  ].map((reg, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        Government Certified
                      </span>
                      <h4 className="text-sm font-black text-slate-900">{reg.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-medium">{reg.desc}</p>
                      <div className="pt-2 text-[11px] font-mono text-slate-800 font-semibold">
                        Reg No: {reg.idNumber}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Downloadable Annual Reports Strip */}
                <div className="pt-4 border-t border-slate-100">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider mb-3">
                    Download Audited Financials & Annual Reports
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { year: '2024-2025 Annual Impact & Audited Report', size: '2.8 MB' },
                      { year: '2023-2024 Annual Impact & Audited Report', size: '2.4 MB' },
                      { year: '2022-2023 Annual Impact & Audited Report', size: '1.9 MB' }
                    ].map((rep, i) => (
                      <div key={i} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between text-xs hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-2.5">
                          <FileText className="w-4 h-4 text-[#C85A32]" />
                          <span className="font-semibold text-slate-900">{rep.year}</span>
                        </div>
                        <button 
                          onClick={() => alert(`Downloading ${rep.year}...`)}
                          className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-800 transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
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
