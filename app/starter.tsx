import { Modal, Chip, Group, RangeSlider, Image } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useState } from 'react'
import { invoke } from '@tauri-apps/api/tauri'
import { notifications } from '@mantine/notifications'
import { IconCheck, IconX } from "@tabler/icons-react"
import { open } from '@tauri-apps/api/dialog';

function Starter(props: { start: Function }) {
    const [opened, { open: openTags, close: closeTags }] = useDisclosure(false);
    const [tags, setTags] = useState<string[]>([]);
    const [rating, setRating] = useState<[number, number]>([1000, 2000]);
    const [directory, setDirectory] = useState('');

    const chooseFolder = async () => {
        const selected = await open({
            directory: true,
            multiple: false,
            defaultPath: "C:/"
        });
        console.log(selected);
        if (Array.isArray(selected) || selected === null) {
        } else {
            setDirectory(selected);
        }
    }

    const clickHandler = async () => {
        try {
            let res = await invoke('set_directory', { directory: directory })
            console.log(res)
            notifications.show({
                id: "directory_set",
                message: "Directory set successfull",
                icon: <IconCheck size="1.1rem" />
            })
        } catch (err) {
            console.log(`error`, err);
            notifications.show({
                id: "directory_not_set",
                title: "Directory not found",
                message: "The specified directory was not found",
                icon: <IconX size="1.1rem" />,
                color: "red"
            })
            return;
        }
        try {
            let res = await invoke('get_problemset');
            console.log(res);
            notifications.show({
                id: "problems_got",
                message: "Problems fetched successfully",
                icon: <IconCheck size="1.1rem" />
            });
        } catch (err) {
            console.log(`error`, err);
            notifications.show({
                id: "problems_not_got",
                title: "Directory not found",
                message: "The specified directory was not found on your machine.",
                icon: <IconX size="1.1rem" />,
                color: "red"
            });
            return;
        }

        try {
            await invoke('set_rating', { min: rating[0], max: rating[1] })
            await invoke('set_tags', { tags: tags })
            notifications.show({
                id: "ratings_set",
                message: "Filters set successfull",
                icon: <IconCheck size="1.1rem" />
            });
        } catch (err) {
            console.log('error while setting filter');
            return;
        }
        props.start(true);
    }

    return (
        <div>
            <div className='absolute'>
                {/* <img src="rust.svg" alt="" className='relative top-10 left-10 w-64 -rotate-12 z-20'
                    style={{ filter: 'invert(15%) sepia(44%) saturate(7500%) hue-rotate(18deg) brightness(106%) contrast(98%)' }} />
                <img src="next.svg" alt="" className='relative top-52 left-10 w-64 -rotate-12 z-20' /> */}
                <img src="tauri.svg" alt="" className='relative top-52 left-[48rem] w-52 z-20'
                    style={{ filter: 'brightness(90%)' }} />
            </div>
            <Modal padding={0} radius={'lg'} opened={opened} onClose={closeTags} centered withCloseButton={false}>
                <Tags tags={tags} setTags={setTags} />
            </Modal>
            <div className='mt-16 text-center' style={{ zIndex: 100 }}>
                <div className='text-4xl font-bold'>
                    CF Assist
                </div>
                <div className='my-10 flex justify-around'>
                    <div onClick={openTags} className="text-2xl font-medium px-12 py-2 bg-white/50 rounded-lg 
            cursor-pointer select-none hover:shadow hover:bg-white/60 active:bg-white/70">
                        Tags
                    </div>
                </div>

                <div className='w-96 mx-auto text-2xl font-semibold bg-white/50 px-8 py-5 rounded-xl'>
                    Difficulty
                    <RangeSlider
                        defaultValue={[1000, 2200]} value={rating} onChange={setRating}
                        min={800} max={3500} step={100} my={35} labelAlwaysOn
                        marks={[{ value: 800, label: '800' }, { value: 1200, label: '1200' }, { value: 1600, label: '1600' },
                        { value: 2000, label: '2000' }, { value: 2400, label: '2400' }, { value: 2800, label: '2800' }, { value: 3200, label: '3200' },]}
                    />
                </div>

                <div className='w-96 mx-auto mt-10 flex'>
                    <div
                        className='bg-white/60 mx-auto px-5 py-1 
                            font-semibold rounded-full cursor-pointer hover:bg-white/70 active:bg-white/75'
                        onClick={chooseFolder}>

                        {directory !== "" ? directory : "Choose folder"}

                    </div>
                </div>
            </div>

            <div className='mt-10 w-48 text-center mx-auto'>
                <div onClick={clickHandler}
                    className="text-2xl font-medium px-12 py-2 bg-green-600/50 rounded-3xl cursor-pointer select-none 
                        hover:shadow hover:bg-green-600/60 active:bg-green-600/70">
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
                    {tags.map(v => <Chip variant='light' value={v}>{v}</Chip>)}
                </Group>
            </Chip.Group>
        </div>
    )
}

export default Starter;