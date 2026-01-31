import type { Metadata } from 'next';
import Navbar from '../navbar';
import Image from 'next/image';
import { skillCategories } from '@/app/data/skills';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Xander - a self-taught developer from Belgium specializing in game development and web applications.',
};

export default function About() {
  return (
    <div className="min-h-screen bg-[#fafbfc] animate-fade-in">
      <Navbar pageName="About" />

      <main className="max-w-screen-md mx-auto px-6 pt-28 md:pt-36 pb-16">
        {/* Header */}
        <div className="mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            About Me
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed">
            I started coding by messing around with scripts in games. Eventually,
            I got more into it and started making my own stuff. Now I work on my
            own project,{' '}
            <a
              href="https://www.headshotinteractive.com/abandoned"
              className="text-cat-sky hover:text-cat-pink transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              Abandoned
            </a>
            , while doing freelance coding jobs on the side.
          </p>
        </div>

        {/* Skills */}
        <section>
          <h2 className="text-xl font-semibold text-slate-900 mb-6">Skills</h2>

          <div className="space-y-8">
            {skillCategories.map((category) => (
              <div key={category.category}>
                <h3 className="text-sm font-medium text-slate-400 uppercase tracking-wide mb-3">
                  {category.category}
                </h3>

                <div className="flex flex-wrap gap-2">
                  {category.items.map((tech) => {
                    const level = tech.level;
                    const bgOpacity = level >= 4 ? 'bg-cat-sky/20 text-cat-sky border-cat-sky/30' 
                      : level >= 3 ? 'bg-slate-100 text-slate-700 border-slate-200' 
                      : 'bg-slate-50 text-slate-500 border-slate-100';
                    
                    return (
                      <div
                        key={tech.name}
                        className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-full border ${bgOpacity} text-sm cursor-default`}
                      >
                        <Image
                          src={tech.src}
                          alt={tech.name}
                          width={16}
                          height={16}
                          className="opacity-70"
                          style={{ filter: 'brightness(0)' }}
                        />
                        <span>{tech.name}</span>
                        {/* Mobile: show inline */}
                        <span className="text-xs opacity-60 md:hidden">({tech.level})</span>
                        {/* Desktop: show on hover */}
                        <div className="hidden md:block absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                          {tech.level}/5 proficiency
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <p className="text-xs text-slate-400 mt-6">
            Hover over skills to see proficiency level. Highlighted skills indicate higher proficiency.
          </p>
        </section>
      </main>
    </div>
  );
}
