import { url } from 'inspector'
import type { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from './navbar'
import Footer from './footer'
import Link from 'next/link'
import Particles from "./components/particles";

export const metadata: Metadata = {
  title: 'Xndr | Home',
  description: 'Home page for Xndr',
  icons: 'icons/XndrPFP.png',
}

export default function Home() {
  return (
    <>
      <Navbar />
      <Particles
        className="absolute inset-0 -z-10"
        quantity={100}
      />
      <main className="max-w-screen-xl text-center mx-auto h-full animate-title">
        <div className="text-xl pt-20 md:pt-80 px-4">
          <h1 className="text-3xl mb-4">Hi, I'm <p className="text-blue-500 inline">Xander</p>.</h1>
          <h2>A self taught developer from <p className="text-blue-500 inline">Belgium</p>. I create applications or systems for people online.</h2>
          <h3 className="text-zinc-500 text-base">
            Currently working on{" "}
            <Link
              target="_blank"
              href="/"
              className="underline duration-500 hover:text-zinc-300"
            >
              Abandoned
            </Link>. A Sci-Fi tactical shooter game in Unreal Engine.
          </h3>
        </div>
      </main>
      <Footer />
    </>
  )
}
