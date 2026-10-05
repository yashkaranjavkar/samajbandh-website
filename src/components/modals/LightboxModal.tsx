import React from 'react';
import { X, MapPin, Calendar } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  media: {
    type: 'image' | 'video';
    url: string;
    title: string;
    caption?: string;
    location?: string;
    date?: string;
  } | null;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  media
}) => {
  if (!isOpen || !media) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full bg-white/10 transition-colors z-10"
        aria-label="Close"
      >
        <X className="w-6 h-6" />
      </button>

      <div 
        className="max-w-4xl w-full bg-[#1F2421] text-white rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-black flex items-center justify-center max-h-[70vh] overflow-hidden">
          {media.type === 'image' ? (
            <img
              src={media.url}
              alt={media.title}
              className="max-h-[70vh] w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-full aspect-video">
              <iframe
                src={media.url}
                title={media.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>

        <div className="p-5 space-y-2 bg-[#1B4332]/90">
          <h3 className="text-lg font-serif-heading font-bold text-white">
            {media.title}
          </h3>
          {media.caption && (
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              {media.caption}
            </p>
          )}
          <div className="flex items-center gap-4 text-[11px] text-emerald-300/80 pt-1">
            {media.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                {media.location}
              </span>
            )}
            {media.date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {media.date}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
