'use client';

interface HamburgerMenuProps {
  isOpen: boolean;
  onToggle: () => void;
}

export default function HamburgerMenu({
  isOpen,
  onToggle,
}: HamburgerMenuProps) {
  return (
    <button
      onClick={onToggle}
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
      className="inline-flex items-center p-2 w-9 h-9 justify-center text-slate-500 rounded-lg md:hidden hover:bg-slate-100 focus:outline-none transition-colors"
    >
      {isOpen ? (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      ) : (
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      )}
    </button>
  );
}
