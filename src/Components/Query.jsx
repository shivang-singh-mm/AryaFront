import React from 'react'
import leaves from '../Resources/Rectangle 335 (1).svg'

export default function Query() {
  const contactUs = () => {
    window.open('https://api.whatsapp.com/send?phone=919136886650&text=Hello I want to enquire', '_blank', 'noreferrer');

  }
  return (
    <div className='bg-[#FEDD89] w-full md:text-center max-md:items-center py-12 mt-10'>
      <img className='z-10 max-md:opacity-50 max-md:ml-[-8.5%] ml-[-2.2%] max-md:mt-[-2.9%] mt-[-0.9%] h-[250px]' src={leaves} style={{
        transform: 'rotate(90deg)', position: 'absolute',
        //  margin: '-0.9% auto auto -2.3%' 

      }} />
      <img className='max-md:hidden' src={leaves} style={{ height: '250px', transform: 'rotate(270deg)', position: 'absolute', margin: '0 0 30px 81.2%' }} />
      <h1 className='z-20 md:text-4xl text-lg font-medium items-center text-center'>Still confused about choosing stays? </h1>
      <h2 className='z-20 md:text-xl text-lg md:mt-8 mt-5' style={{ color: 'black' }}>Call us <b>+91 7999913023</b> or click the below button to ask your query</h2>
      <button className='rounded-full py-2 max-md:ml-28 px-5 md:text-xl bg-white text-black md:mt-10 mt-5 text-center' onClick={() => { contactUs() }}>Ask us Query</button>
    </div>
  )
}
