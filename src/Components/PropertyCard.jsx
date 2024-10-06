import {useState} from 'react'
import { Carousel } from 'flowbite-react';

import DummyImgSqr from '../Resources/DummyImgSqr.png'
import React, { useEffect } from 'react';
import { Datepicker } from 'flowbite-react';
import { Dropdown } from 'flowbite-react';
// import { useState } from 'react';

import Meals from '../Resources/Meals.png'
import Parking from '../Resources/Parking.png'
import Wifi from '../Resources/Wi-Fi.png'
import Chef from '../Resources/Chef.png'
import FullProperty from '../Resources/fullproperty.png'
import PrivateRoom from '../Resources/privateroom.png'
import DormRoom from '../Resources/Dormroom.png'

export default function PropertyCard() {

  const [checkInDate,setCheckInDate] = useState();  
    const [checkOutDate,setCheckOutDate] = useState(); 
    useEffect(()=>{
        setCheckInDate(new Date().getDate()+'/'+(new Date().getMonth()+1) +'/'+new Date().getFullYear());
        setCheckOutDate((new Date().getDate()+1)+'/'+(new Date().getMonth()+1) +'/'+new Date().getFullYear());
    },[]) 

    const handleCheckIn = (date) => {
        setCheckInDate(date.getDate()+'/'+(date.getMonth()+1) +'/'+date.getFullYear());
    };

    const handleCheckOut = (date) => {
        setCheckOutDate(date.getDate()+'/'+(date.getMonth()+1) +'/'+date.getFullYear());
    };

    const [adultNumber,setAdultNumber] = useState(2);
   const incrAdult = () =>{
         setAdultNumber(adultNumber+1);
   }
   const decrAdult = ()=>{
    if (adultNumber>0){
           setAdultNumber(adultNumber-1)
       }
   }

   const [childNumber,setChildNumber] = useState(1);
   const incrChild = () =>{
    setChildNumber(childNumber+1);
   }
   const decrChild = ()=>{
    if(childNumber > 0){
        setChildNumber(childNumber-1)
    }
   }

   const [roomType,setRoomType] = useState("Full Property");

    const handleRoomType = (type) => {
      setRoomType(type)
    }

  const [price,setPrice] = useState(7000)

  return (
    <div className='  md:mx-20 mx-8 '>
      <div  class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:p-5 ">
        <div className='img-border p-5 md:w-1/3 md:h-80   '>
          <img class="object-cover w-full  rounded-lg h-auto md:h-full md:w-full  " src={DummyImgSqr} alt=""/>
        </div>
        
        <div class="flex flex-col justify-between p-5 md:w-2/3 leading-normal">
          <h1 className='font-medium md:text-3xl text-xl'>AARYA STAYS: 3BHK Lake View</h1>
          <span className='text-lg text-[#8E8E8E]'><i className='fa  fa-map-marker text-[#6ACDE9] text-xl'></i> Rustomjee Acura, Majiwada, Thane</span>
          <p className='md:text-xl text-md'>This 2-bed bunkbed Private room has an attached bathroom and lockers for each bed and it is totally air conditioned. Each bed is equipped with a reading lamp, and charging points and has curtains on all sides for </p>
          <div className='flex flex-wrap'>
            <div class="md:w-1/3 w-1/2 h-full text-lg py-2 ...">
                <h1 className='pl-3 z-10 font-medium'>Check In</h1>
                <Datepicker value={checkInDate} onSelectedDateChanged={handleCheckIn} className='p-0  custom-date cursor-pointer'/>
            </div>

            <div class="md:w-1/3 w-1/2 text-lg py-2 ...">
                <h1 className='pl-3 z-10 font-medium'>Check Out</h1>
                <Datepicker value={checkOutDate} onSelectedDateChanged={handleCheckOut} className='p-0  custom-date'/>
            </div>

            <div class="md:lg:w-1/3 w-1/2 dropdown px-3 py-2 ...">
                  <Dropdown
                      arrowIcon={true}
                      className='px-5 py-4'
                      inline
                      label={<div className='text-start  w-full'><div className='text-xl font-medium'>Type</div>
                  <div className='text-[#F79489]'>{roomType}</div></div>}>
                      <Dropdown.Item>
                      <div className=' cursor-pointer' onClick={()=>{handleRoomType('Full Property')}}>
                          <h1 className='font-bold text-base '>Full Property</h1>
                      </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Divider />
                      <Dropdown.Item>
                      <div className=' cursor-pointer' onClick={()=>{handleRoomType('Dorm Beds')}}>
                          <h1 className='font-bold text-base '>Dorm Beds</h1>
                      </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Divider />
                      <Dropdown.Item>
                      <div className=' cursor-pointer' onClick={()=>{handleRoomType('Private Rooms')}}>
                          <h1 className='font-bold text-base '>Private Rooms</h1>
                      </div>
                      </Dropdown.Item>
                      
                  </Dropdown>
            </div>

            <div class="lg:w-1/3 w-1/2 dropdown px-3 py-2 ...">
                <Dropdown
                    arrowIcon={true}
                    dismissOnClick={false}
                    className='px-5 py-4'
                    inline
                    label={<div className='text-start  w-full'><div className='text-xl font-medium'>Guests</div>
                <div className='text-[#F79489]'>{adultNumber} Adult, {childNumber} Child</div></div>}>
                    <div className='flex w-100 mb-2 justify-between'>
                        <div><h1 className='font-bold text-base w-3/5'>Adults</h1><p className='text-gray-400'>Age 8+</p></div>
                        <div className='w-2/5 justify-between  flex items-center'><button className='border mr-2 rounded-full border-2' onClick={decrAdult}>-</button> {adultNumber}<button className='ml-2 border rounded-full border-2' onClick={incrAdult}>+</button></div>
                    </div>
                    <Dropdown.Divider />
                    <div className='flex w-100 my-2 justify-between'>
                            <div><h1 className='font-bold text-base w-3/5'>Child</h1><p className='text-gray-400'>Age 0 - 8</p></div>
                            <div className='w-2/5 justify-between  flex items-center'><button onClick={decrChild} className='border mr-2 rounded-full border-2'>-</button> {childNumber}<button onClick={incrChild} className='ml-2 border rounded-full border-2'>+</button></div>
                    </div>
                    <Dropdown.Divider />
                    <div>
                      <h1 className='text-green-500 font-bold w-64'>Charges are not applicable for children below 8</h1>
                    </div>
                    
                </Dropdown>
            </div>

            <div className='lg:w-1/2 w-full px-3 py-2'>
                  <div className='flex  items-center h-full'>
                    <h1 className='font-medium md:text-xl'>Total before Taxes </h1>
                    <span className='py-1 px-2 ml-2 border-2 rounded-lg border-green-500 text-green-500 font-medium'>Rs {price}/-</span>
                  </div>
            </div>

          </div>
          
        </div>
      </div>

    </div>
  


  )
}
