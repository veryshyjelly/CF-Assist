import { Textarea, SegmentedControl, Switch } from "@mantine/core";
import { useState } from "react";

const Home = () => {
    const [showResult, setShowResult] = useState('testcase');

    return (
        <div>
            <div className='mt-7 ml-24 font-semibold text-4xl tracking-widest flex'>
                Three Sum
                <SegmentedControl value={showResult} onChange={setShowResult} ml={200} data={[
                    { label: "Testcase", value: "testcase" },
                    { label: "Result", value: "result" }
                ]} className="bg-white/50" />
                <Switch label="create file" mx={'auto'} my={'auto'} />
                <Switch label="hide solved" mx={'auto'} my={'auto'} />
            </div>


            <div className="h-[32.125rem] overflow-hidden">


                <div className="mt-14 h-[31rem] flex flex-row overflow-hidden">
                    <div className="px-24 py-20">
                        <SegmentedControl ml={200} data={[
                            { label: "Case 1", value: "case1" },
                            { label: "Case 2", value: "case2" }
                        ]} className="bg-white/50 mx-auto" size="md" orientation="vertical" />

                    </div>
                    {showResult === 'result' &&
                        <>
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
                    <div className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer select-none 
                        hover:shadow hover:bg-white/60 active:bg-white/70">
                        Prev
                    </div>
                    <div className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer select-none 
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