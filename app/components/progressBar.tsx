'use client';

import { useEffect, useRef, useState } from 'react';

interface ProgressBarProps {
  level: number;
  maxLevel?: number;
}

export default function ProgressBar({ level, maxLevel = 5 }: ProgressBarProps) {
  const [width, setWidth] = useState(0);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = progressRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              setWidth((level / maxLevel) * 100);
            }, 100);
            observer.unobserve(element);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [level, maxLevel]);

  return (
    <div className="w-full" ref={progressRef}>
      <div className="w-full bg-slate-200 rounded-full h-1">
        <div 
          className="bg-cat-sky h-1 rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}