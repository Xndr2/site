import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '../navbar';
import { fetchGitHubRepos, languageColors, type ProcessedRepo } from '@/app/lib/github';

import AbandonedImg from '@/public/projects/abandoned/EN_Header_Capsule.png';
import FrontierNetworkImg from '@/public/projects/FrontierNetwork/FN_Website.png';
import HeadshotInteractiveImg from '@/public/projects/HeadshotInteractive/Thumbnail.png';
import XndrSiteImg from '@/public/projects/xndr.site/Thumbnail.png';
import JitseMoermanBeImg from '@/public/projects/jitsemoerman.be/Thumbnail.png';

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my projects including games, websites, and open source contributions.',
};

// Featured projects with images (not from GitHub)
const featuredProjects = [
  {
    img: FrontierNetworkImg,
    name: 'Frontier Network',
    description: 'A Minecraft server network that takes traditional skyblock gameplay and turns it into something much more intense.',
    link: 'https://frontiernetwork.be',
  },
  {
    img: AbandonedImg,
    name: 'Abandoned',
    description:
      'Abandoned is a psychological thriller set in a universe created by Headshot Interactive.',
    link: 'https://headshotinteractive.com/#Abandoned',
  },
  {
    img: HeadshotInteractiveImg,
    name: 'Headshot Interactive',
    description: 'I started my own game studio dedicated to developing Abandoned.',
    link: 'https://headshotinteractive.com',
  },
  {
    img: XndrSiteImg,
    name: 'xndr.site',
    description: 'This website was made using React, Next.js, TypeScript and TailwindCSS.',
    link: '/',
    internal: true,
  },
  {
    img: JitseMoermanBeImg,
    name: 'jitsemoerman.be',
    description:
      'Portfolio for a student interior designer. Made using React, Next.js and Tailwind.',
    link: 'https://www.jitsemoerman.be/',
  },
];

function GitHubRepoCard({ repo }: { repo: ProcessedRepo }) {
  const langColor = repo.language ? languageColors[repo.language] || '#6e7681' : '#6e7681';

  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block p-5 rounded-xl border border-slate-200 shadow-sm hover:border-cat-pink hover:shadow-md transition-all bg-white"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-medium text-slate-800 group-hover:text-cat-sky transition-colors">
          {repo.name}
        </h3>
        <svg
          className="w-4 h-4 text-slate-300"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </div>
      <p className="text-slate-500 text-sm mb-3 line-clamp-2">{repo.description}</p>
      <div className="flex items-center gap-4 text-xs text-slate-400">
        {repo.language && (
          <span className="flex items-center gap-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: langColor }}
            />
            {repo.language}
          </span>
        )}
        {repo.stars > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z" />
            </svg>
            {repo.stars}
          </span>
        )}
        {repo.forks > 0 && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 3a3 3 0 013 3v4a3 3 0 01-3 3H3a3 3 0 01-3-3V6a3 3 0 013-3h3zm0 2H3a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 001-1V6a1 1 0 00-1-1zm15 0h-3a1 1 0 00-1 1v4a1 1 0 001 1h3a1 1 0 001-1V6a1 1 0 00-1-1zm0-2a3 3 0 013 3v4a3 3 0 01-3 3h-3a3 3 0 01-3-3V6a3 3 0 013-3h3zM6 15a3 3 0 013 3v4H7v-4a1 1 0 00-1-1H3a1 1 0 00-1 1v4H0v-4a3 3 0 013-3h3z" />
            </svg>
            {repo.forks}
          </span>
        )}
      </div>
      {repo.topics.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {repo.topics.slice(0, 4).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 text-xs bg-slate-100 text-slate-500 rounded"
            >
              {topic}
            </span>
          ))}
        </div>
      )}
    </a>
  );
}

export default async function Projects() {
  const githubRepos = await fetchGitHubRepos();

  return (
    <div className="min-h-screen bg-[#fafbfc] animate-fade-in">
      <Navbar pageName="Projects" />

      <main className="max-w-screen-lg mx-auto px-6 pt-28 md:pt-36 pb-16">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Projects
          </h1>
          <p className="text-slate-500">
            A collection of my work including games, websites, and open source.
          </p>
        </div>

        {/* Featured Projects */}
        <section className="mb-16">
          <h2 className="text-lg font-semibold text-slate-900 mb-5">Featured</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredProjects.map((project) => (
              <Link
                key={project.name}
                href={project.link}
                target={project.internal ? '_self' : '_blank'}
                rel={project.internal ? undefined : 'noopener noreferrer'}
                className="group block p-4 rounded-xl border border-slate-200 shadow-sm hover:border-cat-pink hover:shadow-md transition-all bg-white"
              >
                {project.img && (
                  <Image
                    className="w-full h-40 object-cover rounded-lg mb-4"
                    src={project.img}
                    alt={project.name}
                    placeholder="blur"
                  />
                )}
                <h3 className="text-base font-medium text-slate-800 group-hover:text-cat-pink transition-colors mb-1">
                  {project.name}
                </h3>
                <p className="text-slate-500 text-sm">{project.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* GitHub Projects */}
        {githubRepos.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900">Open Source</h2>
              <a
                href="https://github.com/Xndr2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-slate-500 hover:text-cat-sky transition-colors flex items-center gap-1"
              >
                View all
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {githubRepos.slice(0, 6).map((repo) => (
                <GitHubRepoCard key={repo.id} repo={repo} />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
