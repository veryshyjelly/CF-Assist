'use client'

import Image from 'next/image'
import HomePage from './home'
import { useRef, useState } from 'react'
import { open, save } from "@tauri-apps/api/dialog"
import { Inconsolata } from 'next/font/google'
import { Modal, Chip, Group, RangeSlider, Input } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

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
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <div>
      <Modal padding={0} radius={'lg'} opened={opened} onClose={close} centered withCloseButton={false}>
        <Tags />
      </Modal>
      <div className='mt-20 text-center'>
        <div className='text-3xl font-semibold'>
          CF Assist
        </div>
        <div className='my-10 flex justify-around'>
          <div onClick={open}
            className="text-2xl font-medium px-12 py-2 bg-white/40 rounded-lg cursor-pointer select-none 
                        hover:shadow hover:bg-white/50 active:bg-white/70">
            Tags
          </div>

        </div>

        <div className='w-96 mx-auto text-2xl font-semibold bg-white/30 px-8 py-5 rounded-xl'>
          Difficulty
          <RangeSlider
            defaultValue={[1000, 2200]}
            min={800}
            max={3500}
            step={100}
            my={35}
            marks={[{ value: 800, label: '800' }, { value: 1200, label: '1200' }, { value: 1600, label: '1600' },
            { value: 2000, label: '2000' }, { value: 2400, label: '2400' }, { value: 2800, label: '2800' }, { value: 3200, label: '3200' },]}
            labelAlwaysOn
          />
        </div>

        <div className='w-96 mx-auto mt-10'>
          <Input variant='filled' placeholder='Project Directory' />
        </div>
      </div>

      <div className='mt-10 w-48 text-center mx-auto'>
        <div onClick={() => props.setStarted(true)}
          className="text-2xl font-medium px-12 py-2 bg-green-600/40 rounded-lg cursor-pointer select-none 
                        hover:shadow hover:bg-green-600/50 active:bg-green-600/70">
          Start
        </div>
      </div>

    </div>
  )
}

const Tags = () => {
  const tags = ['binary search', 'bitmasks', 'brute force', 'combinatorics',
    'data structures', 'dfs and similar', 'strings', 'trees', 'two pointers', 'ternary search', 'sortings',
    'shortest paths', 'greedy', 'dp', 'divide and conquer', 'chinese remainder theorem', 'graphs']
  return (
    <div className='p-5'>
      <Chip.Group multiple>
        {/* <div className='flex'> */}
        <Group>

          {tags.map(v => <Chip variant='light' value={v}>{v}</Chip>)}
        </Group>
        {/* </div> */}
      </Chip.Group>
    </div>
  )
}