import React from 'react'
import homebg from '../Resources/homebg.png'

export default function Banner() {
  return (
    <div className='relative overflow-hidden md:h-full h-64'>
      <img src={homebg} className='object-cover  h-full  w-full' />
      <div className='absolute inset-0 m-auto md:mx-24 ml-5 mr-[70px] grid content-center  '>
        <h1 className='text-black md:text-4xl xl:text-6xl text-2xl'>Stay that feels <span className='text-[#6ACDE9] font-bold'>Safe</span></h1>
        {/* <div className='w-50'> */}
        <p className='md:text-2xl sm:2xl lg:text-2xl xl:text-4xl md:mt-10 mt-2 md:mr-20 lg:mr-96 xl:mr-96 md:pr-60 mr-20'><span className='text-[#F79489] font-bold'>Aarya Stays</span> provides the safest place for a female embedded with <span className='text-[#34A853] font-bold'>Bohemian Interiors</span> for a <span className='text-[#6ACDE9] font-bold'>comfort</span> and enlighten experience...</p>
        {/* </div> */}

      </div>
    </div>
  )
}
