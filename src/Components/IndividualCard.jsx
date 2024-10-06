import React, { useState } from 'react'
import { useEffect } from 'react';
import api from '../api/api';
import { Carousel } from 'flowbite-react';

export default function IndividualCard({id}) {

    const [cardData,setCardData] = useState()
    useEffect(()=>{
        getCard();
    },[id])

    const getCard = async()=>{
        const response = await api.get(`/api/v1/card/${id}`);
        if(response.data){
            setCardData(response.data)
        }
    }

  return (
        <>
            <div className='lg:w-1/2 hidden md:block  lg:px-2'>
                <div className='border-[#6ACDE9] border-2 h-full divide-y rounded-lg divide-[#6ACDE9]'>
                    <div className='flex items-center justify-center gap-x-3 py-3 '>
                        <img src={cardData?.icon?.url}></img>
                        <h1 className='text-2xl font-medium'>{cardData?.title}</h1>
                    </div>
                    <div className=' flex  justify-center'>
                        <ul className='list-disc lg:text-lg pl-8 py-3'>
                            {cardData?.description}
                        </ul>
                    </div>
                </div>
            </div>

            <div className="h-96 w-full  sm:h-64 xl:h-80 2xl:h-96   md:hidden">
            <Carousel className='custom-carousel'>
            <div className='border-[#6ACDE9] border-2 h-full divide-y rounded-lg divide-[#6ACDE9]'>
                    <div className='flex items-center justify-center gap-x-3 py-3 '>
                        <img src={cardData?.icon?.url}></img>
                        <h1 className='text-2xl font-medium'>{cardData?.title}</h1>
                    </div>
                    <div className=' flex  justify-center'>
                        <ul className='list-disc lg:text-lg pl-8 py-3'>
                            {cardData?.description}
                        </ul>
                    </div>
                </div>
            
            </Carousel>
        </div>
            
            
        </>
  )
}
