import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { ShieldCheck, FileText, RefreshCw, Truck, Lock, CheckCircle2 } from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface PoliciesPageProps {
  onOpenDonate: () => void;
}

export const PoliciesPage: React.FC<PoliciesPageProps> = ({ onOpenDonate }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'refund' | 'shipping'>('privacy');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['privacy', 'terms', 'refund', 'shipping'].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [location.search]);

  return (
    <div className="space-y-16 sm:space-y-24 py-6 sm:py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="policies"
        sections={{
          // Hero Header
          hero: (
            <section className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-12 lg:p-16 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="max-w-3xl space-y-4 relative z-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/80 backdrop-blur-md border border-slate-700/80 text-xs font-bold uppercase tracking-widest text-emerald-400">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Legal, Privacy & Compliance</span>
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
                  Institutional Policies & Donor Protection
                </h1>
                <p className="text-base text-slate-300 leading-relaxed">
                  Transparent, compliant guidelines outlining our data privacy protections, order fulfillment terms, refund standards, and statutory Section 80G tax exemptions.
                </p>
              </div>
            </section>
          ),

          // Tabs Switcher
          tabs: (
            <section className="flex flex-wrap items-center justify-center gap-3">
              {[
                { id: 'privacy', label: 'Privacy Policy', icon: Lock },
                { id: 'terms', label: 'Terms & Conditions', icon: FileText },
                { id: 'refund', label: 'Donation & Refund Policy', icon: RefreshCw },
                { id: 'shipping', label: 'Shipping & Delivery', icon: Truck }
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 shadow-xs ${
                      activeTab === tab.id
                        ? 'bg-slate-900 text-white shadow-md'
                        : 'bg-white text-slate-600 border border-slate-200 hover:text-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </section>
          ),

          // Tab Content Box
          content: (
            <section className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8 text-slate-700 leading-relaxed">
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Donor & User Privacy Policy</h2>
                  <p className="text-xs text-slate-500 font-semibold">Last updated: January 2025 • Samajbandh Social Impact Trust</p>
                  <p className="text-sm">
                    Samajbandh is committed to respecting and protecting the personal privacy of all website visitors, donors, volunteers, and workshop participants. We do not sell, rent, trade, or share your contact or transaction details with any third-party advertisers or commercial entities.
                  </p>
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base font-black text-slate-900">1. Information Collection</h3>
                    <p className="text-sm">
                      When you make a donation, register for a fellowship, or place an order for Asha cloth pads, we collect details including your name, email, phone number, mailing address, and PAN (Permanent Account Number, required by the Indian Income Tax Department for 80G receipts).
                    </p>
                    <h3 className="text-base font-black text-slate-900">2. Payment Security</h3>
                    <p className="text-sm">
                      All online transactions are encrypted with 256-bit SSL protocols and processed through RBI-authorized payment gateways. We never store credit card numbers, CVVs, or net banking passwords on our servers.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Terms of Service & Use</h2>
                  <p className="text-xs text-slate-500 font-semibold">Effective: 2025</p>
                  <p className="text-sm">
                    By accessing the Samajbandh website, you agree to comply with our institutional guidelines and standard non-profit usage terms. All educational materials, research reports, and comic books published under our Creative Commons/Public Health license may be utilized for non-commercial educational purposes with proper attribution.
                  </p>
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base font-black text-slate-900">1. Educational & MHM Medical Disclaimer</h3>
                    <p className="text-sm">
                      Information provided on this portal is intended for public health awareness and menstrual hygiene education. It does not constitute formal medical diagnosis. For clinical reproductive concerns, always consult a licensed medical practitioner or gynecologist.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'refund' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Donation & Product Refund Policy</h2>
                  <p className="text-xs text-slate-500 font-semibold">Clear, fair guidelines for donors and product buyers.</p>
                  <p className="text-sm">
                    As a registered non-profit trust, general donations are immediately allocated towards ongoing grassroots health interventions, rural production cloth subsidies, and educational kits.
                  </p>
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base font-black text-slate-900">1. Erroneous Online Donations</h3>
                    <p className="text-sm">
                      If an unintentional duplicate donation or typographical amount error occurs, please contact us at <a href="mailto:contact@samajbandh.org" className="font-bold text-[#C85A32] underline">contact@samajbandh.org</a> within 7 days of the transaction with proof of payment. Refunds will be processed within 10-14 banking days.
                    </p>
                    <h3 className="text-base font-black text-slate-900">2. Asha Pad Product Returns</h3>
                    <p className="text-sm">
                      Due to strict intimate hygiene and sanitary regulations, opened cloth pad packaging cannot be returned. If you receive damaged or defective transit items, we will provide an immediate replacement at zero cost.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'shipping' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-black text-slate-900">Shipping & Logistics Fulfillment</h2>
                  <p className="text-xs text-slate-500 font-semibold">Pan-India delivery across all pincodes.</p>
                  <p className="text-sm">
                    Asha Reusable Cloth Pads, School Kits, and Training IEC materials are dispatched directly from our central community hub in Pune, Maharashtra.
                  </p>
                  <div className="space-y-4 pt-2">
                    <h3 className="text-base font-black text-slate-900">1. Delivery Timelines</h3>
                    <p className="text-sm">
                      Standard orders within Maharashtra are delivered within 3-5 business days. Outstation and pan-India orders are delivered within 5-8 business days via India Post and reputed courier partners.
                    </p>
                    <h3 className="text-base font-black text-slate-900">2. Bulk Institutional Orders</h3>
                    <p className="text-sm">
                      For CSR consignments exceeding 500 units, custom logistics tracking and milestone-based dispatch schedules are provided with direct truck delivery to beneficiary schools or partner NGO nodes.
                    </p>
                  </div>
                </div>
              )}
            </section>
          ),

          // Bottom CTA
          bottomCta: (
            <BottomCTABand onOpenDonate={onOpenDonate} />
          ),
        }}
      />

    </div>
  );
};
