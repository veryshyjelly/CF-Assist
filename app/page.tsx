'use client'

import HomePage from './home'
import { useRef, useState } from 'react'
import { Inconsolata } from 'next/font/google'
import Starter from './starter'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { ModalsProvider } from '@mantine/modals'

const inconso = Inconsolata({ subsets: ['latin'] })

export default function Home() {
  const [started, setStarted] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [rating, setRating] = useState<[number, number]>([1000, 2000]);
  const [sorting, setSorting] = useState('');

  // const router = useRouter();

  return (
    <MantineProvider>
      <ModalsProvider>
        <Notifications limit={5} w={'auto'} />
        <main className={inconso.className}>
          {started && <HomePage rating={rating} tags={tags} />}
          {!started && <Starter start={setStarted} tags={tags} rating={rating}
            setTags={setTags} setRating={setRating}
            sorting={sorting} setSorting={setSorting} />}
        </main>
      </ModalsProvider>
    </MantineProvider>
  )
}
