import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { ApiService } from '../../services/api';
import type { FAQItem } from '../../types';

export const FAQ_CATEGORY_LABELS: Record<FAQItem['category'], string> = {
  general: 'General',
  'menstrual-health': 'Menstrual Health',
  'cloth-pads': 'Cloth Pads',
  donation: 'Donations',
  volunteering: 'Volunteering',
};

/** Category + free-text filter used by the accordion (exported so it can be reused/tested). */
export function filterFaqs(faqs: FAQItem[], category: 'all' | FAQItem['category'], query: string): FAQItem[] {
  const q = query.trim().toLowerCase();
  return faqs.filter(
    f =>
      (category === 'all' || f.category === category) &&
      (!q || f.question.toLowerCase().includes(q) || f.answer.toLowerCase().includes(q))
  );
}

interface FaqAccordionProps {
  /** Show only one category (e.g. "volunteering" on the Get Involved page). Hides the category tabs. */
  category?: FAQItem['category'];
  showTabs?: boolean;
  showSearch?: boolean;
  /** Adds FAQPage structured data so search engines can show the questions. */
  withSchema?: boolean;
  className?: string;
}

export const FaqAccordion: React.FC<FaqAccordionProps> = ({
  category,
  showTabs = true,
  showSearch = true,
  withSchema = false,
  className = '',
}) => {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<'all' | FAQItem['category']>('all');
  const [query, setQuery] = useState('');
  const [openIds, setOpenIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    let cancelled = false;
    ApiService.getFaqs()
      .then(list => { if (!cancelled) setFaqs(list); })
      .catch(() => undefined)
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const base = useMemo(() => (category ? faqs.filter(f => f.category === category) : faqs), [faqs, category]);
  const visible = useMemo(() => filterFaqs(base, activeCategory, query), [base, activeCategory, query]);

  const tabs = useMemo(() => {
    const present = (Object.keys(FAQ_CATEGORY_LABELS) as FAQItem['category'][]).filter(c => base.some(f => f.category === c));
    return [
      { key: 'all' as const, label: 'All', count: base.length },
      ...present.map(c => ({ key: c, label: FAQ_CATEGORY_LABELS[c], count: base.filter(f => f.category === c).length })),
    ];
  }, [base]);

  const toggle = (id: string) =>
    setOpenIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });

  const schema = withSchema && base.length > 0 ? JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: base.map(f => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }).replace(/</g, '\\u003c') : null;

  return (
    <div className={`space-y-6 ${className}`}>
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />}

      {showSearch && base.length > 0 && (
        <div className="relative">
          <Search className="w-4 h-4 text-[#879086] absolute left-4 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search questions…"
            aria-label="Search frequently asked questions"
            className="w-full pl-11 pr-4 py-3 text-sm bg-white border border-[#E5DFC5] rounded-2xl focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
          />
        </div>
      )}

      {showTabs && !category && tabs.length > 2 && (
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="FAQ categories">
          {tabs.map(tab => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeCategory === tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={`px-4 py-2 rounded-full text-xs font-bold border transition-colors ${
                activeCategory === tab.key
                  ? 'bg-[#143D2B] text-white border-[#143D2B]'
                  : 'bg-white text-[#143D2B] border-[#E5DFC5] hover:bg-[#FBF9F5]'
              }`}
            >
              {tab.label} <span className="opacity-70">({tab.count})</span>
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-[#5C6760] py-8 text-center">Loading questions…</p>
      ) : visible.length === 0 ? (
        <div className="bg-white border border-[#E5DFC5] rounded-2xl p-8 text-center text-sm text-[#5C6760]">
          {query ? `No questions match “${query.trim()}”.` : 'No questions available yet.'}
        </div>
      ) : (
        <div className="space-y-3">
          {visible.map(faq => {
            const open = openIds.has(faq.id);
            return (
              <div key={faq.id} className="bg-white border border-[#E5DFC5] rounded-2xl overflow-hidden shadow-xs">
                <h3>
                  <button
                    type="button"
                    onClick={() => toggle(faq.id)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${faq.id}`}
                    id={`faq-button-${faq.id}`}
                    className="w-full flex items-start justify-between gap-4 text-left px-5 py-4 hover:bg-[#FBF9F5] transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-[#1F2421] leading-snug">{faq.question}</span>
                    <ChevronDown className={`w-5 h-5 shrink-0 text-[#143D2B] transition-transform ${open ? 'rotate-180' : ''}`} aria-hidden="true" />
                  </button>
                </h3>
                {open && (
                  <div id={`faq-panel-${faq.id}`} role="region" aria-labelledby={`faq-button-${faq.id}`} className="px-5 pb-5 -mt-1">
                    <span className="inline-block mb-2 text-[10px] font-bold uppercase tracking-wider text-[#C85A32]">
                      {FAQ_CATEGORY_LABELS[faq.category]}
                    </span>
                    <p className="text-sm text-[#5C6760] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
