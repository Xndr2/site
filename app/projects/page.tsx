import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import Navbar from '../navbar';
import GitHubRepos from './_components/github-repos';
import GitHubReposSkeleton from './_components/github-repos-skeleton';

import AbandonedImg from '@/public/projects/abandoned/EN_Header_Capsule.png';
import FrontierNetworkImg from '@/public/projects/FrontierNetwork/FN_Website.png';
import HeadshotInteractiveImg from '@/public/projects/HeadshotInteractive/Thumbnail.png';
import XndrSiteImg from '@/public/projects/xndr.site/Thumbnail.png';
import JitseMoermanBeImg from '@/public/projects/jitsemoerman.be/Thumbnail.png';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Explore my projects including games, websites, and open source contributions.',
};

export const revalidate = 300; // Revalidate every 5 minutes

// Featured projects with images (not from GitHub)
const featuredProjects = [
  {
    img: FrontierNetworkImg,
    name: 'Frontier Network',
    description:
      'A Minecraft server network that takes traditional skyblock gameplay and turns it into something much more intense.',
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
    description:
      'I started my own game studio dedicated to developing Abandoned.',
    link: 'https://headshotinteractive.com',
  },
  {
    img: XndrSiteImg,
    name: 'xndr.site',
    description:
      'This website was made using React, Next.js, TypeScript and TailwindCSS.',
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

export default function Projects() {
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
          <h2 className="text-lg font-semibold text-slate-900 mb-5">
            Featured
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {featuredProjects.map(project => (
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
                    sizes="(max-width: 768px) 100vw, 50vw"
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
        <Suspense fallback={<GitHubReposSkeleton />}>
          <GitHubRepos />
        </Suspense>
      </main>
    </div>
  );
}
