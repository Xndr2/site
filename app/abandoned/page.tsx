import { url } from 'inspector'
import type { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../navbar'
import Footer from '../footer'
import Link from 'next/link'
import Particles from "../components/particles";

export const metadata: Metadata = {
    title: 'Xndr | Home',
    description: 'Home page for Xndr',
    icons: 'icons/XndrPFP.png',
}

export default function Home() {
    return (
        <>
            <Navbar
                pageName="Abandoned"
            />
            <Particles
                className="absolute inset-0 -z-10"
                quantity={200}
            />
            <main className="max-w-screen-xl text-center mx-auto h-full animate-title">
                <div className="text-xl pt-20 md:pt-80 px-4">
                    <h1 className="text-3xl mb-4">Work in progress</h1>

                </div>
            </main>
        </>
    )
}
