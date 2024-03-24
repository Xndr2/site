import { url } from 'inspector'
import type { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../navbar'
import Footer from '../footer'
import Link from 'next/link'
import Particles from '../components/particles'

export const metadata: Metadata = {
  title: 'Xndr | Projects',
  description: 'Projects page for Xndr',
  icons: 'icons/XndrPFP.png',
}

export default function Projects() {
  return (
    <>
      <Navbar
        pageName='Projects'
      />
      <Particles
        className="absolute inset-0 -z-10"
        quantity={100}
      />
      <main className="max-w-screen-xl text-center mx-auto animate-title mt-4 md:mt-10 md:overflow-hidden h-128 md:h-96">
        <div className="container m-auto w-3/4 md:w-full grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          <div className="tile border border-slate-400 hover:border-slate-200 rounded h-56 md:h-full bg-gradient-to-br from-slate-200/5 to-slate-400/10 ">
            <h1 className="tile-marker mt-4">ABANDONED</h1>
            <h2 className="mt-4 leading-6">A Sci-Fi tactical shooter made in&nbsp;
              <Link target="_blank" href="https://www.unrealengine.com/en-US" className="underline">Unreal Engine 5</Link>.
            </h2>

            <Link href="abandoned" className="flex mt-2 w-max mx-auto border rounded p-4 hover:text-xl">Info &rarr;</Link>
          </div>

          <div className="tile border border-slate-400 hover:border-slate-200 rounded h-56 md:h-full bg-gradient-to-br from-slate-200/5 to-slate-400/10">
            <h1 className="tile-marker mt-4">DiSCORD BOT</h1>
            <h2 className="mt-4 leading-6"> Using&nbsp;
              <Link target="_blank" href="https://discord.js.org" className="underline">Discord.js</Link>,&nbsp;
              <Link target="_blank" href="https://nodejs.org/en" className="underline">Node.js</Link> and the&nbsp;
              <Link target="_blank" href="https://discord.com/developers/docs/intro" className="underline">Discord API</Link>.
              <br />Hosted on <Link target="_blank" href="https://daki.cc" className="underline">Daki.cc</Link>.
            </h2>

            <Link href="#" className="flex mt-2 w-max mx-auto border rounded p-4 hover:text-xl cursor-not-allowed">Info &rarr;</Link>
          </div>

          <div className="tile border border-slate-400 hover:border-slate-200 rounded h-56 md:h-full bg-gradient-to-br from-slate-200/5 to-slate-400/10">
            <h1 className="tile-marker mt-4">PORTFOLIO / WEBSITE</h1>
            <h2 className="mt-4 leading-6"> Made with&nbsp;
              <Link target="_blank" href="https://nextjs.org/" className="underline">Next.js</Link>,&nbsp;
              <Link target="_blank" href="https://tailwindcss.com/" className="underline">Tailwind CSS</Link> and&nbsp;
              <Link target="_blank" href="https://www.typescriptlang.org/" className="underline">TypeScript</Link>.
            </h2>

            <Link href="#" className="flex mt-2 w-max mx-auto border rounded p-4 hover:text-xl cursor-not-allowed">Info &rarr;</Link>
          </div>

          <div className="tile border border-slate-400 hover:border-slate-200 rounded h-56 md:h-full bg-gradient-to-br from-slate-200/5 to-slate-400/10">
            <h1 className="tile-marker mt-4">RIKI KUURNE</h1>
            <h2 className="mt-4 leading-6"> Made with&nbsp;
              <Link target="_blank" href="https://nextjs.org/" className="underline">Next.js</Link>,&nbsp;
              <Link target="_blank" href="https://tailwindcss.com/" className="underline">CSS</Link> and&nbsp;
              <Link target="_blank" href="https://www.typescriptlang.org/" className="underline">JavaScript</Link>.
              <br />The website for my uncle <Link target="_blank" href="https://rikikuurne.github.io/" className="underline">Riki</Link>. [Link Soon]
            </h2>

            <Link href="#" className="flex mt-2 w-max mx-auto border rounded p-4 hover:text-xl cursor-not-allowed">Info &rarr;</Link>
          </div>

        </div>
      </main>
    </>
  )
}
