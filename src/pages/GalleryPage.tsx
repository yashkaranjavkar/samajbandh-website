import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { BottomCTABand } from '../components/layout/BottomCTABand';
import { LightboxModal } from '../components/modals/LightboxModal';
import { GALLERY_DATA } from '../data/mockData';
import { GalleryItem } from '../types';
import { 
  Camera, 
  Play, 
  MapPin, 
  Calendar, 
  Layers, 
  Sparkles,
  Filter
} from 'lucide-react';
import { PageSections } from '../components/layout/PageSections';

interface GalleryPageProps {
  onOpenDonate: () => void;
}

export const GalleryPage: React.FC<GalleryPageProps> = ({ onOpenDonate }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxMedia, setLightboxMedia] = useState<any>(null);

  const categories = [
    { id: 'all', label: 'All Photos & Media' },
    { id: 'production', label: 'Artisans & Production' },
    { id: 'workshop', label: 'School & Youth Circles' },
    { id: 'tribal', label: 'Gaokor Rest Shed Reforms' },
    { id: 'fellowship', label: 'Fellowship Induction' },
    { id: 'events', label: 'Campaigns & Events' },
    { id: 'video', label: 'Documentaries & Video' }
  ];

  const filteredMedia = activeCategory === 'all'
    ? GALLERY_DATA
    : GALLERY_DATA.filter(g => g.category === activeCategory);

  const handleOpenItem = (item: GalleryItem) => {
    setLightboxMedia({
      type: item.type,
      url: item.type === 'video' && item.videoUrl ? item.videoUrl : item.url,
      title: item.title,
      caption: item.caption,
      location: item.location,
      date: item.date
    });
  };

  return (
    <div className="space-y-16 sm:space-y-24 py-6">
      {/* Sections are listed, ordered and switched on/off in src/config/siteLayout.ts */}
      <PageSections
        page="gallery"
        sections={{
          // 14.1 HERO
          hero: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Gallery Hero">
              <div className="bg-[#143D2B] text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl border border-emerald-800">
                <div className="max-w-3xl space-y-6 relative z-10">
                  <span className="text-xs uppercase font-bold text-[#D99B26] tracking-widest block">
                    FIELD ARCHIVES & DOCUMENTARY
                  </span>
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif-heading font-extrabold text-white leading-tight">
                    A Visual Testament to Dignity, Courage & Transformation
                  </h1>
                  <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed">
                    Photographs capturing genuine human moments across stitching micro-centres in Junnar, classroom circles in Pune, and reformed rest homes in Gadchiroli.
                  </p>
                </div>
              </div>
            </section>
          ),

          // 14.2 CATEGORY FILTER BUTTONS
          filters: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Gallery Filters">
              <div className="flex flex-wrap items-center justify-center gap-2 border-b border-[#E5DFC5] pb-4">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeCategory === cat.id
                        ? 'bg-[#143D2B] text-white shadow-md'
                        : 'bg-[#FBF9F5] text-[#5C6760] hover:text-[#1F2421] border border-[#E5DFC5]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </section>
          ),

          // 14.3 GALLERY MASONRY-STYLE GRID
          grid: (
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Media Grid">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMedia.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleOpenItem(item)}
                    className="group relative bg-white rounded-2xl overflow-hidden border border-[#E5DFC5] shadow-sm hover:shadow-xl cursor-pointer transition-all flex flex-col"
                  >
                    <div className="relative h-64 overflow-hidden bg-black">
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-95 group-hover:opacity-100"
                        referrerPolicy="no-referrer"
                      />

                      {item.type === 'video' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <div className="w-12 h-12 rounded-full bg-[#C85A32] text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 bg-[#143D2B]/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase backdrop-blur-xs">
                        {item.category.replace('-', ' ')}
                      </div>

                      <div className="absolute bottom-3 left-3 right-3 bg-black/70 backdrop-blur-xs p-2.5 rounded-xl text-white text-xs flex items-center justify-between">
                        <span className="flex items-center gap-1 text-emerald-200">
                          <MapPin className="w-3 h-3 text-[#C85A32]" />
                          {item.location}
                        </span>
                        <span className="text-[10px] text-gray-300">{item.date}</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-1 bg-white">
                      <h4 className="text-sm font-bold font-serif-heading text-[#1F2421] group-hover:text-[#143D2B] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-[#5C6760] line-clamp-2">
                        {item.caption}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ),

          // BOTTOM CTA BAND
          bottomCta: (
            <BottomCTABand onOpenDonate={onOpenDonate} />
          ),
        }}
      />

      {/* Lightbox Modal */}
      <LightboxModal
        isOpen={!!lightboxMedia}
        onClose={() => setLightboxMedia(null)}
        media={lightboxMedia}
      />

    </div>
  );
};
