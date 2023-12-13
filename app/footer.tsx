import { url } from 'inspector'
import type { Metadata } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="absolute bottom-0 w-full text-center pb-2">
        <div className="text-black">
            <Link target="_blank" href="https://discord.com">
                <Image
                    src="/icons/discord.svg"
                    width={20}
                    height={20}
                    className="h-10 inline invert-0 dark:invert"
                    alt="test"
                />
            </Link>
            
            <Link target="_blank" href="https://github.com/Xndr2">
                <Image
                    src="/icons/github.svg"
                    width={20}
                    height={20}
                    className="h-10 inline mx-4 invert-0 dark:invert"
                    alt="test"
                />
            </Link>

            <Link target="_blank" href="https://x.com/@Xndr___">
                <Image
                    src="/icons/x-twitter.svg"
                    width={20}
                    height={20}
                    className="h-10 inline invert-0 dark:invert"
                    alt="test"
                />
            </Link>
        </div>
        <h1>&copy; <Link target="_blank" href="https://xndr.site" className="underline">xndr.site</Link> | All Rights Reserved</h1>
    </footer>
  )
}
