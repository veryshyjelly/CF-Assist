'use client'

import HomePage from './home'
import { useRef, useState } from 'react'
import { Inconsolata } from 'next/font/google'
import Starter from './starter'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'

const inconso = Inconsolata({ subsets: ['latin'] })

export default function Home() {
  const [started, setStarted] = useState(false);
  // const router = useRouter();

  return (
    <MantineProvider>
      <Notifications limit={5} />
      <main className={inconso.className}>
        {started && <HomePage />}
        {!started && <Starter start={setStarted} />}
      </main>
    </MantineProvider>
  )
}
