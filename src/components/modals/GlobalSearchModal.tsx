import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Modal } from '../common/Modal';
import { Search, BookOpen, Layers, ShoppingBag, Newspaper, Calendar, ArrowRight } from 'lucide-react';
import { ApiService } from '../../services/api';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProgram?: (slug: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProgram
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>({
    programs: [],
    resources: [],
    products: [],
    news: [],
    events: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        const res = await ApiService.search(query);
        setResults(res);
        setLoading(false);
      } else {
        setResults({ programs: [], resources: [], products: [], news: [], events: [] });
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        // Trigger search open
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const totalResults = 
    results.programs.length + 
    results.resources.length + 
    results.products.length + 
    results.news.length + 
    results.events.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        setQuery('');
        onClose();
      }}
      maxWidth="3xl"
    >
      <div className="space-y-4">
        {/* Search Input Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-gray-400 absolute left-3.5 top-3.5" />
          <input
            id="global-search-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search programs, Asha pads, research, news, reports (e.g. 'fellowship', 'cloth pad', 'Gaokor')..."
            className="w-full pl-11 pr-4 py-3 bg-[#FBF9F5] border border-[#E5DFC5] rounded-xl text-base focus:outline-hidden focus:ring-2 focus:ring-[#143D2B]"
            autoFocus
          />
        </div>

        {/* Quick Suggestion Pills */}
        {!query && (
          <div className="pt-2">
            <span className="text-[11px] font-bold text-[#5C6760] uppercase tracking-wider block mb-2">
              Popular Searches
            </span>
            <div className="flex flex-wrap gap-1.5">
              {['Asha Cloth Pads', 'Arogya Samwadak', 'Kurma Sudhar', 'School Samata', 'IEC Posters', '80G Exemption', 'Volunteer'].map((pill) => (
                <button
                  key={pill}
                  onClick={() => setQuery(pill)}
                  className="px-3 py-1 rounded-full bg-[#F4EFE6] hover:bg-[#143D2B]/10 text-xs font-medium text-[#1F2421] transition-colors"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Search Loading */}
        {loading && (
          <div className="py-8 text-center text-xs text-[#5C6760]">
            Searching across programs, products and knowledge hub...
          </div>
        )}

        {/* Results Container */}
        {query.trim().length > 1 && !loading && (
          <div className="max-h-[60vh] overflow-y-auto space-y-6 pt-2 divide-y divide-gray-100">
            {totalResults === 0 && (
              <div className="py-12 text-center text-sm text-[#5C6760]">
                No matching results found for "{query}". Try searching for programs, products, or resources.
              </div>
            )}

            {/* Programs Section */}
            {results.programs.length > 0 && (
              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-[#143D2B] uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-[#C85A32]" />
                  Programs ({results.programs.length})
                </span>
                <div className="space-y-1.5">
                  {results.programs.map((p: any) => (
                    <Link
                      key={p.id}
                      to={`/our-work?program=${p.slug}`}
                      onClick={() => {
                        onClose();
                        if (onSelectProgram) onSelectProgram(p.slug);
                      }}
                      className="block p-2.5 rounded-xl hover:bg-[#FBF9F5] border border-transparent hover:border-[#E5DFC5] transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1F2421] group-hover:text-[#143D2B]">
                          {p.title}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#143D2B]" />
                      </div>
                      <p className="text-xs text-[#5C6760] mt-0.5 line-clamp-1">
                        {p.shortDescription}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products Section */}
            {results.products.length > 0 && (
              <div className="space-y-2 pt-3">
                <span className="text-xs font-bold text-[#143D2B] uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#C85A32]" />
                  Products & Kits ({results.products.length})
                </span>
                <div className="space-y-1.5">
                  {results.products.map((pr: any) => (
                    <Link
                      key={pr.id}
                      to="/products-services"
                      onClick={onClose}
                      className="block p-2.5 rounded-xl hover:bg-[#FBF9F5] border border-transparent hover:border-[#E5DFC5] transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1F2421] group-hover:text-[#143D2B]">
                          {pr.title}
                        </span>
                        <span className="text-xs font-semibold text-[#C85A32]">₹{pr.price}</span>
                      </div>
                      <p className="text-xs text-[#5C6760] mt-0.5 line-clamp-1">
                        {pr.subtitle}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Resources & Publications */}
            {results.resources.length > 0 && (
              <div className="space-y-2 pt-3">
                <span className="text-xs font-bold text-[#143D2B] uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#C85A32]" />
                  Resources & Research ({results.resources.length})
                </span>
                <div className="space-y-1.5">
                  {results.resources.map((r: any) => (
                    <Link
                      key={r.id}
                      to="/resources"
                      onClick={onClose}
                      className="block p-2.5 rounded-xl hover:bg-[#FBF9F5] border border-transparent hover:border-[#E5DFC5] transition-all group"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-[#1F2421] group-hover:text-[#143D2B]">
                          {r.title}
                        </span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-100 text-[#143D2B] font-medium uppercase">
                          {r.category}
                        </span>
                      </div>
                      <p className="text-xs text-[#5C6760] mt-0.5 line-clamp-1">
                        {r.summary}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* News & Events */}
            {(results.news.length > 0 || results.events.length > 0) && (
              <div className="space-y-2 pt-3">
                <span className="text-xs font-bold text-[#143D2B] uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#C85A32]" />
                  News & Events ({results.news.length + results.events.length})
                </span>
                <div className="space-y-1.5">
                  {results.events.map((e: any) => (
                    <Link
                      key={e.id}
                      to="/news-events"
                      onClick={onClose}
                      className="block p-2.5 rounded-xl hover:bg-[#FBF9F5] border border-transparent hover:border-[#E5DFC5] transition-all group"
                    >
                      <span className="text-sm font-bold text-[#1F2421] group-hover:text-[#143D2B]">
                        [Event] {e.title}
                      </span>
                      <p className="text-xs text-[#5C6760] mt-0.5">
                        {e.date} • {e.location}
                      </p>
                    </Link>
                  ))}
                  {results.news.map((n: any) => (
                    <Link
                      key={n.id}
                      to="/news-events"
                      onClick={onClose}
                      className="block p-2.5 rounded-xl hover:bg-[#FBF9F5] border border-transparent hover:border-[#E5DFC5] transition-all group"
                    >
                      <span className="text-sm font-bold text-[#1F2421] group-hover:text-[#143D2B]">
                        [News] {n.title}
                      </span>
                      <p className="text-xs text-[#5C6760] mt-0.5">
                        {n.date} • {n.source}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
};
