'use client';

import { useEffect, useRef, useState } from 'react';

interface ProgressBarProps {
  level: number;
  maxLevel?: number;
  showLabel?: boolean;
}

export default function ProgressBar({ level, maxLevel = 5, showLabel = true }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Animate the width when the bar comes into view
            setTimeout(() => {
              setWidth((level / maxLevel) * 100);
            }, 100);
            // Unobserve after animation starts
            if (progressRef.current) {
              observer.unobserve(progressRef.current);
            }
          }
        });
      },
      { threshold: 0.1 }
    );

    if (progressRef.current) {
      observer.observe(progressRef.current);
    }

    return () => {
      if (progressRef.current) {
        observer.unobserve(progressRef.current);
      }
    };
  }, [level, maxLevel]);

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-1">
      </div>
      <div className="w-full bg-gray-700 rounded-full h-1.5" ref={progressRef}>
        <div 
          className="bg-blue-500 h-1.5 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        ></div>
      </div>
    </div>
  );
}