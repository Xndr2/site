import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout.js';

export default function About() {
  return (
    <>
      <Head>
        <title>Xndr | About</title>
        <link rel="icon" href='/favicon/favicon.ico'/>
      </Head>
      <div className='center_container'>
        <div className='center_item'>
          <header>
            <h1>Things about me:</h1>
            <p>I'm an <span className='colorElem'>18 year</span> old developer from Belgium.
             I create well designed, <span className='colorElem'>production ready</span> apps for personal or commercial use.
            <br/><br/>Programming is one of my favorite things to do as it gives me the freedom to make anything I can think of.</p>

            <h1>Why work with me:</h1>
            <p>✓ Good communication skills</p>
            <p>✓ Result driven</p>
            <p>✓ Deadline conscious</p>
          </header>
        </div>
      </div>
    </>
  );
}

