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

import AbandonedImg from "@/public/projects/abandoned/Thumbnail.jpg"
import HeadshotInteractiveImg from "@/public/projects/HeadshotInteractive/Thumbnail.png"
import XndrSiteImg from "@/public/projects/xndr.site/Thumbnail.png"
import JitseMoermanBeImg from "@/public/projects/jitsemoerman.be/Thumbnail.png"
import RendererImg from "@/public/projects/renderer/Thumbnail.png"
import DiscordBotImg from "@/public/projects/DiscordBot/Thumbnail.png"

export default function Projects() {

  let projects = [
    {
      img: AbandonedImg,
      name: "Abandoned: Prologue",
      description: "Part 1 in the Abandoned video game series. Abandoned is a Sci-Fi tactical PvE shooter.",
      link: "/abandoned",
      target: "_self"
    },
    {
      img: HeadshotInteractiveImg,
      name: "Headshot Interactive",
      description: "I've made my own game studio. Our group is responsible for developing Abandoned and Abandoned: Prologue.",
      link: "https://headshotinteractive.com",
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
      img: RendererImg,
      name: "Graphics Renderer",
      description: "An OpenGL renderer using GLFW and Glad. Work in progress",
      link: "https://github.com/Xndr2/Graphics_Renderer",
      target: "_black"
    },
    {
      img: DiscordBotImg,
      name: "Discord Bot",
      description: "Discord bot made with DiscordJS v14. Written in JavaScript.",
      link: "https://github.com/Xndr2/Abandoned-Bot",
      target: "_black"
    },
  ]


  return (
    <>
      <Navbar
        pageName='Projects'
      />
      <Particles
        className="fixed h-screen inset-0 -z-10"
        quantity={200}
      />
      <main className="max-w-screen-xl text-center mx-auto animate-title mt-4 md:mt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {projects.map((project) => (
            <div className=" bg-black p-5 mx-5 md:mx-0 rounded-lg border border-solid  border-[#808080] duration-500 hover:-translate-y-4 hover:border-blue-500">
              <Link href={project.link} target={project.target}>
                <Image
                  className="w-auto max-h-64 mx-auto"
                  src={project.img.src}
                  width={project.img.width}
                  height={project.img.height}
                  alt={project.name} />
                <h1 className="mt-4 text-xl font-medium underline underline-offset-2">{project.name}</h1>
                <h1 className="mt-2 text-md">{project.description}</h1>
              </Link>
            </div>
          ))};
        </div>
      </main>
    </>
  )
}
