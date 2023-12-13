import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

const imageLoader = ({ src, width }) => {
  return `https://picsum.photos/${width}/${width}?t=${src}`
}

export default function Projects() {
  return (
    <>
      <Head>
        <title>Xndr | Projects</title>
        <link rel="icon" href='/favicon/favicon.ico'/>
      </Head>
      <div className='center_container'>
        <div className="pic-ctn">
          {/* Project 1 */}
          <div className="pic_project">
            <Image src="/images/projects/Abandoned_Banner.jpg" alt="Abandoned Logo" className='project_img' height={500} width={1200} />
            <h1>Abandoned</h1>
            <p>A Sci-Fi Tactical Shooter.</p>
          </div>
          
          {/* Project 2 */}
          <div className="pic_project">
            <Image src="/images/projects/DiscordBot.png" alt="Discord Bot" className='project_img' height={500} width={1200} />
            <h1>Discord Bot</h1>
            <p>Build with NodeJS and DiscordJS. Hosted 24/7 on <a href='daki.cc'>daki.cc</a>.</p>
          </div>

          {/* Project 3 */}
          <div className="pic_project">
            <Image src="/images/projects/FinalProject.jpg" alt="Final School Project" className='project_img' height={500} width={1200} />
            <h1>Final School Project</h1>
            <p>A system that opens and closes curtains on a daily shedule.<br/>Made using an ATmega324p, coded in C and C#.</p>
          </div>

          {/* Project 4 */}
          <div className="pic_project">
            <Image src="/images/projects/Abandoned_Launcher.png" alt="Abandoned Launcher" className='project_img' height={500} width={1200} />
            <h1>Game Launcher</h1>
            <p>This is the launcher Abandoned uses. It allows players to update their game files without having to redownload the game.<br/>Using the C# and the GithubAPI</p>
          </div>

          {/* Project 5 */}
          <div className="pic_project">
            <Image src="/images/projects/coding.png" alt="Secret" className='project_img' height={500} width={1200} />
            <h1>Secret Project</h1>
            <p>Something not a lot of people know about...</p>
          </div>
        </div>
      </div>
    </>
  );
}

