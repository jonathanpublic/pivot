"use client"
import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(true)

  return (
    <>
      <h1>App Page</h1>
      <Link href="/signup">
        <div>Go to Auth Page</div>
      </Link>
      <Link href="/main">
        <div>Go to main page</div>
      </Link>
      </>
  );
}
