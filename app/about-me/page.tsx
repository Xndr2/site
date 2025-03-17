import type { Metadata } from 'next';
import Navbar from '../navbar';
import Particles from "../components/particles";
import Image from "next/image";
import ProgressBar from '../components/progressBar';

export const metadata: Metadata = {
  title: 'Xndr | About',
  description: 'About Xander',
  icons: 'icons/XndrPFP.png',
};

const techStack = [
    {
      category: "Programming Languages",
      items: [
        { name: "Unreal Blueprints", src: "/icons/unreal-engine.svg", level: 5 },
        { name: "C#", src: "/icons/c-sharp-logo.svg", level: 4 },
        { name: "C++", src: "/icons/c++.svg", level: 3.5 },
        { name: "GDScript", src: "/icons/godot.png", level: 3.5 },
        { name: "Java", src: "/icons/java.svg", level: 3 },
        { name: "Python", src: "/icons/python.svg", level: 3 }, 
        { name: "TypeScript", src: "/icons/typescript.svg", level: 3 }, 
        { name: "JavaScript", src: "/icons/javascript.svg", level: 3 }, 
        { name: "LUA", src: "/icons/lua-language.svg", level: 2.5 },
        { name: "C", src: "/icons/c.svg", level: 2 },
        { name: "HLSL/Shader Programming", src: "/icons/unreal-engine.svg", level: 2 }
      ]
    },
    {
      category: "Tools",
      items: [
        { name: "Steamworks", src: "/icons/steam.svg", level: 4.5 },
        { name: "Git & GitHub", src: "/icons/github.svg", level: 4.5 },
        { name: "Trello & Jira", src: "/icons/trello.svg", level: 4 }, 
        { name: "Azure Git", src: "/icons/azure.png", level: 3 },
        { name: "Blender", src: "/icons/blender.svg", level: 3 },
        { name: "Linux", src: "/icons/linux.png", level: 3 }, 
        { name: "Perforce", src: "/icons/perforce.svg", level: 2 }
      ]
    },
    {
      category: "Game Engines",
      items: [
        { name: "Unreal Engine", src: "/icons/unreal-engine.svg", level: 5 },
        { name: "Godot", src: "/icons/godot.png", level: 3.5 },
        { name: "Unity", src: "/icons/unity.svg", level: 3.5 },
        { name: "Roblox Studio", src: "/icons/roblox.svg", level: 2.5 },
        { name: "Custom OpenGL Engine", src: "/icons/opengl.png", level: 2 },
        { name: "CryEngine", src: "/icons/cryengine.png", level: 1 },
      ]
    },
    {
      category: "Web Development",
      items: [
        { name: "HTML & CSS", src: "/icons/html.svg", level: 4 },
        { name: "Tailwind CSS", src: "/icons/tailwind-css.svg", level: 4 }, 
        { name: "Next.js", src: "/icons/nextjs.svg", level: 3.5 },
        { name: "React", src: "/icons/react.svg", level: 3.5 }, 
      ]
    },
  ];

export default function About() {
return (
    <div className="min-h-screen bg-gradient-to-b text-gray-100 animate-fade-in">
    <Navbar pageName="About" />
    <Particles className="fixed h-screen inset-0 -z-10" quantity={200} />
    
    <main className="max-w-screen-lg mx-auto p-6 pt-20 md:pt-80">
        <div className="flex flex-col items-center mb-40">
            <h1 className="text-4xl font-bold text-white">
                About Me
            </h1>
        
        <div className="w-16 h-1 bg-blue-500 my-4"></div>
        
            <p className="text-lg text-gray-300 max-w-2xl text-center leading-relaxed">
                I started coding by messing around with scripts in games. Eventually, I got more into it and started making my own stuff.
                Now I work on my own project,{" "}
                <a 
                href="https://www.headshotinteractive.com/abandoned" 
                className="text-blue-400 hover:text-blue-300 underline transition duration-300"
                target="_blank"
                rel="noopener noreferrer"
                >
                Abandoned
                </a>
                , while doing freelance coding jobs on the side.
            </p>
        </div>
        
        <section className="mb-12">
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white">
                Skills
                </h2>
                <div className="w-12 h-1 bg-blue-500 my-4 mx-auto"></div>
            </div>
        
            <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
                {techStack.map((category) => (
                <div key={category.category} className="bg-blue-300 bg-opacity-5 rounded-md p-5">
                    <h3 className="text-xl font-medium text-blue-400 mb-4">{category.category}</h3>
                    
                    <div className="space-y-3">
                    {category.items.map((tech) => (
                        <div key={tech.name} className="flex items-center">
                        <div className="w-8 h-8 relative mr-3 flex-shrink-0">
                            <Image 
                            src={tech.src} 
                            alt={tech.name} 
                            fill
                            className="object-contain filter grayscale" 
                            />
                        </div>
                        
                        <div className="flex-grow">
                            <div className="flex justify-between items-center mb-1">
                            <span className="text-sm text-gray-300">{tech.name}</span>
                            <span className="text-xs text-gray-400">
                                {tech.level ? `${tech.level}/5` : ''}
                            </span>
                            </div>
                            
                            {tech.level && (
                                <ProgressBar level={tech.level} />
                            )}
                        </div>
                        </div>
                    ))}
                    </div>
                </div>
                ))}
            </div>
        </section>
    </main>
    </div>
);
}