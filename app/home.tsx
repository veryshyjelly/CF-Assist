import { Textarea, SegmentedControl, Switch } from "@mantine/core";
import { useEffect, useState } from "react";
import { get_problem, next_problem, prev_problem } from "./functions";
import { notifications } from "@mantine/notifications";
import { IconX } from "@tabler/icons-react";

const Home = (props: { tags: string[], rating: [number, number] }) => {
    const { tags, rating } = props;
    const [showResult, setShowResult] = useState('testcase');
    const [createFile, setCreateFile] = useState(false);
    const [hideSolved, setHideSolved] = useState(false);
    const [problem, setProblem] = useState<unknown>({
        name: "Question name here",
    });

    const home_get_problem = () => {
        get_problem().then(r => {
            setProblem(r)
            console.log(r);
        }).catch(err => {
            notifications.show({
                id: "problem_not_get",
                message: "Couldn't get problem",
                icon: <IconX size="1.1rem" />,
                color: "red"
            })
        });
    }

    useEffect(home_get_problem, [tags, rating]);


    return (
        <div>
            <div className='mt-7 ml-12 font-semibold text-4xl tracking-widest flex whitespace-nowrap'>
                <div className="w-96 overflow-hidden h-12">
                    {problem.name}
                </div>
                <SegmentedControl value={showResult} onChange={setShowResult} ml={80} data={[
                    { label: "Testcase", value: "testcase" },
                    { label: "Result", value: "result" }
                ]} className="bg-white/50" />
                <div className="relative flex flex-col left-16">
                    <Switch label="create file" checked={createFile} onChange={(e) => setCreateFile(e.currentTarget.checked)}
                        my={'auto'} offLabel="OFF" onLabel="ON " />
                    <Switch label="hide solved" checked={hideSolved} onChange={(e) => setHideSolved(e.currentTarget.checked)}
                        my={'auto'} offLabel="OFF" onLabel="ON " />
                </div>
            </div>


            <div className="h-[32.125rem] overflow-hidden">


                <div className="mt-14 h-[31rem] flex flex-row overflow-hidden">
                    <div className="px-24 py-20">
                        <SegmentedControl ml={200} data={[
                            { label: "Case 1", value: "case1" },
                            { label: "Case 2", value: "case2" }
                        ]} className="bg-white/50 mx-auto" size="md" orientation="vertical" />

                    </div>
                    {showResult === 'result' && <>
                        <div className="mt-12 h-[20rem] w-[18rem] font-[500] text-3xl bg-[#00b2ca] relative text-center">
                            Answer
                            <Textarea className={`h-[18rem] w-[18rem] px-2 top-8 bg-[#ddccba] absolute`}
                                variant="unstyled" maxRows={12} autosize />
                            <div className={`h-[20rem] w-[18rem] top-[15.5rem] left-[18rem] bg-[#00b2ca] 
                                    drop-shadow-xl absolute skew-y-[60deg]`}></div>
                            <div className={`h-[18rem] w-[18rem] top-[20rem] left-[15.5rem] bg-[#7dcfb6] 
                                    drop-shadow-xl absolute skew-x-[60deg]`}></div>
                        </div>

                        <div className={`ml-20 h-[20rem] w-[18rem] font-[500] text-3xl bg-[#0077ca] relative text-center`}>
                            Output
                            <Textarea className={`h-[18rem] w-[18rem] px-2 top-8 bg-[#ddccba] absolute`}
                                variant="unstyled" maxRows={12} autosize />
                            <div className={`h-[20rem] w-[18rem] top-[9rem] left-[18rem] bg-[#0077ca] 
                                    drop-shadow-xl absolute skew-y-[45deg]`}></div>
                            <div className={`h-[18rem] w-[18rem] top-[20rem] left-[9rem] bg-[#8ccf7d] 
                                    drop-shadow-xl absolute skew-x-[45deg]`}></div>
                        </div>
                    </>}
                    {showResult === 'testcase' && <>
                        <div className="ml-16 mt-5 h-[20rem] w-[18rem] font-[500] text-3xl bg-[#00b2ca] relative text-center">
                            Input
                            <Textarea className={`h-[18rem] w-[18rem] px-2 top-8 bg-[#ddccba] absolute`}
                                variant="unstyled" maxRows={12} autosize />
                            <div className={`h-[20rem] w-[18rem] top-[10.7rem] left-[18rem] bg-[#00b2ca] 
                                drop-shadow-xl absolute skew-y-[50deg]`}></div>
                            <div className={`h-[18rem] w-[18rem] top-[20rem] left-[7.6rem] bg-[#7dcfb6] 
                                drop-shadow-xl absolute skew-x-[40deg]`}></div>
                        </div>
                    </>}
                </div>

                <div className="text-2xl font-medium justify-around flex flex-row -top-[6.5rem] relative">
                    <div className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer select-none 
                        hover:shadow hover:bg-white/60 active:bg-white/70">
                        Test
                    </div>
                    <div onClick={async () => { await prev_problem(); home_get_problem() }}
                        className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer select-none 
                        hover:shadow hover:bg-white/60 active:bg-white/70">
                        Prev
                    </div>
                    <div onClick={async () => { await next_problem(); home_get_problem() }}
                        className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer select-none 
                        hover:shadow hover:bg-white/60 active:bg-white/70">
                        Next
                    </div>
                    <div className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer select-none 
                        hover:shadow hover:bg-white/60 active:bg-white/70">
                        Done
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;