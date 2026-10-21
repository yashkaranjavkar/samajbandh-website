import React, { useState } from 'react';
import { Languages, CheckCircle2 } from 'lucide-react';
import { chooseLanguage, getSavedLanguage, SiteLanguage } from '../../services/language';

const OPTIONS: { value: SiteLanguage; label: string; sub: string }[] = [
  { value: 'mr', label: 'मराठी', sub: 'Marathi' },
  { value: 'en', label: 'English', sub: 'इंग्रजी' }
];

// Shown on first visit until the visitor picks a language
export const LanguagePopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(() => getSavedLanguage() === null);
  const [selected, setSelected] = useState<SiteLanguage>('mr');

  if (!isOpen) return null;

  const handleContinue = () => {
    chooseLanguage(selected);
    setIsOpen(false);
  };

  return (
    // `notranslate` keeps Google Translate from rewriting the language names
    <div
      className="notranslate fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="language-popup-title"
    >
      <div className="w-full max-w-sm bg-white rounded-[2rem] shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center">
            <Languages className="w-6 h-6 text-emerald-700" />
          </div>
          <h2 id="language-popup-title" className="text-xl font-black text-slate-900">
            भाषा निवडा / Choose Language
          </h2>
        </div>

        <div className="space-y-2.5" role="radiogroup">
          {OPTIONS.map((opt) => {
            const isSelected = selected === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(opt.value)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#C85A32] bg-[#C85A32]/5'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="text-base font-black text-slate-900">{opt.label}</div>
                  <div className="text-xs font-semibold text-slate-500">{opt.sub}</div>
                </div>
                {isSelected
                  ? <CheckCircle2 className="w-5 h-5 text-[#C85A32]" />
                  : <span className="w-5 h-5 rounded-full border-2 border-slate-300" />}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={handleContinue}
          autoFocus
          className="w-full py-3.5 rounded-2xl bg-[#C85A32] hover:bg-[#b54c26] text-white font-bold text-xs uppercase tracking-wider shadow-lg transition-all"
        >
          {selected === 'mr' ? 'पुढे चला' : 'Continue'}
        </button>
      </div>
    </div>
  );
};
