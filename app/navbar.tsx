'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import HamburgerMenu from './hamburgerMenu';

interface NavbarProps {
  pageName: string;
}

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about-me', label: 'About Me' },
  { href: '/projects', label: 'Projects' },
  { href: '/blog', label: 'Blog' },
  { href: '/contact', label: 'Contact' },
];

export default function Navbar({ pageName = '' }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#fafbfc]/90 backdrop-blur-md border-b border-slate-200/50">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-6 py-3">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-12 h-12 flex-shrink-0 overflow-hidden rounded-full">
            <Image
              src="/icons/XndrPFP_cat.png"
              fill
              sizes="128px"
              className="object-cover object-top"
              alt="Xndr Logo"
              priority
            />
          </div>
          <span className="text-lg font-semibold text-slate-800">
            Xndr
            <span className=" font-normal text-xs">.site</span>
            <span className="text-slate-400 font-normal"> / {pageName}</span>
          </span>
        </Link>

        <HamburgerMenu isOpen={isMenuOpen} onToggle={toggleMenu} />

        <div
          className={`${
            isMenuOpen ? 'block' : 'hidden'
          } w-full md:block md:w-auto`}
        >
          <ul className="text-center flex flex-col p-4 md:p-0 mt-4 bg-white rounded-xl md:flex-row md:gap-1 md:mt-0 md:bg-transparent shadow-lg md:shadow-none border border-slate-100 md:border-0">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block py-2 px-4 text-slate-600 rounded-lg md:rounded-full hover:text-cat-pink hover:bg-cat-pink/5 transition-all text-sm font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}
