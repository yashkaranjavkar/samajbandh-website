import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { BottomCTABand } from '../components/layout/BottomCTABand';

interface FaqPageProps {
  onOpenDonate: () => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onOpenDonate }) => {
  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="FAQ Hero">
        <div className="bg-[#143D2B] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-emerald-800">
          <div className="max-w-3xl space-y-5 relative z-10">
            <span className="text-xs uppercase font-bold text-[#D99B26] tracking-widest block">HELP CENTRE</span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heading font-extrabold text-white leading-tight">
              Frequently Asked Questions
            </h1>
            <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
              Quick answers about our work, Asha reusable cloth pads, menstrual health, donations and volunteering.
            </p>
          </div>
        </div>
      </section>

      {/* Questions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Frequently asked questions">
        <FaqAccordion showTabs showSearch withSchema />
      </section>

      {/* Still need help */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Contact us">
        <div className="bg-[#FBF9F5] border border-[#E5DFC5] rounded-3xl p-8 text-center space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#143D2B]/10 text-[#143D2B] flex items-center justify-center mx-auto">
            <MessageCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-serif-heading font-bold text-[#1F2421]">Still have a question?</h2>
          <p className="text-sm text-[#5C6760]">Our team replies within 24 business hours.</p>
          <Link
            to="/contact"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-[#143D2B] hover:bg-[#1E533B] text-white font-bold text-sm transition-colors"
          >
            Contact us
          </Link>
        </div>
      </section>

      <BottomCTABand onOpenDonate={onOpenDonate} />
    </div>
  );
};
