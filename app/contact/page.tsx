import { url } from 'inspector'
import type { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../navbar'
import Footer from '../footer'
import Link from 'next/link'
import Particles from '../components/particles'

export const metadata: Metadata = {
    title: 'Xndr | Contact',
    description: 'Contact page for Xndr',
    icons: 'icons/XndrPFP.png',
}

export default function Contact() {
    return (
        <>
            <Navbar />
            <Particles
                className="absolute inset-0 -z-10"
                quantity={100}
            />
            <main className="max-w-screen-xl text-center mx-auto h-full animate-title md:mt-40">
                <h1 className="text-3xl mb-4">Contact page coming <p className="text-blue-500 inline">soon</p></h1>
            </main>
            <Footer />
        </>
    )
}
