import { css } from '@emotion/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Welcome to FoodShare</title>
        <meta name="description" content="Welcome to FoodShare" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>
        Welcome to <div>FoodShare!</div>
      </h1>

      <Image src="/placeholder.jpg" width="400" height="400" alt="" />
      <br />
      <button>
        <Link href="/register">Register</Link>
      </button>
      <button>
        <Link href="/SignIn">Sign in</Link>
      </button>
    </div>
  );
}
