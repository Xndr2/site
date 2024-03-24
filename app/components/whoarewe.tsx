import Image from 'next/image';
import React from 'react';
import Link from 'next/link';


interface CarouselProps {
    slides: Array<{
        src: string;
        name: string;
        description?: string;
    }>;
}

export default function Whoarewe(props: CarouselProps) {
    const { slides } = props;
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-max m-auto mt-4">
            {slides.map((s) => (
                <div className="flex items-center border-2 rounded-lg" key="">
                    <Image
                        src={s.src}
                        width={128}
                        height={128}
                        className="h-10 w-10 md:h-12 md:w-12 !rounded-full object-cover m-2"
                        alt="unknown"
                    />
                    <div className="font-medium dark:text-white ml-2 mr-4">
                        <div>{s.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{s.description}</div>
                    </div>
                </div>
            ))}
            {/* button to join */}
            <Link target='_blank' href="https://discord.gg/CAhVGsAW7H" className="flex items-center border-2 rounded-lg">
                <Image
                    src="/icons/discord.svg"
                    width={64}
                    height={64}
                    className="h-8 w-10 md:h-10 md:w-12 !rounded-full object-cover m-2 invert"
                    alt="unknown"
                />
                <div className="font-medium dark:text-white ml-2 mr-4">
                    <div>Add your name</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Join out discord if you want to help</div>
                </div>
            </Link>
        </div >
    );
}