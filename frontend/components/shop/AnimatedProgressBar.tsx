'use client';

import { useState, useEffect, useRef } from 'react';

interface AnimatedProgressBarProps {
  targetWidth: string; // e.g. "85%"
  duration?: number;
}

export default function AnimatedProgressBar({ targetWidth, duration = 2000 }: AnimatedProgressBarProps) {
  const [width, setWidth] = useState('0%');
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          // Small timeout to allow the browser to paint the 0% state first
          setTimeout(() => {
            setWidth(targetWidth);
          }, 100);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    
    if (elementRef.current) {
      observer.observe(elementRef.current);
    }
    
    return () => observer.disconnect();
  }, [targetWidth]);

  return (
    <div 
      ref={elementRef}
      className="h-full bg-[#ff3f39] rounded-full transition-all ease-out" 
      style={{ width, transitionDuration: `${duration}ms` }}
    ></div>
  );
}
