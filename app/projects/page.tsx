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

import AbandonedImg from "@/public/projects/abandoned/EN_Header_Capsule.png"
import HeadshotInteractiveImg from "@/public/projects/HeadshotInteractive/Thumbnail.png"
import XndrSiteImg from "@/public/projects/xndr.site/Thumbnail.png"
import JitseMoermanBeImg from "@/public/projects/jitsemoerman.be/Thumbnail.png"
import RendererImg from "@/public/projects/renderer/Thumbnail.png"
import DiscordBotImg from "@/public/projects/DiscordBot/Thumbnail.png"

export default function Projects() {

  let projects = [
    {
      img: AbandonedImg,
      name: "Abandoned",
      description: "Abandoned is a psychological thriller set in a universe created by Headshot Interactive.",
      link: "https://headshotinteractive.com/#Abandoned",
      target: "_black"
    },
    {
      img: HeadshotInteractiveImg,
      name: "Headshot Interactive",
      description: "I started my own game studio dedicated to developing Abandoned.",
      link: "https://headshotinteractive.com",
      target: "_black"
    },
    {
      img: null,
      name: "Game Dev Wiki",
      description: "A wiki dedicated to helping beginners get started with game development.",
      link: "https://github.com/Xndr2/GameDevWiki",
      target: "_black"
    },
    {
      img: null,
      name: "Discord Bot",
      description: "Discord bot made with DiscordJS v14. Written in JavaScript.",
      link: "https://github.com/Xndr2/Abandoned-Bot",
      target: "_black"
    },
    {
      img: XndrSiteImg,
      name: "xndr.site",
      description: "This website was made using React, NextJS, Typescript and TailwindCSS.",
      link: "/",
      target: "_self"
    },
    {
      img: JitseMoermanBeImg,
      name: "jitsemoerman.be",
      description: "I made this portfolio for a student interior design. Again made using React, NextJS and Tailwind.",
      link: "https://www.jitsemoerman.be/",
      target: "_black"
    },
    {
      img: null,
      name: "Graphics Renderer",
      description: "An OpenGL renderer using GLFW and Glad. Work in progress",
      link: "https://github.com/Xndr2/Graphics_Renderer",
      target: "_black"
    },
  ]


  return (
    <>
    <div className="min-h-screen bg-gradient-to-b text-gray-100 animate-fade-in">
      <Navbar pageName='Projects' />
      <Particles className="fixed h-screen inset-0 -z-10" quantity={200} />

      <main className="max-w-screen-lg mx-auto p-6 pt-24 md:pt-32">
        <div className="flex flex-col items-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r text-white bg-clip-text text-transparent">
            Projects
          </h1>
          <div className="w-16 h-1 bg-blue-500 my-6 mx-auto"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            {projects.map((project) => (
              <div key={project.name} className="bg-transparent p-5 mx-5 md:mx-0 rounded-lg border border-solid border-[#808080] duration-500 hover:-translate-y-4 hover:border-blue-500">
                <Link href={project.link} target={project.target}>
                  {/* Only render the image if it exists */}
                  {project.img ? (
                    <Image
                      className="w-auto max-h-64 mx-auto mb-4 rounded-lg border border-solid border-[#808080]"
                      src={project.img.src}
                      width={project.img.width}
                      height={project.img.height}
                      alt={project.name} 
                    />
                  ) : (
                    <div className='hidden'></div>
                  )}
                  <h1 className="text-xl font-medium underline underline-offset-2">{project.name}</h1>
                  <h1 className="mt-2 text-md">{project.description}</h1>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
    </>
  )
}
