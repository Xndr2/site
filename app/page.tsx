import type { Metadata } from 'next'
import Navbar from './navbar'
import Particles from "./components/particles";
import TechStack from './components/tech-stack'

export const metadata: Metadata = {
  title: 'Xndr | Home',
  description: 'Home page for Xndr',
  icons: 'icons/XndrPFP.png',
}

export default function Home() {
  return (
    <>
      <Navbar
        pageName="Home"
      />
      <Particles
        className="fixed h-screen inset-0 -z-10"
        quantity={200}
      />
      <main className="max-w-screen-xl text-center mx-auto h-full animate-fade-in">
        <div className="text-xl pt-20 md:pt-80 px-4">
          <h1 className="text-3xl mb-4">Hi, I&apos;m <p className="text-blue-500 inline">Xander</p>.</h1>
          <h2>
            A self taught developer from <p className="text-blue-500 inline">Belgium</p>.
            <br />
            Project Lead @ {" "}
            <a href="https://www.headshotinteractive.com/" className="underline underline-offset-4 duration-500 hover:text-blue-400" target='_blank'>
              Headshot Interactive
            </a> working on <a href="https://www.headshotinteractive.com/abandoned" className="underline underline-offset-4 duration-500 hover:text-blue-400" target='_blank'>Abandoned</a>
          </h2>
          <TechStack/>
        </div>
      </main>
    </>
  )
}
