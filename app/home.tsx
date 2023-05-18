const Home = () => {
    return (
        <div>
            <div className='mt-8 ml-20 font-semibold text-4xl tracking-widest'>
                Three Sum
            </div>

            <div className="h-[33rem] overflow-hidden">


                <div className="mt-10 ml-52 h-[31rem] flex flex-row overflow-hidden">
                    <div className="mt-16 h-[20rem] w-[18rem] font-[500] text-2xl bg-[#00b2ca] relative text-center">
                        Answer
                        <div className={`h-[18rem] w-[18rem] top-8 bg-[#ddccba] absolute`}></div>
                        <div className={`h-[20rem] w-[18rem] top-[9rem] left-[18rem] bg-[#00b2ca] absolute skew-y-[45deg]`}></div>
                        <div className={`h-[18rem] w-[18rem] top-[20rem] left-[9rem] bg-[#7dcfb6] absolute skew-x-[45deg]`}></div>
                    </div>

                    <div className={`ml-28 h-[20rem] w-[18rem] font-[500] text-2xl bg-[#0077ca] relative text-center`}>
                        Output
                        <div className={`h-[18rem] w-[18rem] top-8 bg-[#ddccba] absolute`}></div>
                        <div className={`h-[20rem] w-[18rem] top-[9rem] left-[18rem] bg-[#0077ca] absolute skew-y-[45deg]`}></div>
                        <div className={`h-[18rem] w-[18rem] top-[20rem] left-[9rem] bg-[#8ccf7d] absolute skew-x-[45deg]`}></div>
                    </div>
                </div>

                <div className="text-2xl font-medium justify-around flex flex-row -top-[5rem] relative">
                    <div className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer hover:bg-white/60 active:bg-white/70">
                        Test
                    </div>
                    <div className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer hover:bg-white/60 active:bg-white/70">
                        Prev
                    </div>
                    <div className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer hover:bg-white/60 active:bg-white/70">
                        Next
                    </div>
                    <div className="px-12 py-2 bg-white/50 rounded-lg cursor-pointer hover:bg-white/60 active:bg-white/70">
                        Done
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;