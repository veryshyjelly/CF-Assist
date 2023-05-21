import { Modal, Chip, Group, RangeSlider, Image, Select } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { open } from '@tauri-apps/api/dialog';
import { set_directory, fetch_solved, get_problemset, set_rating, sort_problems } from './functions'

function Starter(props: {
    start: Function,
    rating: [number, number], setRating: (value: [number, number]) => void,
    tags: string[], setTags: (value: string[]) => void,
    sorting: string, setSorting: (value: string) => void
}) {
    const { rating, setRating, tags, setTags, sorting, setSorting } = props;
    const [openedTags, { open: openTags, close: closeTags }] = useDisclosure(false);
    const [openedSort, { open: openSort, close: closeSort }] = useDisclosure(false);
    const [directory, setDirectory] = useState('');

    const chooseFolder = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            defaultPath: "C:/"
        });
        console.log(selected);
        if (!(Array.isArray(selected) || selected === null)) {
            setDirectory(selected);
        }
    }

    const clickHandler = async () => {
        let to_continue = true;
        if (to_continue) to_continue = await set_directory(directory); else return;
        if (to_continue) to_continue = await fetch_solved(); else return;
        if (to_continue) to_continue = await get_problemset(); else return;
        if (to_continue) to_continue = await set_rating(rating, tags); else return;
        if (to_continue && sorting !== '') to_continue = await sort_problems(sorting);
        props.start(true);
    }

    return (
        <div>
            <div className='absolute'>
                <img src="tauri.svg" alt="" className='relative top-52 left-[48rem] w-52 z-20'
                    style={{ filter: 'brightness(90%)' }} />
            </div>

            <Modal padding={0} radius={'lg'} opened={openedTags} onClose={closeTags} centered withCloseButton={false}>
                <Tags tags={tags} setTags={setTags} />
            </Modal>
            <Modal padding={0} radius={'lg'} opened={openedSort} onClose={closeSort} centered withCloseButton={false}>
                {/* <Tags tags={tags} setTags={setTags} /> */}
                <Sorts setSorting={setSorting} sorting={sorting} />
            </Modal>

            <div className='text-4xl font-bold mt-10 text-center'>
                CF Assist
            </div>

            <div className='mt-24 px-32 text-center flex justify-around'>
                <div className='w-96 text-2xl font-semibold bg-white/50 px-8 py-5 rounded-xl'>
                    Difficulty
                    <RangeSlider
                        defaultValue={[1000, 2200]} value={rating} onChange={setRating}
                        min={800} max={3500} step={100} my={35} labelAlwaysOn
                        marks={[{ value: 800, label: '800' }, { value: 1200, label: '1200' }, { value: 1600, label: '1600' },
                        { value: 2000, label: '2000' }, { value: 2400, label: '2400' }, { value: 2800, label: '2800' }, { value: 3200, label: '3200' },]}
                    />
                </div>

                <div className='flex flex-col justify-between py-3'>
                    <div onClick={openTags} className="text-2xl font-medium px-12 py-2 bg-orange-600/60 
                        rounded-xl cursor-pointer select-none 
                        hover:shadow hover:bg-orange-600/70 active:bg-orange-600/80">
                        Tags
                    </div>
                    <div onClick={openSort} className="text-2xl font-medium px-12 py-2 bg-purple-700/60 
                        rounded-xl cursor-pointer select-none 
                        hover:shadow hover:bg-purple-700/70 active:bg-purple-600/80">
                        Sort
                    </div>
                </div>
            </div>

            <div className='mt-24 text-cente mx-auto flex justify-around px-32'>
                <div
                    className='bg-white/60 px-5 my-1
                            font-semibold rounded-full flex flex-col justify-center cursor-pointer hover:bg-white/70 active:bg-white/75'
                    onClick={chooseFolder}>
                    {directory !== "" ? directory : "Choose folder"}
                </div>
                <div onClick={clickHandler}
                    className="text-2xl font-medium px-12 py-2 bg-green-700/60 rounded-3xl cursor-pointer select-none 
                        hover:shadow hover:bg-green-700/70 active:bg-green-600/80">
                    Start
                </div>
            </div>

        </div>
    )
}

const Tags = (props: { tags: string[], setTags: (value: string[]) => void }) => {
    const tags = ['binary search', 'bitmasks', 'brute force', 'combinatorics',
        'data structures', 'dfs and similar', 'strings', 'trees', 'two pointers', 'ternary search', 'sortings',
        'shortest paths', 'greedy', 'dp', 'divide and conquer', 'chinese remainder theorem', 'graphs']

    return (
        <div className='p-5'>
            <Chip.Group multiple value={props.tags} onChange={props.setTags}>
                <Group>
                    {tags.map(v => <Chip key={v} variant='light' value={v}>{v}</Chip>)}
                </Group>
            </Chip.Group>
        </div>
    )
}

const Sorts = (props: { sorting: string, setSorting: (value: string) => void }) => {
    const sort_by = ['DSC_BY_SOLVED', 'ASC_BY_SOLVED', 'DSC_BY_RATING', 'ASC_BY_RATING']

    return (
        <div className='py-10 px-16'>
            <Chip.Group value={props.sorting} onChange={props.setSorting}>
                <Group>
                    {sort_by.map(v => <Chip key={v} variant='light' color='grape' value={v}>{v}</Chip>)}
                </Group>
            </Chip.Group>
        </div>
    )
}


export default Starter;