import React, { useRef, useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, Sparkles } from 'lucide-react';

interface StoryStripItem {
  id: string;
  image: string;
  tag: string;
  caption: string;
  location: string;
}

const STORIES_DATA: StoryStripItem[] = [
  {
    id: 'strip-1',
    image: '/images/stories/women-handstitching-pads.jpg',
    tag: 'Production Artisan',
    caption: 'Women artisans at Junnar Centre precision-stitching leak-proof 5-layer Asha cloth pads.',
    location: 'Junnar, Pune'
  },
  {
    id: 'strip-2',
    image: '/images/kurma/arogya-sakhi-outreach.jpg',
    tag: 'Youth Fellowship',
    caption: 'Arogya Samwadak Fellow facilitating an open menstrual myth-busting circle with mothers.',
    location: 'Kurkheda, Gadchiroli'
  },
  {
    id: 'strip-3',
    image: '/images/samata-yatra/gender-equality-school.jpg',
    tag: 'School Samata',
    caption: 'Classroom gender equity dialogue breaking period shaming among adolescent boys and girls.',
    location: 'Velhe ZP High School'
  },
  {
    id: 'strip-4',
    image: '/images/kurma/kurma-hut-entrance.jpg',
    tag: 'Kurma Sudhar',
    caption: 'Restructured community rest home equipped with running water, solar power, and bio-toilets.',
    location: 'Bhamragad Tribal Belt'
  },
  {
    id: 'strip-5',
    image: '/images/awareness/asha-worker-training.jpg',
    tag: 'Capacity Building',
    caption: 'Master Training of Trainers (ToT) certifying frontline ASHA coordinators in MHM pedagogy.',
    location: 'State Training Hub'
  },
  {
    id: 'strip-6',
    image: '/images/products/asha-menstrual-kit.jpg',
    tag: 'Sustainable Hygiene',
    caption: 'Teaching safe cold-water washing and natural ultraviolet sunlight drying protocols.',
    location: 'Satara Rural Cluster'
  }
];

export const StoriesStrip: React.FC = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
        }
      }
    }, 3800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const offset = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-8 bg-slate-100/70 border-y border-slate-200 overflow-hidden rounded-[2.5rem]" aria-label="Pictorial Stories Strip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C85A32]"></span>
            <span className="text-xs font-bold text-slate-900 uppercase tracking-widest">
              Documentary Moments from the Ground
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-1.5 px-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 text-xs flex items-center gap-1.5 shadow-xs font-bold"
              title={isPlaying ? 'Pause Auto-Scroll' : 'Play Auto-Scroll'}
              aria-label={isPlaying ? 'Pause auto-scroll' : 'Play auto-scroll'}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">{isPlaying ? 'Pause' : 'Play'}</span>
            </button>
            <button
              onClick={() => handleScroll('left')}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-xs transition-colors"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:text-slate-900 shadow-xs transition-colors"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Carousel */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto pb-4 scrollbar-none snap-x snap-mandatory focus:outline-hidden"
          tabIndex={0}
          role="region"
          aria-label="Stories strip carousel"
        >
          {STORIES_DATA.map((story) => (
            <div
              key={story.id}
              className="w-72 sm:w-80 shrink-0 bg-white rounded-[1.75rem] overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition-all snap-start flex flex-col p-2 group"
            >
              <div className="relative h-44 rounded-[1.25rem] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute top-2.5 left-2.5 bg-slate-900/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-xs border border-slate-700 uppercase tracking-wider">
                  {story.tag}
                </div>
                <div className="absolute bottom-2 right-2 bg-slate-900/80 text-emerald-400 text-[10px] font-bold px-2.5 py-0.5 rounded-lg backdrop-blur-xs border border-white/10">
                  {story.location}
                </div>
              </div>

              <div className="p-3.5 flex-1 flex items-center">
                <p className="text-xs text-slate-700 font-semibold leading-relaxed">
                  "{story.caption}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
