import { url } from 'inspector'
import type { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Navbar from '../navbar'
import Footer from '../footer'
import Link from 'next/link'
import Particles from "../components/particles";

export const metadata: Metadata = {
    title: 'Xndr | Abandoned',
    description: 'Abandoned Project page for Xndr',
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
            <main className=" max-w-screen-lg mx-auto animate-title">
                {/* Info */}
                <div className="mt-8 mx-4">
                    <h1 className="text-2xl font-bold underline">What is Abandoned?</h1>
                    <p className="mt-2">
                        Abandoned is a Sci-Fi Tactical Shooter game being developed in Unreal Engine (UE5).
                        <br /><br />
                        Made by a small team, we stand to deliver a unique and unforgettable gaming experience that defies the constraints often associated with smaller development teams.
                        The passion and dedication of the developers makes this game a remarkable showcase of that can be achieved by a small group of people.
                    </p>
                </div>

                {/* about us */}
                <div className="mt-16 mx-4">
                    <h1 className="text-2xl font-bold underline">Who are we?</h1>
                    <div className="inline-block w-96 rounded-xl">
                        <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                            <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">
                                    <Image
                                        src="/abandoned_pfp/xndr.webp"
                                        width={128}
                                        height={128}
                                        className="relative inline-block h-10 w-10 md:h-12 md:w-12 !rounded-full  object-cover object-center"
                                        alt="unknown"
                                    />
                                </div>
                                <div>
                                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                        Xndr
                                    </h6>
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal">
                                        Project Leader | Senior Developer
                                    </p>
                                </div>
                            </div>

                            <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">
                                    <Image
                                        src="/abandoned_pfp/gadubadish.webp"
                                        width={128}
                                        height={128}
                                        className="relative inline-block h-10 w-10 md:h-12 md:w-12 !rounded-full  object-cover object-center"
                                        alt="unknown"
                                    />
                                </div>
                                <div>
                                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                        Gadubadish
                                    </h6>
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal">
                                        3D Modeler | Senior Developer
                                    </p>
                                </div>
                            </div>

                            <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">
                                    <Image
                                        src="/abandoned_pfp/theusi.webp"
                                        width={128}
                                        height={128}
                                        className="relative inline-block h-10 w-10 md:h-12 md:w-12 !rounded-full  object-cover object-center"
                                        alt="unknown"
                                    />
                                </div>
                                <div>
                                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                        TheUsi
                                    </h6>
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal">
                                        3D Modeler
                                    </p>
                                </div>
                            </div>

                            <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">
                                    <Image
                                        src="/abandoned_pfp/discountcheese.webp"
                                        width={128}
                                        height={128}
                                        className="relative inline-block h-10 w-10 md:h-12 md:w-12 !rounded-full  object-cover object-center"
                                        alt="unknown"
                                    />
                                </div>
                                <div>
                                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                        Discount_Cheese
                                    </h6>
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal">
                                        Story Writer
                                    </p>
                                </div>
                            </div>
                        </nav>
                    </div>

                    <div className="inline-block w-96 rounded-xl">
                        <nav className="flex min-w-[240px] flex-col gap-1 p-2 font-sans text-base font-normal text-blue-gray-700">
                            <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">
                                    <Image
                                        src="/abandoned_pfp/charlesfrost.webp"
                                        width={128}
                                        height={128}
                                        className="relative inline-block h-10 w-10 md:h-12 md:w-12 !rounded-full  object-cover object-center"
                                        alt="unknown"
                                    />
                                </div>
                                <div>
                                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                        CharlesFrost
                                    </h6>
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal">
                                        Story Writer | Senior Moderator
                                    </p>
                                </div>
                            </div>

                            <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">
                                    <Image
                                        src="/abandoned_pfp/grug.webp"
                                        width={128}
                                        height={128}
                                        className="relative inline-block h-10 w-10 md:h-12 md:w-12 !rounded-full  object-cover object-center"
                                        alt="unknown"
                                    />
                                </div>
                                <div>
                                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                        Grug
                                    </h6>
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal">
                                        Moderator | gruger
                                    </p>
                                </div>
                            </div>

                            <div role="button" className="flex items-center w-full p-3 leading-tight transition-all rounded-lg outline-none text-start hover:bg-blue-gray-50 hover:bg-opacity-80 hover:text-blue-gray-900 focus:bg-blue-gray-50 focus:bg-opacity-80 focus:text-blue-gray-900 active:bg-blue-gray-50 active:bg-opacity-80 active:text-blue-gray-900">
                                <div className="grid mr-4 place-items-center">
                                    <Image
                                        src="/abandoned_pfp/milton.webp"
                                        width={128}
                                        height={128}
                                        className="relative inline-block h-10 w-10 md:h-12 md:w-12 !rounded-full  object-cover object-center"
                                        alt="unknown"
                                    />
                                </div>
                                <div>
                                    <h6 className="block font-sans text-base antialiased font-semibold leading-relaxed tracking-normal text-blue-gray-900">
                                        Milton
                                    </h6>
                                    <p className="block font-sans text-sm antialiased font-normal leading-normal">
                                        Story Writer
                                    </p>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>

                {/* More info? */}
                <div className="my-16 mx-4">
                    <h1 className="text-2xl font-bold underline">Come join us!</h1>
                    <p className="mt-2 leading-5">
                        Find us on <Link target='_blank' href="https://discord.gg/CAhVGsAW7H" className="underline duration-500 hover:text-zinc-300">Discord</Link>.
                        <br />
                        Or check out our <Link target='_blank' href="https://youtube.com/@abandoned_game" className="underline duration-500 hover:text-zinc-300">Youtube</Link> channel.
                        <br />
                        Contact us via <Link target='_blank' href="mailto:abandoned@onmail.com" className="underline duration-500 hover:text-zinc-300">Email</Link>.
                    </p>
                </div>
            </main>
        </>
    )
}