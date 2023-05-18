'use client'

import Image from 'next/image'
import HomePage from './home'
import { useRef, useState } from 'react'
import { open, save } from "@tauri-apps/api/dialog"
import { Inconsolata } from 'next/font/google'

const inconso = Inconsolata({ subsets: ['latin'] })

export default function Home() {
  const [started, setStarted] = useState(false);
  return (
    <main className={inconso.className}>
      {started && <HomePage />}
      {!started && <Starter setStarted={setStarted} />}
    </main>
  )
}

function Starter(props: { setStarted: Function }) {

  return (
    <>
      <div onClick={() => props.setStarted(true)}
        className='my-52 text-center cursor-pointer rounded-full py-6 w-32 mx-auto font-semibold bg-[#159895]'>
        Start
      </div>
    </>
  )

}