import { url } from 'inspector'
import type { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../navbar'
import Footer from '../footer'
import Link from 'next/link'
import Particles from "../components/particles";
import Whoarewe from '../components/whoarewe'

export const metadata: Metadata = {
    title: 'Xndr | Abandoned',
    description: 'Abandoned Project page for Xndr',
    icons: 'icons/XndrPFP.png',
}

export default function Home() {

    let slides = [
        { src: "/abandoned_pfp/xndr.webp", name: "Xndr", description: "Project Lead | Senior Developer" },
        { src: "/abandoned_pfp/charlesfrost.webp", name: "Charlesfrost", description: "Community Manager | Senior Moderator" },
        { src: "/abandoned_pfp/gadubadish.webp", name: "Gadubadish", description: "3D Modeler | Senior Developer" },
        { src: "/abandoned_pfp/grug.webp", name: "Grug", description: "Project Lead | Moderator" },
        { src: "/abandoned_pfp/theusi.webp", name: "TheUsi", description: "3D Modeler | Developer" },
        { src: "/abandoned_pfp/milton.webp", name: "Milton", description: "Story Writer | Trial Developer" },
        { src: "/abandoned_pfp/discountcheese.webp", name: "Discount_Cheese", description: "Story Writer | Trial Developer" },
    ];

    return (
        <>
            <Navbar
                pageName="Abandoned"
            />
            <Particles
                className="absolute inset-0 -z-10"
                quantity={200}
            />
            <main className=" max-w-screen-lg mx-auto animate-title">
                {/* Info */}
                <div className="mt-8 mx-4">
                    <h1 className="text-2xl font-bold underline">What is Abandoned?</h1>
                    <p className="mt-2 text-base">
                        Abandoned is a Sci-Fi Tactical PvE shooter set on an alien planet that serves as a trading hub for products,
                        spices and goods from all across the galaxy.
                        <br /><br />
                        You, <span className="italic">the player</span>, are on this planet and need to find a way back home. <br />
                        Explore the huge city, fight alien terrorists that want to take over the planet or work together with the military and destroy these terrorist once and for all.<br />
                        The game follows a basic story line, some of the decisions you make can lead to an entirely different ending.
                        <br /><br /><span className="font-semibold text-xl">&#8227; Explore</span><br />
                        Build on Unreal Engine 5, Abandoned allows for a planet on a 1:1 scale that is fully explore-able. Explore the city or go outside city walls, who knows what you might find out there.
                        <br /><br /><span className="font-semibold text-xl">&#8227; Fight</span><br />
                        The city&apos;s military in all out war with a group of terrorists that want to take over the city. Complete your basic training and join an AI squad on a mission.
                        Carefully plan out your next move, be stealthy, or go in guns-blazing.
                        <br />The choice is up to you.
                        <br /><br /><span className="font-semibold text-xl">&#8227; Escape</span><br />
                        At the end of the day, your main objective is still trying to get off this planet and going back to earth to report what happened to your crew... what actually happened to your crew?
                        Try to remember the event that went down before coming to this planet alone and leave once you remember everything you need. But is everything you need to know really everything there&apos;s to it?
                        <br />Can you really trust everyone you know?
                        <br />Maybe all this isn&apos;t what it looks like...
                    </p>
                </div>

                {/* about us */}
                <div className="mt-16 mx-4">
                    <h1 className="text-2xl font-bold underline">Who are we?</h1>
                    <p className="my-2 text-base">We are a Headshot Interactive, a small indie development studio. We stand to deliver a unique and unforgettable gaming experience that defies the constraints often associated with smaller development teams.
                        The passion and dedication of the developers makes this game a remarkable showcase of that can be achieved by a small group of people.
                    </p>
                    <Image
                        src="/abandoned/logo.png"
                        width={1440}
                        height={114}
                        className="m-4 mx-auto"
                        alt="unknown"
                    />

                    <Whoarewe slides={slides} />
                </div>

                {/* More info? */}
                <div className="my-16 mx-4">
                    <h1 className="text-2xl font-bold underline">Come join us!</h1>
                    <p className="mt-2 leading-5 text-base">
                        Find us on <Link target='_blank' href="https://discord.gg/CAhVGsAW7H" className="underline duration-500 hover:text-zinc-300">Discord</Link>.
                        <br />
                        Or check out our <Link target='_blank' href="https://youtube.com/@abandoned_game" className="underline duration-500 hover:text-zinc-300">Youtube</Link> channel.
                        <br />
                        Contact us via <Link target='_blank' href="mailto:abandoned@onmail.com" className="underline duration-500 hover:text-zinc-300">Email</Link>.
                    </p>
                </div>
            </main >
        </>
    )
}