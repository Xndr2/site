import Head from 'next/head';
import Link from 'next/link';
import Layout from '../components/layout.js';

export default function Index() {
  return (
    <>
      <Head>
        <title>Xndr | Home</title>
        <link rel="icon" href='/favicon/favicon.ico'/>
      </Head>
      <div className='center_container'>
        <div className='center_item'>
          <header>
            <h1>Hi, I'm Xander | Xndr.</h1>
            <p>A self taught developer from Belgium. I create applications or systems for people online.</p>
          </header>
        </div>
      </div>
    </>
  );
}

