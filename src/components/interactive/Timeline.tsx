import React, { useState } from 'react';
import { TIMELINE_MILESTONES } from '../../data/mockData';
import { Calendar, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

export const Timeline: React.FC = () => {
  const [selectedMilestone, setSelectedMilestone] = useState(0);

  return (
    <div className="space-y-8">
      
      {/* Year Step Tabs */}
      <div className="flex items-center justify-between border-b border-[#E5DFC5] pb-4 overflow-x-auto scrollbar-none gap-2">
        {TIMELINE_MILESTONES.map((item, index) => (
          <button
            key={item.year}
            onClick={() => setSelectedMilestone(index)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shrink-0 flex items-center gap-2 ${
              selectedMilestone === index
                ? 'bg-[#143D2B] text-white shadow-md'
                : 'bg-[#FBF9F5] text-[#5C6760] hover:text-[#1F2421] border border-[#E5DFC5]'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{item.year}</span>
          </button>
        ))}
      </div>

      {/* Selected Milestone Feature Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5DFC5] shadow-lg grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        <div className="lg:col-span-6 space-y-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C85A32]/10 text-[#C85A32] text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Year {TIMELINE_MILESTONES[selectedMilestone].year} Milestone</span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-serif-heading font-bold text-[#143D2B] leading-tight">
            {TIMELINE_MILESTONES[selectedMilestone].title}
          </h3>

          <p className="text-sm sm:text-base text-[#5C6760] leading-relaxed">
            {TIMELINE_MILESTONES[selectedMilestone].description}
          </p>

          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs sm:text-sm text-[#143D2B] flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Demonstrated Outcome:</span>
              <span>{TIMELINE_MILESTONES[selectedMilestone].impact}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-md border border-[#E5DFC5]">
            <img
              src={TIMELINE_MILESTONES[selectedMilestone].photo}
              alt={TIMELINE_MILESTONES[selectedMilestone].title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
              <span className="text-white text-xs font-medium">
                Archival Field Photography • Samajbandh Archives ({TIMELINE_MILESTONES[selectedMilestone].year})
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Alternating Timeline Strip for Mobile & Desktop Overview */}
      <div className="relative border-l-2 border-[#143D2B]/30 ml-4 md:ml-32 space-y-8 pl-6 md:pl-8 py-4">
        {TIMELINE_MILESTONES.map((milestone, idx) => (
          <div 
            key={milestone.year}
            onClick={() => setSelectedMilestone(idx)}
            className="cursor-pointer group relative"
          >
            {/* Dot marker */}
            <div className={`absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full border-2 transition-all ${
              selectedMilestone === idx 
                ? 'bg-[#C85A32] border-white ring-4 ring-[#C85A32]/30 scale-125' 
                : 'bg-white border-[#143D2B] group-hover:bg-[#143D2B]'
            }`} />

            <div className="hidden md:block absolute -left-32 top-1 w-24 text-right">
              <span className="text-sm font-bold text-[#143D2B]">{milestone.year}</span>
            </div>

            <div className="bg-[#FBF9F5] p-4 rounded-xl border border-[#E5DFC5] group-hover:border-[#143D2B]/40 transition-colors">
              <div className="md:hidden text-xs font-bold text-[#C85A32] mb-1">{milestone.year}</div>
              <h4 className="text-sm font-bold text-[#1F2421] group-hover:text-[#143D2B] flex items-center justify-between">
                <span>{milestone.title}</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-xs text-[#5C6760] mt-1 line-clamp-2">
                {milestone.description}
              </p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
