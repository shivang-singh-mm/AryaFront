import React, { useEffect, useState } from 'react'
import { Carousel } from 'flowbite-react';
import FullProperty from '../Resources/fullproperty.png'
import PrivateRoom from '../Resources/privateroom.png'
import DormRoom from '../Resources/Dormroom.png'
import { Link } from 'react-router-dom';
import api from '../api/api';

export default function HomeCard1({property}) {

  const [price,setPrice] = useState(property.price);
  const [allEvents, setAllEvents] = useState([]);
  const [slideImage,setSlideImage] = useState([])
  const [essentialAmenities, setEssentialAmenities] = useState([]);
  const [extraAmenities, setExtraAmenities] = useState([]);

  useEffect(() => {
    getSlideImage();
    getAmenities();
    getEvents();
  },[property]);

  useEffect(() => {
    overLap();
  },[allEvents])

  const getSlideImage = async()=>{
    try{
      const new_slide_images = await Promise.all(property.currentLocation_images.map(async (id,index) => {
        if(index!=2){
            const result = await api.get(`/api/v1/image/${id}`);
            return result.data.url;
        }
      }));
      setSlideImage(new_slide_images)
    }catch(err){
      console.log(err)
    }
  }
  const getEvents = async (e) => {
    const events = await Promise.all(
      property.events.map(async (id) => {
        const result = await api.get(`/api/v1/event/${id}`);
        return result.data;
      })
    );
    setAllEvents(events);
  }

  const overLap = () => {
    for (let i = 0; i < allEvents.length; i++) {
      const d1 = new Date(allEvents[i].start);
      const d2 = new Date();
      const d3 = new Date(allEvents[i].end);
      const d4 = d2;
      if ((d1 <= d2 && d2 <= d3) || (d1 <= d4 && d4 <= d3)) {
        setPrice(allEvents[i].title);
        return;
      }
    } 
  }

  const getAmenities = async()=>{
    try{
      const new_amenities = await Promise.all(property.amenities.map(async (id,index) => {
        
            const result = await api.get(`/api/v1/amenity/${id}`);
            return result.data;
        }
      ));

      // setAmenities(new_amenities)
      const essential = new_amenities.filter(amenity => amenity.type === 'essential');
      const extra = new_amenities.filter(amenity => amenity.type === 'extra');
      setEssentialAmenities(essential);
      setExtraAmenities(extra);

    }catch(err){
      console.log(err)
    }
  }


  return (
    <Link to={`/property/${property._id}`}>
    <div className='flex  md:flex-row  flex-col-reverse custom-align-home mt-20 pb-2   '>
      
        <div className='md:w-2/3 md:pl-10 pl-1  pt-2 '>
          <h1 className='font-medium md:text-3xl text-xl'>{property.title}</h1>
          <span className='text-lg text-[#8E8E8E]'><i className='fa  fa-map-marker text-[#6ACDE9] text-xl'></i> {property.location}</span>
          <div className=' mt-2 md:flex hidden'>
            {essentialAmenities?.map((item,index)=>{
              if(index < 3){
                return (<div className='bg-[#E0F4FA] rounded-full mr-1 px-4 py-1 flex items-center'><img src={item.icon.url} className='w-[1.2rem] mx-1' alt='meal'></img>{item.title}</div>)
              }
              })}
              <div className='bg-[#E0F4FA] rounded-full mr-1 px-4 py-1 flex items-center'>More</div>
            
          </div>
          <h1 className='text-[#F79489] font-medium text-xl mt-2 md:block hidden'>Room types</h1>
          <div className='flex my-1'>
            {property.roomType.map((item,index)=>{
              return(
                (item == 'full-property' && <div className='flex mr-1 pr-2 items-center text-sm'><img src={FullProperty} alt='full' className='mr-1'></img> Full Property</div>) ||
                (item == 'private-rooms' && <div className='flex mx-1 px-2 items-center  text-sm'><img src={PrivateRoom} alt='private' className='mr-1'></img> Private Room</div>) ||
                (item == 'dorm-beds' && <div className='flex mx-1 px-2 items-center  text-sm'><img src={DormRoom} alt='dorm' className='mr-1'></img> Dorm Room</div>))
            })}
              {/* <div className='flex mr-1 pr-2 items-center text-sm'><img src={FullProperty} alt='full' className='mr-1'></img> Full Property</div>
              <div className='flex mx-1 px-2 items-center  text-sm'><img src={PrivateRoom} alt='private' className='mr-1'></img> Private Room</div>
              <div className='flex mx-1 px-2 items-center  text-sm'><img src={DormRoom} alt='dorm' className='mr-1'></img> Dorm Room</div> */}
          </div>
          <p className='md:pr-10 text-justify px-2 text-sm md:text-medium md:block hidden'>{property.room_description.substring(0,310)}</p>
          <div className='mt-2'><b className=''>Starting from</b><span className='py-1 px-2 ml-2 border-2 rounded-lg border-green-500 text-green-500 font-medium'>Rs {price}/-</span></div>
        </div>
        <div className=' rounded p-2 img-border md:aspect-auto aspect-square bg-slate-100 w-80'>
          <Carousel>
            {slideImage?.map((item)=>{
              return(<img src={item}  alt="..." />)
            })}
          </Carousel>
        </div>  
        
      </div>
      </Link>
  )
}
