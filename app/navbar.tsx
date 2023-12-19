import Head from 'next/head'
import Image from 'next/image'
import HamburgerMenu from './hamburgerMenu'

export default function Navbar() {
    return (
        <>
            <nav>
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <Image
                            src="/icons/XndrPFP.png"
                            width={40}
                            height={40}
                            className="h-10"
                            alt="Xndr Logo"
                        />
                        <span className="self-center text-2xl font-bold whitespace-nowrap dark:text-white">Xndr</span>
                    </a>
                    <HamburgerMenu />
                    <div className="hidden w-full md:block md:w-auto NavbarClass" id="navbar-default">
                        <ul className="text-center font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:flex-row md:space-x-8 rtl:space-x-reverse md:mt-0 md:border-0 bg-transparent">
                            <li>
                                <a href="/" className="block py-2 px-3 text-gray-900 rounded 00 md:p-0 dark:text-white md:hover:underline" aria-current="page">Home</a>
                            </li>
                            <div className="md:hidden w-full h-px border my-2"></div>
                            <li>
                                <a href="projects" className="block py-2 px-3 text-gray-900 rounded 00 md:p-0 dark:text-white md:hover:underline">Projects</a>
                            </li>
                            <div className="md:hidden w-full h-px border my-2"></div>
                            <li>
                                <a href="contact" className="block py-2 px-3 text-gray-900 rounded 00 md:p-0 dark:text-white md:hover:underline">Contact</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}
