import React, { useState } from 'react';
import { LOCATIONS_DATA, PROGRAMS_DATA } from '../../data/mockData';
import { ProgramLocation } from '../../types';
import { MapPin, Factory, Users, CheckCircle, ArrowRight, Layers, Sparkles } from 'lucide-react';
import { CountUpNumber } from '../common/CountUpNumber';
import { MAHARASHTRA_DISTRICTS, MAHARASHTRA_VIEWBOX, projectToMap } from '../../data/maharashtraMap';

// Pins on the map. `district` must match a name in MAHARASHTRA_DISTRICTS (Census 2011 spelling).
// Pins whose id has no record in LOCATIONS_DATA are shown but not clickable for details yet.
const MAP_PINS: {
  id: string;
  label: string;
  district: string;
  lat: number;
  lng: number;
  variant: 'default' | 'hub' | 'tribal';
}[] = [
  // { id: 'loc-nandurbar', label: 'Nandurbar', district: 'Nandurbar', lat: 21.3700, lng: 74.2400, variant: 'default' },
  { id: 'loc-nashik', label: 'Nashik', district: 'Nashik', lat: 19.9975, lng: 73.7898, variant: 'default' },
  { id: 'loc-pune', label: 'Pune (HQ & Hub)', district: 'Pune', lat: 18.5204, lng: 73.8567, variant: 'hub' },
  // { id: 'loc-satara', label: 'Satara', district: 'Satara', lat: 17.6805, lng: 74.0183, variant: 'default' },
  // { id: 'loc-solapur', label: 'Solapur', district: 'Solapur', lat: 17.6599, lng: 75.9064, variant: 'default' },
  { id: 'loc-gadchiroli', label: 'Gadchiroli (Kurma Sudhar)', district: 'Garhchiroli', lat: 20.1849, lng: 80.0030, variant: 'tribal' }
];

const PIN_DISTRICTS = new Set(MAP_PINS.map(p => p.district));

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

  // const mapLegend = (
  //   <div className="flex flex-wrap sm:flex-col sm:items-end gap-x-4 gap-y-1 text-[10px] sm:text-[11px] text-slate-400">
  //     <span className="flex items-center gap-1.5 font-medium">
  //       <span className="w-2 h-2 rounded-full bg-[#C85A32]"></span>
  //       Active Intervention Hubs
  //     </span>
  //     <span className="flex items-center gap-1.5 font-medium">
  //       <span className="w-2 h-2 rounded-full bg-amber-400"></span>
  //       Central Master Training Hub
  //     </span>
  //     <span className="font-semibold text-emerald-400">15 Production Units Across 120 Villages</span>
  //   </div>
  // );
  const mapLegend = (
    <div className="flex flex-col items-start gap-y-1 text-[10px] sm:text-[11px] text-slate-400">
      <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-[#C85A32] shrink-0"></span>
        Active Intervention Hubs
      </span>

      <span className="flex items-center gap-1.5 font-medium whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-amber-400 shrink-0"></span>
        Central Master Training Hub
      </span>

      <span className="font-semibold text-emerald-400 whitespace-nowrap">
        15 Production Units Across 120 Villages
      </span>
    </div>
  );

  // District Quick Select Pills
  // const districtButtons = (
  //   <div className="flex flex-wrap sm:justify-end gap-2">
  //     {LOCATIONS_DATA.map((loc) => (
  //       <button
  //         key={loc.id}
  //         onClick={() => setSelectedLocation(loc)}
  //         className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all uppercase tracking-wider ${
  //           selectedLocation.id === loc.id
  //             ? 'bg-white text-slate-950 shadow-md'
  //             : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
  //         }`}
  //       >
  //         {loc.district}
  //       </button>
  //     ))}
  //   </div>
  // );
  const districtButtons = (
    <div className="flex flex-wrap justify-center gap-2">
      {LOCATIONS_DATA.map((loc) => (
        <button
          key={loc.id}
          onClick={() => setSelectedLocation(loc)}
          className={`px-4 py-2 rounded-xl text-[11px] font-bold
            transition-all uppercase tracking-wider ${
                selectedLocation.id === loc.id
                  ? 'bg-white text-slate-950 shadow-md'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
        >
          {loc.district}
        </button>
      ))}
    </div>
  );

  return (
    <div className="bg-slate-900 rounded-[2.5rem] p-6 sm:p-8 lg:p-10 border border-slate-800 text-white shadow-2xl overflow-hidden relative">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="flex flex-col lg:flex-row gap-8 items-start relative z-10">
        
        {/* Left: Map Canvas & Location Selector */}
        <div className="w-full lg:w-7/12 space-y-4">
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

          {/* Map of Maharashtra with district boundaries and program pins */}
          <div className="relative bg-slate-950/80 rounded-[2rem] p-4 sm:p-6 border border-slate-800 overflow-hidden shadow-inner">
            
            {/* Map Grid Background Dots */}
            <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

            <div
              className="relative w-full mx-auto"
              style={{
                aspectRatio: `${MAHARASHTRA_VIEWBOX.width} / ${MAHARASHTRA_VIEWBOX.height}`,
                // Cap the map's height to the screen so the legend and district buttons below stay visible
                maxWidth: `max(320px, calc((100vh - 340px) * ${MAHARASHTRA_VIEWBOX.width / MAHARASHTRA_VIEWBOX.height}))`
              }}
            >
              <svg
                className="absolute inset-0 w-full h-full"
                viewBox={`0 0 ${MAHARASHTRA_VIEWBOX.width} ${MAHARASHTRA_VIEWBOX.height}`}
                role="img"
                aria-label="Map of Maharashtra showing districts where Samajbandh works"
              >
                {/* State outline: a thick stroke under the district fills leaves a glow only on the outer border */}
                <g fill="none" stroke="#34d399" strokeOpacity="0.35" strokeWidth="6" strokeLinejoin="round">
                  {MAHARASHTRA_DISTRICTS.map((d) => <path key={d.name} d={d.path} />)}
                </g>

                {MAHARASHTRA_DISTRICTS.map((d) => {
                  const pin = MAP_PINS.find(p => p.district === d.name);
                  const isSelected = pin?.id === selectedLocation.id;
                  return (
                    <path
                      key={d.name}
                      d={d.path}
                      onClick={pin ? () => selectLocation(pin.id) : undefined}
                      className={`transition-colors duration-300 ${pin ? 'cursor-pointer' : ''}`}
                      fill={isSelected ? '#C85A32' : PIN_DISTRICTS.has(d.name) ? '#14532d' : '#1e293b'}
                      fillOpacity={isSelected ? 0.55 : 0.9}
                      stroke="#475569"
                      strokeWidth="1"
                      strokeLinejoin="round"
                    >
                      <title>{d.name === 'Garhchiroli' ? 'Gadchiroli' : d.name}</title>
                    </path>
                  );
                })}
              </svg>

              {/* Region Location Pins (positioned from real latitude/longitude) */}
              {MAP_PINS.map((pin) => {
                const { x, y } = projectToMap(pin.lat, pin.lng);
                const left = (x / MAHARASHTRA_VIEWBOX.width) * 100;
                const top = (y / MAHARASHTRA_VIEWBOX.height) * 100;
                const isSelected = selectedLocation.id === pin.id;
                const labelOnLeft = left > 70;
                const Icon = pin.variant === 'hub' ? Factory : MapPin;

                const markerClass = isSelected
                  ? 'bg-[#C85A32] ring-4 ring-[#C85A32]/40 text-white'
                  : pin.variant === 'hub'
                    ? 'bg-amber-400 text-slate-950'
                    : pin.variant === 'tribal'
                      ? 'bg-emerald-600 text-white ring-2 ring-emerald-400/50'
                      : 'bg-slate-700 text-slate-200 hover:bg-slate-600';
                const labelClass = isSelected
                  ? 'bg-[#C85A32] text-white'
                  : pin.variant === 'hub'
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-slate-900/90 text-slate-200 border border-slate-700';

                return (
                  <button
                    key={pin.id}
                    onClick={() => selectLocation(pin.id)}
                    style={{ left: `${left}%`, top: `${top}%` }}
                    className={`absolute -translate-y-1/2 ${labelOnLeft ? '-translate-x-[calc(100%-0.875rem)] flex-row-reverse' : '-translate-x-3.5'} flex items-center gap-1.5 focus:outline-hidden transition-transform ${
                      isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                    }`}
                    aria-label={`Show details for ${pin.label}`}
                    aria-pressed={isSelected}
                  >
                    <span className={`w-7 h-7 rounded-full flex items-center justify-center shadow-lg shrink-0 transition-colors ${markerClass}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </span>
                    <span className={`text-[9px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shadow-md transition-colors ${labelClass}`}>
                      {pin.label}
                    </span>
                  </button>
                );
              })}

              {/* Legend & district buttons sit in the map's empty south-east corner on larger screens */}
              <div className="hidden sm:flex absolute right-0 bottom-0 max-w-[46%] flex-col items-end gap-3 z-10">
                {/* {districtButtons} */}
                {mapLegend}
              </div>
            </div>
          </div>

          {/* Below the map on phones, where the corner is too small */}
          <div className="sm:hidden space-y-3">
            {mapLegend}
            {/* {districtButtons} */}
          </div>
          {/* District selector and legend below the map on all screen sizes */}
            <div className="mt-5 w-full space-y-4">
              {/* District names */}
              <div className="flex justify-center">
                {districtButtons}
              </div>

              {/* Map legend and supporting information */}
              {/* <div className="flex justify-center">
                <div className="max-w-full">
                  {mapLegend}
                </div>
              </div> */}
            </div>
        </div>

        {/* Right: Detailed Location & Program Card */}
        <div className="w-full lg:w-5/12 bg-white text-slate-900 rounded-[2rem] p-6 sm:p-7 shadow-xl border border-slate-200 space-y-4 lg:space-y-3">
          
          {/* Location Image & Header */}
          <div className="relative h-40 lg:h-32 rounded-[1.5rem] overflow-hidden">
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