"use client"
import { useState } from "react";

export default function Alert() {
  const [isVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div className="relative top-0 left-0 w-full bg-red-500/90 text-white text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1 shadow-md flex items-center justify-between z-50">
      <span className="mx-auto text-center">
        🚧 This site is a work in progress. Some projects may be missing or outdated.
      </span>
      {/* <button
        className="absolute right-4 text-white hover:text-gray-200 focus:outline-none text-sm sm:text-base"
        onClick={() => setIsVisible(false)}
      >
        ✕
      </button> */}
    </div>
  );
}
