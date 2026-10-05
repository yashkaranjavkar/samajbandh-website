import React from 'react';
import { Users, MapPin, Factory, HeartHandshake, Leaf, GraduationCap } from 'lucide-react';
import { ImpactStatistic } from '../../types';
import { CountUpNumber } from '../common/CountUpNumber';

interface ImpactCounterProps {
  stats: ImpactStatistic[];
}

export const ImpactCounter: React.FC<ImpactCounterProps> = ({ stats }) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Users': return <Users className="w-5 h-5 text-[#C85A32]" />;
      case 'MapPin': return <MapPin className="w-5 h-5 text-emerald-700" />;
      case 'Factory': return <Factory className="w-5 h-5 text-amber-600" />;
      case 'HeartHandshake': return <HeartHandshake className="w-5 h-5 text-[#C85A32]" />;
      case 'Leaf': return <Leaf className="w-5 h-5 text-emerald-600" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-indigo-600" />;
      default: return <Users className="w-5 h-5 text-slate-800" />;
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
      {stats.map((stat) => {
        return (
          <div
            key={stat.id}
            className="bg-white rounded-[1.75rem] p-5 border border-slate-200 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                {getIcon(stat.iconName)}
              </div>
              <span className="text-[9px] uppercase font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                Verified
              </span>
            </div>

            <div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                <CountUpNumber 
                  value={stat.value} 
                  suffix={stat.suffix || '+'} 
                  duration={2200} 
                />
              </div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 mt-1 leading-snug">
                {stat.label}
              </h4>
              <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium">
                {stat.description}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

