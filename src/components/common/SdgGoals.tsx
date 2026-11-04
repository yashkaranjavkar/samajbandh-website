import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

// UN Sustainable Development Goals that Samajbandh's programs contribute to.
// `icon` is the official UN SDG tile (public/images/sdg); `photo` is a Samajbandh field photo for that goal.
import {SDG_GOALS} from "../../data/mockData"

export const SdgGoals: React.FC = () => {
  return (
    <section className="bg-white p-8 sm:p-12 rounded-[2.5rem] border border-slate-200 shadow-sm" aria-label="Sustainable Development Goals">
      <SectionHeading
        eyebrow="Global Commitment"
        title="Our Contribution to the UN SDGs"
        subtitle="Every Samajbandh program is aligned with the United Nations Sustainable Development Goals (2030 Agenda)."
        centered
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        {SDG_GOALS.map((goal) => (
          <div
            key={goal.number}
            className="group rounded-[2rem] border border-slate-200 bg-white overflow-hidden flex flex-col hover:border-slate-300 hover:shadow-md transition-all"
          >
            {/* Field photo with the official SDG tile on top */}
            <div className="relative h-56 overflow-hidden bg-slate-900">
              <img
                src={goal.photo}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500"
              />
              <img
                src={goal.icon}
                alt={`SDG ${goal.number}: ${goal.title}`}
                loading="lazy"
                className="absolute left-4 bottom-4 w-28 h-28 shadow-lg"
              />
            </div>

            <div className="p-5 space-y-2 flex-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                SDG {goal.target}
              </span>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {goal.contribution}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <a
          href="https://sdgs.un.org/goals"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-900 hover:text-[#C85A32] transition-colors"
        >
          <span>Learn about the 17 UN SDGs</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
};
