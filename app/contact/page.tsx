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
            <Navbar
                pageName='Contact'
            />
            <Particles
                className="absolute inset-0 -z-10"
                quantity={100}
            />
            <main className="max-w-screen-xl bg-blue-600">

            </main>
        </>
    )
}
