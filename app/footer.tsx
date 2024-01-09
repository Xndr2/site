import { url } from 'inspector'
import type { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="w-max bg-blue-600 ">
            <div className="text-black">
                <Link target="_blank" href="https://discord.com">
                    <Image
                        src="/icons/discord.svg"
                        width={20}
                        height={20}
                        className="h-10 invert-0 dark:invert inline"
                        alt="test"
                    />
                </Link>

                <Link target="_blank" href="https://github.com/Xndr2">
                    <Image
                        src="/icons/github.svg"
                        width={20}
                        height={20}
                        className="h-10 mx-6 invert-0 dark:invert inline"
                        alt="test"
                    />
                </Link>

                <Link target="_blank" href="https://x.com/@Xndr___">
                    <Image
                        src="/icons/x-twitter.svg"
                        width={20}
                        height={20}
                        className="h-10 invert-0 dark:invert inline"
                        alt="test"
                    />
                </Link>
            </div>
        </footer>
    )
}
