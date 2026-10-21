import React, { useState, useEffect, useRef } from 'react';

interface CountUpNumberProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  duration?: number;
  className?: string;
  decimalPlaces?: number;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  prefix = '',
  suffix = '',
  duration = 2000,
  className = '',
  decimalPlaces = 0
}) => {
  const [displayValue, setDisplayValue] = useState<number>(0);
  const [hasAnimated, setHasAnimated] = useState<boolean>(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Extract numeric value and any implicit suffix if a string is provided (e.g. "300+", "50000+", "82%")
  let targetNumber = 0;
  let parsedSuffix = suffix;
  let parsedPrefix = prefix;

  if (typeof value === 'number') {
    targetNumber = value;
  } else {
    const cleanStr = String(value).trim();
    // Check if starts with currency or prefix
    const prefixMatch = cleanStr.match(/^([^0-9.]+)/);
    if (prefixMatch && !prefix) {
      parsedPrefix = prefixMatch[1];
    }
    // Extract suffix like +, %, etc.
    const suffixMatch = cleanStr.match(/([0-9.,]+)(.*)$/);
    if (suffixMatch) {
      const numPart = suffixMatch[1].replace(/,/g, '');
      targetNumber = parseFloat(numPart) || 0;
      if (suffixMatch[2] && !suffix) {
        parsedSuffix = suffixMatch[2];
      }
    } else {
      targetNumber = parseFloat(cleanStr.replace(/[^0-9.]/g, '')) || 0;
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startCounting();
        }
      },
      { threshold: 0.15 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, targetNumber]);

  const startCounting = () => {
    const startTime = performance.now();
    const startVal = 0;
    const endVal = targetNumber;

    const easeOutExpo = (t: number) => {
      return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
    };

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutExpo(progress);

      const currentNumber = startVal + (endVal - startVal) * easedProgress;
      setDisplayValue(currentNumber);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayValue(endVal);
      }
    };

    requestAnimationFrame(updateCounter);
  };

  const formattedNumber = decimalPlaces > 0
    ? displayValue.toLocaleString('en-IN', {
        minimumFractionDigits: decimalPlaces,
        maximumFractionDigits: decimalPlaces
      })
    : Math.floor(displayValue).toLocaleString('en-IN');

  return (
    <span ref={ref} className={`inline-block font-numeric ${className}`}>
      {parsedPrefix}{formattedNumber}{parsedSuffix}
    </span>
  );
};
