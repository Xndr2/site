import Head from "next/head"
import Link from "next/link"
import Image from "next/image"
import Script from "next/script"

export default function Navbar() {
  return (
    <>
      <Head>
        <script src="https://kit.fontawesome.com/304ae3bd01.js" crossorigin="anonymous"></script>
      </Head>
      <nav className="navbar_container">
        <p className="warning">! This Page is NOT made for mobile devices !<br/>I am aware and working on it.</p>
        {/* image */}
        <a href="/">
          <Image
          className="navbar_profile"
          src="/favicon/android-chrome-192x192.png"
          height={144}
          width={144}
          alt="Logo Xander"
          />
        </a>
        {/* items */}
        <div className="navbar_item_container">
          <Link className="navbar_button" href="/">Home</Link>
          <Link className="navbar_button" href="/about">About</Link>
          <Link className="navbar_button" href="/projects">Projects</Link>
          <Link className="navbar_button" href="/contact">Contact</Link>

          {/* footer links */}
          <div className="navbar_footer">
            <a className="navbar_footer_link" href="https://github.com/Xndr2"><i class="fa-brands fa-github"></i></a>
            <a className="navbar_footer_link" href="mailto:moermanxander@gmail.com"><i class="fa-solid fa-envelope"></i></a>
            <a className="navbar_footer_link" href="https://discordapp.com/users/434760513377927188"><i class="fa-brands fa-discord"></i></a>
            <p>&copy; Xndr | All Rights Reserved</p>
          </div>
        </div>
      </nav>
    </>
  )
}