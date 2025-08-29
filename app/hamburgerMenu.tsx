'use client'

import React, { useState } from 'react';

export default function HamburgerMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavbar = () => {
        const str = "w-full md:block md:w-auto NavbarClass"; // MUST BE THE SAME AS IN NAVBAR
        const div = document.getElementsByClassName("NavbarClass")[0];
        if (!div) return;
        
        if(isOpen) {
            div.setAttribute("class", "hidden " + str);
            setIsOpen(false);
        } else {
            div.setAttribute("class", "visible " + str);
            setIsOpen(true);
        }
    };

    return (
        <button onClick={toggleNavbar} className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-white rounded-lg md:hidden hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-500 border border-gray-300 dark:border-gray-600">
            {isOpen ? (
                // Cross icon when menu is open
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                // Hamburger icon when menu is closed
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )}
        </button>
    )
}
