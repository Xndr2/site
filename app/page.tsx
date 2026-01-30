import type { Metadata } from 'next';
import Link from 'next/link';
import Navbar from './navbar';
import TechStack from './components/tech-stack';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Xander - Self-taught developer from Belgium specializing in game development and web applications.',
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#fafbfc] animate-fade-in">
      <Navbar pageName="Home" />

      {/* Hero Section */}
      <main className="max-w-screen-lg mx-auto px-6 relative z-10">
        <div className="min-h-screen flex flex-col justify-center items-center text-center pt-16">
          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-slate-900 mb-6 tracking-tight">
            Hi, I&apos;m{' '}
            <span className="text-cat-pink">Xander</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-500 max-w-xl mb-8 leading-relaxed">
            A self-taught developer from <span className="text-cat-sky font-medium">Belgium</span>,
            passionate about creating things through code.
          </p>

          {/* Role */}
          <p className="text-slate-400">
            Founder & Lead Dev @{' '}
            <a
              href="https://www.frontiernetwork.be/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-cat-pink transition-colors"
            >
              Frontier Network
            </a>
          </p>
          {/* Role */}
          <p className="text-slate-400 mb-10">
            Project Lead @{' '}
            <a
              href="https://www.headshotinteractive.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-600 hover:text-cat-pink transition-colors"
            >
            Headshot Interactive
            </a>
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-16">
            <Link
              href="/projects"
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-lg transition-all hover:shadow-lg"
            >
              View My Work
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3 border border-slate-200 hover:border-cat-pink hover:text-cat-pink text-slate-600 font-medium rounded-lg transition-all"
            >
              Get In Touch
            </Link>
          </div>

          {/* Tech Stack */}
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest mb-4">
              Technologies
            </p>
            <TechStack />
          </div>
        </div>
      </main>
    </div>
  );
}
