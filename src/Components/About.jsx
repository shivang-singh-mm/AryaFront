import React from 'react'
import Bg from '../Resources/aboutbg.png'


export default function About() {
  return (
    <>
      <div className='lg:relative bg-[#EFEFEF] overflow-hidden lg:h-full py-10 lg:py-0     '>
        <img src={Bg} className='object-cover hidden lg:block  h-full  w-full' />
        <div className=' lg:absolute  lg:mx-24 inset-0 m-auto grid content-center  mx-10'>
          <h1 className='text-black lg:text-6xl text-3xl font-medium'>About</h1>
          <p className='lg:text-xl lg:mt-10 mt-2 text-base xl:mr-20 2xl:mr-96 lg:mr-20 lg:pr-60'>Welcome to Aarya Stays, where comfort, safety and female friendly is our priority. We provide Beautiful room presentations, reservation options, a whole lot more awaits here.</p>
          <p className='lg:text-xl lg:mt-10 mt-2 text-base xl:mr-20 2xl:mr-96 lg:mr-20 lg:pr-60'>Aarya Stays: Your peaceful, comfortable, and safe home away from home in Thane to relax with your family, friends, or colleagues at Aarya Stays, with customizable services.</p>
          <p className='lg:text-xl lg:mt-2 mt-2 text-base xl:mr-20 2xl:mr-96 lg:mr-20 lg:pr-60'>Access to the Kitchen is included with every booking, so you can cook your meals or make homemade food from one of our on-demand home chefs. Get an On-demand air conditioner according to Mumbai’s Weather for more affordable Homestays.</p>

        </div>
      </div>
    </>
  )
}
