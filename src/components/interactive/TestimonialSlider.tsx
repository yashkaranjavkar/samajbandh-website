import React, { useState } from 'react';
import { Testimonial } from '../../types';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

interface TestimonialSliderProps {
  testimonials: Testimonial[];
}

export const TestimonialSlider: React.FC<TestimonialSliderProps> = ({ testimonials }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prev = () => {
    setCurrentIndex((prevIdx) => (prevIdx === 0 ? testimonials.length - 1 : prevIdx - 1));
  };

  const next = () => {
    setCurrentIndex((prevIdx) => (prevIdx === testimonials.length - 1 ? 0 : prevIdx + 1));
  };

  const current = testimonials[currentIndex];

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E5DFC5] shadow-lg relative overflow-hidden">
      {/* Decorative large quotation mark */}
      <Quote className="absolute right-6 bottom-6 w-32 h-32 text-[#143D2B]/5 pointer-events-none" />

      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Category Pill & Nav Buttons */}
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-bold text-[#C85A32] bg-[#C85A32]/10 px-3 py-1 rounded-full tracking-wider">
            {current.category.toUpperCase()} PERSPECTIVE
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={prev}
              className="p-2 rounded-full border border-[#E5DFC5] hover:bg-[#FBF9F5] text-gray-700 transition-colors"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-[#5C6760] font-medium">
              {currentIndex + 1} of {testimonials.length}
            </span>
            <button
              onClick={next}
              className="p-2 rounded-full border border-[#E5DFC5] hover:bg-[#FBF9F5] text-gray-700 transition-colors"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Testimonial Quote */}
        <p className="text-lg sm:text-xl md:text-2xl font-serif-heading text-[#1F2421] leading-relaxed italic">
          "{current.content}"
        </p>

        {/* Author Details */}
        <div className="flex items-center gap-4 pt-4 border-t border-[#E5DFC5]/60">
          <img
            src={current.avatar}
            alt={current.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-[#143D2B]/30 shadow-sm"
            referrerPolicy="no-referrer"
          />
          <div>
            <h4 className="text-base font-bold text-[#143D2B]">
              {current.name}
            </h4>
            <p className="text-xs text-[#5C6760]">
              {current.designation} {current.organization && `• ${current.organization}`}
            </p>
            <p className="text-[11px] text-[#87986A] font-semibold mt-0.5">
              {current.location}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};
