import { Carousel } from 'flowbite-react'
import React from 'react'



export default function Reviews() {

    return (
        <div className='bg-[white]'>
            <div className='flex items-center justify-center mt-8 '>
                <div className='bg-[#F79489] md:w-52 w-40 h-1'> </div>
                <div className='px-3 text-center lg:text-4xl md:tex-3xl text-xl font-medium'>Why our Guests <span className='text-[#F79489]'>Love</span> <span className='text-[#179FEB]'>Aarya Stays</span></div>
                <div className='bg-[#F79489] md:w-52 w-40 h-1'> </div>
            </div>
            <div className=' md:px-20 px-10 mt-6 flex-wrap md:space-x-4 md:space-y-1 space-y-2 hidden md:flex'>
                <div className='md:flex-1 border-2 rounded-t-3xl rounded-bl-3xl border-[#6ACDE9] md:p-10 p-6'>
                    <p>“ One of the best and amazing stay i've experienced in aurovilla. Our stay was simply unforgettable! Breathtaking views, delicious food, wonderful hosts, and excellent guidance made it a truly amazing experience. The presence of beautiful plants added to the charm, and we had a pleasant stay overall. We will visit again for sure, Highly recommended! ’’
                    </p>
                    <div className='flex mt-2'>
                        {/* <img></img> */}
                        <h1 className='font-bold'>Gowtham, Punjab</h1>
                    </div>
                </div>
                <div className='md:flex-1 border-2 rounded-t-3xl rounded-bl-3xl border-[#6ACDE9] md:p-10 p-6'>
                    <p>“ One of the best and amazing stay i've experienced in aurovilla. Our stay was simply unforgettable! Breathtaking views, delicious food, wonderful hosts, and excellent guidance made it a truly amazing experience. The presence of beautiful plants added to the charm, and we had a pleasant stay overall. We will visit again for sure, Highly recommended! ’’
                    </p>
                    <div className='flex mt-2'>
                        {/* <img></img> */}
                        <h1 className='font-bold'>Gowtham, Punjab</h1>
                    </div>
                </div>
                <div className='md:flex-1 border-2 rounded-t-3xl rounded-bl-3xl border-[#6ACDE9] md:p-10 p-6'>
                    <p>“ One of the best and amazing stay i've experienced in aurovilla. Our stay was simply unforgettable! Breathtaking views, delicious food, wonderful hosts, and excellent guidance made it a truly amazing experience. The presence of beautiful plants added to the charm, and we had a pleasant stay overall. We will visit again for sure, Highly recommended! ’’
                    </p>
                    <div className='flex mt-2'>
                        {/* <img></img> */}
                        <h1 className='font-bold'>Gowtham, Punjab</h1>
                    </div>
                </div>
            </div>
            <div className="h-96 sm:h-64 xl:h-80 2xl:h-96 max-md:gap-2 mx-4 md:hidden">
                <Carousel indicators={false} className='custom-carousel custom-btn h-ful'>

                    <div className=' border-2 rounded-t-3xl rounded-bl-3xl border-[#6ACDE9] p-6 w-[95%]'>
                        <p>“ One of the best and amazing stay i've experienced in aurovilla. Our stay was simply unforgettable! Breathtaking views, delicious food, wonderful hosts, and excellent guidance made it a truly amazing experience. The presence of beautiful plants added to the charm, and we had a pleasant stay overall. We will visit again for sure, Highly recommended! ’’
                        </p>
                        <div className='flex mt-2'>
                            <h1 className='font-bold'>Gowtham, Punjab</h1>
                        </div>
                    </div>
                    <div className='md:flex-1 border-2 rounded-t-3xl rounded-bl-3xl border-[#6ACDE9] md:p-10 p-6  w-[95%]'>
                        <p>“ One of the best and amazing stay i've experienced in aurovilla. Our stay was simply unforgettable! Breathtaking views, delicious food, wonderful hosts, and excellent guidance made it a truly amazing experience. The presence of beautiful plants added to the charm, and we had a pleasant stay overall. We will visit again for sure, Highly recommended! ’’
                        </p>
                        <div className='flex mt-2'>
                            <h1 className='font-bold'>Gowtham, Punjab</h1>
                        </div>
                    </div>
                    <div className='md:flex-1 border-2 rounded-t-3xl rounded-bl-3xl border-[#6ACDE9] md:p-10 p-6  w-[95%]'>
                        <p>“ One of the best and amazing stay i've experienced in aurovilla. Our stay was simply unforgettable! Breathtaking views, delicious food, wonderful hosts, and excellent guidance made it a truly amazing experience. The presence of beautiful plants added to the charm, and we had a pleasant stay overall. We will visit again for sure, Highly recommended! ’’
                        </p>
                        <div className='flex mt-2'>
                            <h1 className='font-bold'>Gowtham, Punjab</h1>
                        </div>
                    </div>
                </Carousel>
            </div>


            {/* <div id="animation-carousel" class="relative w-full" data-carousel="static">
    <div class="relative h-56 overflow-hidden rounded-lg md:h-96">
        <div class="hidden duration-200 ease-linear" data-carousel-item>
            <img src="/docs/images/carousel/carousel-1.svg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
        <div class="hidden duration-200 ease-linear" data-carousel-item>
            <img src="/docs/images/carousel/carousel-2.svg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
        <div class="hidden duration-200 ease-linear" data-carousel-item="active">
            <img src="/docs/images/carousel/carousel-3.svg" class="absolute block w-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2" alt="..."/>
        </div>
    </div>
    <button type="button" class="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-prev>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 1 1 5l4 4"/>
            </svg>
            <span class="sr-only">Previous</span>
        </span>
    </button>
    <button type="button" class="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none" data-carousel-next>
        <span class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
            <svg class="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span class="sr-only">Next</span>
        </span>
    </button>
</div> */}

        </div>
    )
}

