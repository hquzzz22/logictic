'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export default function AnimatedCounter({ value, duration = 2000 }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState('0');
  const elementRef = useRef<HTMLSpanElement>(null);
  
  useEffect(() => {
    // Match prefix, number (can include commas/dots), suffix
    const match = value.match(/^(\D*)([\d,.]+)(\D*)$/);
    
    if (!match) {
      setDisplayValue(value);
      return;
    }
    
    const pref = match[1] || '';
    // Remove commas before parsing
    const rawNumberString = match[2].replace(/,/g, '');
    const target = parseFloat(rawNumberString);
    const suff = match[3] || '';
    
    // Check if original had comma formatting (simple heuristic)
    const hasCommas = match[2].includes(',');
    
    // Initial display
    setDisplayValue(`${pref}0${suff}`);
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          let startTimestamp: number | null = null;
          
          const step = (timestamp: number) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            
            // easeOutExpo
            const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            
            const currentVal = Math.floor(easeOut * target);
            // Format with commas if original had commas
            const formattedVal = hasCommas ? currentVal.toLocaleString('en-US') : currentVal.toString();
            
            setDisplayValue(`${pref}${formattedVal}${suff}`);
            
            if (progress < 1) {
              requestAnimationFrame(step);
            } else {
              const finalVal = hasCommas ? target.toLocaleString('en-US') : target.toString();
              setDisplayValue(`${pref}${finalVal}${suff}`);
            }
          };
          
          requestAnimationFrame(step);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, [value, duration]);

  return <span ref={elementRef}>{displayValue}</span>;
}
