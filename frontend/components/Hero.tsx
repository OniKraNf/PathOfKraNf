import React from 'react'
import { cn } from "@/utils/cn";
import { Spotlight } from './ui/Spotlight'

const Hero = () => {
    return (
        <div className='h-[40rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden'>
            <Spotlight
                className="-top-40 left-0 md:left-60 md:-top-20"
                fill="red"
            />
            <div className='h-[50rem] w-full dark:bg-black bg-white  dark:bg-dot-white/[0.2] bg-dot-black/[0.2] relative flex items-center justify-center'>
                <div className='absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_1%,black)]'></div>
                <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
                    <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
                    Welcome to <br /> Path of KraNf.
                    </h1>
                    <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
                        This site gonna be used for economy, trade, craft and more...
                    </p>
                </div>
            </div>

        </div>
    )
}

export default Hero