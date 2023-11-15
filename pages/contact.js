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
            <h1>Coming <span className='colorElem'>Soon</span> ...</h1>
            <p>To a site near you.</p>
          </header>
        </div>
      </div>
    </>
  );
}

