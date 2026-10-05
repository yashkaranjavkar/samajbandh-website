import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Users, ArrowRight } from 'lucide-react';

interface BottomCTABandProps {
  onOpenDonate: () => void;
  title?: string;
  subtitle?: string;
}

export const BottomCTABand: React.FC<BottomCTABandProps> = ({
  onOpenDonate,
  title = "Join the Movement for Menstrual Dignity & Equity",
  subtitle = "Whether through monthly sponsorship, volunteer mentorship, cloth donation, or institutional partnership — your contribution creates measurable grassroots change."
}) => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" aria-label="Call to action">
      <div className="bg-slate-900 text-white rounded-[2.5rem] p-8 sm:p-14 border border-slate-800 shadow-2xl relative overflow-hidden">
        {/* Decorative ambient gradients */}
        <div className="absolute -right-20 -bottom-20 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="absolute -left-20 -top-20 w-96 h-96 rounded-full bg-rose-500/10 blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/90 text-emerald-400 border border-slate-700 text-xs font-bold uppercase tracking-widest">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Grassroots Transformation
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight max-w-3xl mx-auto">
            {title}
          </h2>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              id="cta-band-volunteer-link"
              to="/get-involved"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider bg-white text-slate-900 hover:bg-slate-100 shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Become a Volunteer</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              id="cta-band-donate-btn"
              onClick={onOpenDonate}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-wider bg-[#C85A32] text-white hover:bg-[#b54c26] shadow-xl shadow-rose-950/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Heart className="w-4 h-4 fill-white" />
              <span>Donate Now (80G Benefit)</span>
            </button>
          </div>

          <p className="text-xs text-slate-400 font-medium">
            50% Tax Deduction under Section 80G • Direct Rural Impact • Transparent Audits
          </p>
        </div>
      </div>
    </section>
  );
};
