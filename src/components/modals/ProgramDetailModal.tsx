import React from 'react';
import { Program } from '../../types';
import { Modal } from '../common/Modal';
import { MapPin, Users, Target, Activity, FileText, CheckCircle2, Heart } from 'lucide-react';

interface ProgramDetailModalProps {
  program: Program | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenDonate?: () => void;
}

export const ProgramDetailModal: React.FC<ProgramDetailModalProps> = ({
  program,
  isOpen,
  onClose,
  onOpenDonate
}) => {
  if (!program) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={program.title}
      subtitle={program.tagline}
      maxWidth="4xl"
    >
      <div className="space-y-6 text-left">
        
        {/* Banner Image */}
        <div className="relative h-64 sm:h-72 rounded-xl overflow-hidden shadow-md">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent flex items-end p-5">
            <div className="flex flex-wrap gap-2 text-white text-xs">
              <span className="bg-[#143D2B] px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                {program.category.replace('-', ' ')}
              </span>
              <span className="bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full flex items-center gap-1 font-medium">
                <MapPin className="w-3.5 h-3.5" />
                {program.locations.join(', ')}
              </span>
            </div>
          </div>
        </div>

        {/* Impact Metrics Banner */}
        <div className="grid grid-cols-3 gap-3 p-4 bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl text-center">
          {program.impactMetrics.map((metric, i) => (
            <div key={i}>
              <span className="text-xl sm:text-2xl font-bold font-serif-heading text-[#143D2B] block">
                {metric.value}
              </span>
              <span className="text-xs text-[#5C6760] font-medium">
                {metric.label}
              </span>
            </div>
          ))}
        </div>

        {/* The Problem Addressed */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4.5">
          <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Target className="w-4 h-4 text-amber-700" />
            The Core Challenge
          </h4>
          <p className="text-xs sm:text-sm text-amber-950/90 leading-relaxed">
            {program.problemAddressed}
          </p>
        </div>

        {/* Program Narrative */}
        <div>
          <h4 className="text-sm font-bold font-serif-heading text-[#1F2421] mb-2 uppercase tracking-wide">
            Program Description & Methodology
          </h4>
          <p className="text-sm text-[#5C6760] leading-relaxed">
            {program.fullDescription}
          </p>
        </div>

        {/* Strategic Objectives */}
        <div>
          <h4 className="text-xs font-bold text-[#1F2421] uppercase tracking-wider mb-2.5">
            Key Strategic Objectives
          </h4>
          <div className="space-y-2">
            {program.objectives.map((obj, index) => (
              <div key={index} className="flex items-start gap-2 text-xs sm:text-sm text-[#1F2421]">
                <CheckCircle2 className="w-4 h-4 text-[#143D2B] shrink-0 mt-0.5" />
                <span>{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Key Activities */}
        {program.activities && program.activities.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-[#1F2421] uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-[#C85A32]" />
              Core Field Activities
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {program.activities.map((act, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#FBF9F5] border border-[#E5DFC5]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-[#143D2B]">{act.title}</span>
                    {act.frequency && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-[#143D2B]">
                        {act.frequency}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5C6760]">{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Beneficiaries & Geographic Scope */}
        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs text-[#143D2B]">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <Users className="w-4 h-4" />
            <span>Target Beneficiaries</span>
          </div>
          <p className="text-xs text-[#143D2B]/90">{program.beneficiaries}</p>
        </div>

        {/* Program Reports if available */}
        {program.reports && program.reports.length > 0 && (
          <div className="pt-2">
            <h4 className="text-xs font-bold text-[#1F2421] uppercase tracking-wider mb-2">
              Verified Program Reports
            </h4>
            <div className="space-y-2">
              {program.reports.map((rep, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-[#E5DFC5] bg-white text-xs">
                  <span className="font-semibold text-[#1F2421] flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C85A32]" />
                    {rep.title} ({rep.size})
                  </span>
                  <button 
                    onClick={() => alert(`Downloading ${rep.title}...`)}
                    className="text-xs font-bold text-[#143D2B] hover:underline"
                  >
                    Download PDF
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action CTAs */}
        <div className="pt-4 border-t border-[#E5DFC5] flex flex-col sm:flex-row gap-3">
          {onOpenDonate && (
            <button
              onClick={() => {
                onClose();
                onOpenDonate();
              }}
              className="flex-1 py-3 px-4 rounded-xl bg-[#C85A32] text-white font-bold text-xs sm:text-sm hover:bg-[#B84A28] transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Heart className="w-4 h-4 fill-white" />
              Sponsor / Support This Program
            </button>
          )}
          <button
            onClick={onClose}
            className="py-3 px-6 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs sm:text-sm hover:bg-gray-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
};
