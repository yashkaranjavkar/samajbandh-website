import React, { useState } from 'react';
import { LOCATIONS_DATA, PROGRAMS_DATA } from '../../data/mockData';
import { ProgramLocation } from '../../types';
import { MapPin, Factory, Users, CheckCircle, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { CountUpNumber } from '../common/CountUpNumber';

interface InteractiveMapProps {
  onSelectProgram?: (programSlug: string) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectProgram
}) => {
  const [selectedLocation, setSelectedLocation] = useState<ProgramLocation>(LOCATIONS_DATA[0]);

  // Some map pins (e.g. Nandurbar, Satara, Solapur) have no detail record yet; ignore those clicks
  const selectLocation = (id: string) => {
    const loc = LOCATIONS_DATA.find(l => l.id === id);
    if (loc) setSelectedLocation(loc);
  };

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 lg:p-12 border border-slate-800 text-white shadow-2xl overflow-hidden relative">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
        
        {/* Left: Map Canvas & Location Selector */}
        <div className="w-full lg:w-7/12 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs uppercase font-bold text-amber-400 tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Where Do We Work?
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white mt-1">
                Maharashtra Grassroots Network
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Click any district hub to explore local Asha production units, rest shed reforms & active fellowships.
              </p>
            </div>
          </div>

          {/* Interactive Visual Map Representation */}
          <div className="relative bg-slate-950/80 rounded-[2rem] p-6 border border-slate-800 aspect-4/3 sm:aspect-16/10 flex flex-col justify-between overflow-hidden shadow-inner">
            
            {/* Map Grid Background Lines */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"></div>

            {/* Stylized Maharashtra Outline Accent */}
            <svg 
              className="absolute inset-0 w-full h-full opacity-20 text-emerald-400 pointer-events-none p-4" 
              viewBox="0 0 100 100" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="0.75"
            >
              <path d="M 20,25 Q 35,15 60,18 Q 85,20 90,35 Q 92,55 80,75 Q 65,85 45,80 Q 25,82 15,65 Q 12,45 20,25 Z" />
              <path d="M 30,35 Q 50,30 70,38 Q 75,60 55,70 Q 35,68 30,35 Z" strokeDasharray="2 2" />
            </svg>

            {/* Region Location Pins */}
            <div className="relative w-full h-full">
              
              {/* Nandurbar (Top Left) */}
              <button
                onClick={() => selectLocation('loc-nandurbar')}
                className={`absolute top-[12%] left-[22%] -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden z-20 ${
                  selectedLocation.id === 'loc-nandurbar' ? 'scale-115' : 'hover:scale-105'
                } transition-all`}
              >
                <div className={`p-2 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  selectedLocation.id === 'loc-nandurbar' ? 'bg-[#C85A32] ring-4 ring-[#C85A32]/40 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 block whitespace-nowrap shadow-md ${
                  selectedLocation.id === 'loc-nandurbar' ? 'bg-[#C85A32] text-white' : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                }`}>
                  Nandurbar
                </span>
              </button>

              {/* Nashik (Mid-North) */}
              <button
                onClick={() => selectLocation('loc-nashik')}
                className={`absolute top-[32%] left-[26%] -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden z-20 ${
                  selectedLocation.id === 'loc-nashik' ? 'scale-115' : 'hover:scale-105'
                } transition-all`}
              >
                <div className={`p-2 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  selectedLocation.id === 'loc-nashik' ? 'bg-[#C85A32] ring-4 ring-[#C85A32]/40 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 block whitespace-nowrap shadow-md ${
                  selectedLocation.id === 'loc-nashik' ? 'bg-[#C85A32] text-white' : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                }`}>
                  Nashik
                </span>
              </button>

              {/* Pune (Central West Hub) */}
              <button
                onClick={() => selectLocation('loc-pune')}
                className={`absolute top-[52%] left-[34%] -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden z-20 ${
                  selectedLocation.id === 'loc-pune' ? 'scale-120' : 'hover:scale-105'
                } transition-all`}
              >
                <div className={`p-2.5 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  selectedLocation.id === 'loc-pune' ? 'bg-[#C85A32] ring-4 ring-[#C85A32]/40 text-white' : 'bg-amber-400 text-slate-950 font-bold'
                }`}>
                  <Factory className="w-4 h-4" />
                </div>
                <span className={`text-[11px] sm:text-xs font-bold px-3 py-0.5 rounded-full mt-1 block whitespace-nowrap shadow-md ${
                  selectedLocation.id === 'loc-pune' ? 'bg-[#C85A32] text-white' : 'bg-amber-400 text-slate-950'
                }`}>
                  Pune (HQ & Hub)
                </span>
              </button>

              {/* Satara (South West) */}
              <button
                onClick={() => selectLocation('loc-satara')}
                className={`absolute top-[68%] left-[32%] -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden z-20 ${
                  selectedLocation.id === 'loc-satara' ? 'scale-115' : 'hover:scale-105'
                } transition-all`}
              >
                <div className={`p-2 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  selectedLocation.id === 'loc-satara' ? 'bg-[#C85A32] ring-4 ring-[#C85A32]/40 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 block whitespace-nowrap shadow-md ${
                  selectedLocation.id === 'loc-satara' ? 'bg-[#C85A32] text-white' : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                }`}>
                  Satara
                </span>
              </button>

              {/* Solapur (South Central) */}
              <button
                onClick={() => selectLocation('loc-solapur')}
                className={`absolute top-[66%] left-[54%] -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden z-20 ${
                  selectedLocation.id === 'loc-solapur' ? 'scale-115' : 'hover:scale-105'
                } transition-all`}
              >
                <div className={`p-2 rounded-full flex items-center justify-center shadow-lg transition-all ${
                  selectedLocation.id === 'loc-solapur' ? 'bg-[#C85A32] ring-4 ring-[#C85A32]/40 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 block whitespace-nowrap shadow-md ${
                  selectedLocation.id === 'loc-solapur' ? 'bg-[#C85A32] text-white' : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                }`}>
                  Solapur
                </span>
              </button>

              {/* Gadchiroli Tribal Region (East Forest Belt) */}
              <button
                onClick={() => selectLocation('loc-gadchiroli')}
                className={`absolute top-[44%] left-[82%] -translate-x-1/2 -translate-y-1/2 group focus:outline-hidden z-20 ${
                  selectedLocation.id === 'loc-gadchiroli' ? 'scale-120' : 'hover:scale-105'
                } transition-all`}
              >
                <div className={`p-2.5 rounded-full flex items-center justify-center shadow-xl transition-all ${
                  selectedLocation.id === 'loc-gadchiroli' ? 'bg-[#C85A32] ring-4 ring-[#C85A32]/40 text-white' : 'bg-emerald-600 text-white ring-2 ring-emerald-400/50'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>
                <span className={`text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full mt-1 block whitespace-nowrap shadow-md ${
                  selectedLocation.id === 'loc-gadchiroli' ? 'bg-[#C85A32] text-white' : 'bg-slate-900/90 text-slate-300 border border-slate-700'
                }`}>
                  Gadchiroli (Kurma Sudhar)
                </span>
              </button>

            </div>

            {/* Map Legend Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#C85A32]"></span>
                Active Intervention Hubs
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                Central Master Training Hub
              </span>
              <span className="font-semibold text-emerald-400">15 Production Units Across 120 Villages</span>
            </div>
          </div>

          {/* District Quick Select Pills */}
          <div className="flex flex-wrap gap-2">
            {LOCATIONS_DATA.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setSelectedLocation(loc)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all uppercase tracking-wider ${
                  selectedLocation.id === loc.id
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {loc.district}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Detailed Location & Program Card */}
        <div className="w-full lg:w-5/12 bg-white text-slate-900 rounded-[2rem] p-6 sm:p-7 shadow-xl border border-slate-200 space-y-4">
          
          {/* Location Image & Header */}
          <div className="relative h-40 rounded-[1.5rem] overflow-hidden">
            <img
              src={selectedLocation.image}
              alt={selectedLocation.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 bg-slate-950/80 px-2.5 py-0.5 rounded-full border border-slate-700">
                  Active Since {selectedLocation.activeSince}
                </span>
                <h4 className="text-lg font-black text-white mt-1">
                  {selectedLocation.name}
                </h4>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 text-center p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
            <div>
              <span className="text-lg font-black text-slate-900 block">
                <CountUpNumber key={`units-${selectedLocation.id}`} value={selectedLocation.productionCentresCount} duration={1200} />
              </span>
              <span className="text-[10px] text-slate-500 font-semibold leading-tight block">
                Pad Units
              </span>
            </div>
            <div>
              <span className="text-lg font-black text-slate-900 block">
                <CountUpNumber key={`villages-${selectedLocation.id}`} value={selectedLocation.villagesCovered} suffix="+" duration={1400} />
              </span>
              <span className="text-[10px] text-slate-500 font-semibold leading-tight block">
                Villages
              </span>
            </div>
            <div>
              <span className="text-lg font-black text-[#C85A32] block">
                <CountUpNumber key={`women-${selectedLocation.id}`} value={selectedLocation.womenReached} suffix="+" duration={1600} />
              </span>
              <span className="text-[10px] text-slate-500 font-semibold leading-tight block">
                Beneficiaries
              </span>
            </div>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            {selectedLocation.description}
          </p>

          {/* Field Activities Under this District */}
          <div>
            <h5 className="text-[11px] font-bold uppercase text-slate-900 tracking-wider mb-2 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#C85A32]" />
              Key Local Activities
            </h5>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {selectedLocation.activitiesList.map((act, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="font-medium">{act}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Active Programs in this Location */}
          <div className="pt-2 border-t border-slate-100">
            <h5 className="text-[11px] font-bold uppercase text-slate-900 tracking-wider mb-2">
              Intervention Programs Running Here
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {selectedLocation.activePrograms.map((progId) => {
                const prog = PROGRAMS_DATA.find(p => p.id === progId);
                if (!prog) return null;
                return (
                  <button
                    key={prog.id}
                    onClick={() => onSelectProgram && onSelectProgram(prog.slug)}
                    className="text-[11px] font-bold px-3 py-1 rounded-xl bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-800 transition-colors flex items-center gap-1"
                  >
                    <span>{prog.title}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
