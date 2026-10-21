import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  CheckCircle2, 
  Award, 
  ExternalLink,
  Lock,
  Building2,
  PieChart,
  Users,
  Eye,
  FileCheck
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface TransparencyPageProps {
  onOpenDonate: () => void;
}

export const TransparencyPage: React.FC<TransparencyPageProps> = ({ onOpenDonate }) => {
  const [activeTab, setActiveTab] = useState<'financials' | 'certifications' | 'policies' | 'governance'>('financials');

  const AUDIT_REPORTS = [
    { year: 'FY 2024-25 (Provisional)', size: '2.4 MB', auditor: 'M/s Kulkarni & Associates, Pune', status: 'Audited & Filed', date: 'June 2025' },
    { year: 'FY 2023-24', size: '3.1 MB', auditor: 'M/s Kulkarni & Associates, Pune', status: 'Audited & Filed', date: 'July 2024' },
    { year: 'FY 2022-23', size: '2.8 MB', auditor: 'M/s Kulkarni & Associates, Pune', status: 'Audited & Filed', date: 'August 2023' },
    { year: 'FY 2021-22', size: '1.9 MB', auditor: 'M/s Kulkarni & Associates, Pune', status: 'Audited & Filed', date: 'July 2022' }
  ];

  const STATUTORY_CERTS = [
    {
      title: 'Section 80G Tax Exemption Certificate',
      regNo: 'AAATS9823RF20214',
      validity: 'Perpetual (AY 2022-23 onwards)',
      authority: 'Income Tax Department of India',
      benefit: '50% tax deduction for Indian donors under Section 80G of the Income Tax Act.'
    },
    {
      title: 'Section 12A Registration Certificate',
      regNo: 'AAATS9823RE20201',
      validity: 'Valid & Active',
      authority: 'Commissioner of Income Tax (Exemptions), Pune',
      benefit: 'Non-profit tax exemption recognition for charitable health and education trusts.'
    },
    {
      title: 'CSR-1 Registration (Ministry of Corporate Affairs)',
      regNo: 'CSR00049281',
      validity: 'Permanent Registration',
      authority: 'MCA, Government of India',
      benefit: 'Authorized partner to receive Corporate Social Responsibility (CSR) funds.'
    },
    {
      title: 'Maharashtra Public Charitable Trust Registration',
      regNo: 'E-38291/Pune',
      validity: 'Registered under Bombay Public Trusts Act, 1950',
      authority: 'Charity Commissioner, Maharashtra',
      benefit: 'Legal standing as an accredited public social service trust.'
    },
    {
      title: 'NITI Aayog NGO Darpan Enrolment',
      regNo: 'MH/2021/0293841',
      validity: 'Verified & Active',
      authority: 'NITI Aayog, Government of India',
      benefit: 'Accredited for central and state public health partnerships.'
    }
  ];

  const GOVERNANCE_POLICIES = [
    {
      title: 'Child Protection & Safeguarding Policy',
      description: 'Zero tolerance for harassment or exploitation of adolescent girls in school and village workshop programs.',
      updated: 'Updated March 2025'
    },
    {
      title: 'POSH (Prevention of Sexual Harassment) Policy',
      description: 'Strict workplace safety protocols and Internal Complaints Committee (ICC) adhering to statutory laws.',
      updated: 'Updated January 2025'
    },
    {
      title: 'Whistleblower & Anti-Corruption Framework',
      description: 'Confidential reporting mechanisms for fraud, bribery, or ethics violations with direct trustee review.',
      updated: 'Updated November 2024'
    },
    {
      title: 'Gender Non-Discrimination & Inclusion Guidelines',
      description: 'Affirmative hiring and supportive community guidelines respecting tribal customs and marginalized identities.',
      updated: 'Updated February 2025'
    }
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="transparency"
        sections={{
          // Hero Bento Card
          hero: (
            <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
              <div className="max-w-3xl space-y-6 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold uppercase tracking-widest text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Public Accountability & Governance</span>
                </div>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.12]">
                  100% Transparent, Audited & Certified
                </h1>
                <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
                  Every rupee donated and every cloth pad produced is publicly accountable. Samajbandh maintains rigorous statutory compliance, audited balance sheets, and robust safeguarding frameworks.
                </p>
                <div className="flex flex-wrap gap-4 pt-2">
                  <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex items-center gap-3">
                    <Award className="w-6 h-6 text-amber-400" />
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">Section 80G Certified</span>
                      <span className="text-sm font-bold text-white">50% Tax Deduction</span>
                    </div>
                  </div>
                  <div className="p-4 bg-slate-800/90 rounded-2xl border border-slate-700/80 flex items-center gap-3">
                    <Building2 className="w-6 h-6 text-emerald-400" />
                    <div>
                      <span className="text-xs uppercase font-bold text-slate-400 block">CSR-1 Registered</span>
                      <span className="text-sm font-bold text-white">Govt of India (MCA)</span>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          ),

          // Tabs Navigation
          tabs: (
            <section className="flex flex-wrap items-center justify-center gap-3">
              {[
                { id: 'financials', label: 'Audited Financials' },
                { id: 'certifications', label: 'Statutory Certifications & 80G' },
                { id: 'policies', label: 'Safeguarding & Governance' },
                { id: 'governance', label: 'Fund Utilization Ratio' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all shadow-xs ${
                    activeTab === tab.id
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </section>
          ),

          // Financials Tab
          financials:
            activeTab === 'financials' && (
              <section className="space-y-8 animate-fadeIn">
                <SectionHeading
                  eyebrow="Annual Returns"
                  title="Independent Auditor Statements"
                  subtitle="Download complete audited annual financial returns filed with the Income Tax Department and Charity Commissioner."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {AUDIT_REPORTS.map((report, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition-all">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-bold text-[10px] uppercase tracking-wider border border-emerald-200">
                            {report.status}
                          </span>
                          <span className="text-xs text-slate-500 font-medium">{report.date}</span>
                        </div>
                        <h3 className="text-lg font-black text-slate-900">{report.year}</h3>
                        <p className="text-xs text-slate-500 font-medium">Independent Statutory Auditor: {report.auditor}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs text-slate-400 font-mono">PDF File • {report.size}</span>
                        <a
                          href="#download-statement"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Downloading Audited Report for ${report.year}`);
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-slate-800 transition-colors shadow-xs"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download PDF</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ),

          // Certifications Tab
          certifications:
            activeTab === 'certifications' && (
              <section className="space-y-8 animate-fadeIn">
                <SectionHeading
                  eyebrow="Legal Legitimacy"
                  title="Statutory Registrations & 80G / 12A Accreditations"
                  subtitle="Verified credentials establishing Samajbandh as a licensed non-profit trust compliant with all Indian regulatory frameworks."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {STATUTORY_CERTS.map((cert, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-200">
                          <FileCheck className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-black text-slate-900 leading-snug">{cert.title}</h3>
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                          <div className="flex justify-between">
                            <span className="text-slate-500">Registration No:</span>
                            <span className="font-mono font-bold text-slate-900">{cert.regNo}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-slate-500">Issuing Authority:</span>
                            <span className="font-semibold text-slate-800">{cert.authority}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium pt-1">
                          {cert.benefit}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Active Status: {cert.validity}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ),

          // Safeguarding & Policies Tab
          safeguarding:
            activeTab === 'policies' && (
              <section className="space-y-8 animate-fadeIn">
                <SectionHeading
                  eyebrow="Ethical Standards"
                  title="Institutional Safeguarding & Workplace Policies"
                  subtitle="Our documented governance charters protecting beneficiaries, adolescent girls, staff members, and volunteers."
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {GOVERNANCE_POLICIES.map((pol, idx) => (
                    <div key={idx} className="bg-white p-7 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="w-10 h-10 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center border border-slate-200">
                          <Lock className="w-5 h-5" />
                        </div>
                        <h3 className="text-base font-black text-slate-900">{pol.title}</h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-medium">{pol.description}</p>
                      </div>
                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-500 font-medium">{pol.updated}</span>
                        <a
                          href="#download-policy"
                          onClick={(e) => {
                            e.preventDefault();
                            alert(`Accessing policy document for ${pol.title}`);
                          }}
                          className="font-bold text-slate-900 uppercase tracking-wider hover:text-[#C85A32] flex items-center gap-1"
                        >
                          <span>Read Policy</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            ),

          // Fund Utilization Tab
          fundUtilization:
            activeTab === 'governance' && (
              <section className="space-y-8 animate-fadeIn">
                <SectionHeading
                  eyebrow="Resource Efficiency"
                  title="Where Your Contribution Goes"
                  subtitle="Every donation is optimized directly for community production, raw material subsidy, and youth fellowships."
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                  <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                    <h3 className="text-xl font-black text-slate-900">Fund Allocation Breakdown (FY 2024-25)</h3>
              
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
                          <span>Direct Program Delivery & Asha Pad Distribution</span>
                          <span className="text-emerald-700">76%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-emerald-600 h-3 rounded-full" style={{ width: '76%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
                          <span>Artisan Fair Wages & Tribal Fellowship Honorariums</span>
                          <span className="text-[#C85A32]">14%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-[#C85A32] h-3 rounded-full" style={{ width: '14%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
                          <span>Research, MHM IEC Printing & Digital Literacy</span>
                          <span className="text-amber-600">6%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-amber-500 h-3 rounded-full" style={{ width: '6%' }}></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-bold text-slate-900 mb-1.5">
                          <span>Administration, Statutory Audit & Governance</span>
                          <span className="text-slate-600">4%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                          <div className="bg-slate-500 h-3 rounded-full" style={{ width: '4%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-6 bg-slate-900 text-white p-8 sm:p-10 rounded-[2.5rem] border border-slate-800 shadow-xl space-y-6">
                    <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center border border-slate-700">
                      <PieChart className="w-6 h-6 text-emerald-400" />
                    </div>
                    <h3 className="text-2xl font-black text-white">Lean Administration, Maximum Grassroots Impact</h3>
                    <p className="text-sm text-slate-300 leading-relaxed">
                      Over <span className="font-bold text-emerald-400">90 paise of every rupee</span> goes directly towards field health interventions, raw cloth subsidies, and direct livelihood transfers for rural women artisans.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={onOpenDonate}
                        className="px-7 py-3.5 rounded-2xl bg-[#C85A32] hover:bg-[#b54c26] text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg"
                      >
                        Support the Movement
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            ),

          // Bottom CTA Band
          bottomCta: (
            <BottomCTABand onOpenDonate={onOpenDonate} />
          ),
        }}
      />

    </div>
  );
};
