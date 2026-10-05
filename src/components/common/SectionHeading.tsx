import React from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  light?: boolean;
  className?: string;
  action?: React.ReactNode;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  subtitle,
  centered = false,
  light = false,
  className = '',
  action
}) => {
  return (
    <div className={`mb-8 sm:mb-10 ${centered ? 'text-center max-w-3xl mx-auto' : 'flex flex-col md:flex-row md:items-end justify-between gap-4'} ${className}`}>
      <div className={centered ? '' : 'max-w-2xl'}>
        {eyebrow && (
          <div className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-3 ${
            light ? 'bg-white/10 text-emerald-400 border border-white/20' : 'bg-slate-900 text-white border border-slate-800'
          }`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32]"></span>
            {eyebrow}
          </div>
        )}
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-black leading-tight tracking-tight ${
          light ? 'text-white' : 'text-slate-900'
        }`}>
          {title}
        </h2>
        {subtitle && (
          <p className={`mt-2.5 text-sm sm:text-base leading-relaxed ${
            light ? 'text-slate-300' : 'text-slate-600'
          }`}>
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <div className="shrink-0">
          {action}
        </div>
      )}
    </div>
  );
};
