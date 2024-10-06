import React, { useEffect, useState } from 'react'
import api from '../api/api'
import { Carousel } from 'flowbite-react'
import FullProperty from '../Resources/fullproperty.png'
import PrivateRoom from '../Resources/privateroom.png'
import DormRoom from '../Resources/Dormroom.png'
import { Link } from 'react-router-dom'
import {  toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import { authentication } from '../firebase/config'

export default function WishListCard({property}) {

  const [slideImage,setSlideImage] = useState([])
  const [essentialAmenities, setEssentialAmenities] = useState([]);
  const [extraAmenities, setExtraAmenities] = useState([]);
  const [user,setUser] = useState();
  const [wishlist,setWishList] = useState([])

    useEffect(()=>{
        getSlideImage();
        getAmenities();
    },[])

    useEffect(() => {
      const unsubscribe = authentication.onAuthStateChanged(async (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
  
          try {
            const wishlistData = await api.get(`api/v1/user/wishlist/${currentUser.uid}`);
            setWishList(wishlistData.data);
          } catch (error) {
            console.error('Error fetching wishlist:', error);
          }
        } else {
          setUser(null);
          setWishList([]); // Reset wishlist if user is not available
        }
      });
      return () => unsubscribe();
    }, []);

    const getWishlist = ()=>{
      try {
        const wishlistData = api.get(`api/v1/user/wishlist/${user.uid}`);
        setWishList(wishlistData.data);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } 
    }

    const getSlideImage = async()=>{
      try{
        const new_slide_images = await Promise.all(property.currentLocation_images.map(async (id,index) => {
            try{
              const result = await api.get(`/api/v1/image/${id}`);
              return result.data.url;
            }catch(err){}
        }));
        setSlideImage(new_slide_images)
  
      }catch(err){
        console.log(err)
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

    const toggleClass = async () => {
      try {
        
           await api.patch(`api/v1/user/wishlist/remove/${user.uid}`, {
            propertyId: property._id 
          });
          toast('💔 Removed from wishlist!', {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar:true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
            progress: undefined,
            theme: "light",
            toastId:'removed'
            });
            getWishlist()
        
      } catch (error) {
        console.error('Error toggling wishlist:', error);
      }
    };
  return (
    // <div className="flex flex-col  bg-white  md:flex-row md:p-5 mt-3 ">
    //   <div className="img-border p-2 md:w-1/4 md:h-80 bg-slate-300  custom-slider ">
    //   <Carousel>
    //         {slideImage?.map((item)=>{
    //           return(<img src={item} class="object-cover w-full rounded-br-lg rounded-tl-lg h-auto md:h-full md:w-full "  alt="..." />)
    //         })}
    //       </Carousel>
    //   </div>
    //   <div className=" md:w-3/4 md:h-80 ">
    //     <div className="md:ml-5 border-2 h-full  border-slate-200 flex flex-col">
    //       <div className="md:flex-1 border-2 border-slate-200 md:px-10 p-4 justify-center flex-col flex">
    //         <div className="flex justify-between ">
    //         <Link to={`/property/${property._id}`}><h1 className="font-medium md:text-3xl text-xl">
    //             {property.title}
    //           </h1></Link>
              
              
              
    //         </div>
    //         <span className="md:text-lg text-[#8E8E8E]">
    //           <i className="fa  fa-map-marker text-[#6ACDE9] md:text-xl text-lg"></i>
    //           {property.location}
    //         </span>
          // <div className=' mt-2 md:flex hidden'>
          //   {essentialAmenities?.map((item,index)=>{
          //     if(index < 3){
          //       return (<div className='bg-[#E0F4FA] rounded-full mr-1 px-4 py-1 flex items-center'><img src={item.icon.url} className='w-[1.2rem] mx-1' alt='meal'></img>{item.title}</div>)
          //     }
          //     })}
          //     <div className='bg-[#E0F4FA] rounded-full mr-1 px-4 py-1 flex items-center'>More</div>
            
          // </div>
    //         <h1 className='text-[#F79489] font-medium text-xl mt-2 md:block hidden'>Room types</h1>
            // <div className='flex my-1'>
            //   {property.roomType.map((item,index)=>{
            //   return(
            //     (item == 'full-property' && <div className='flex mr-1 pr-2 items-center text-sm'><img src={FullProperty} alt='full' className='mr-1'></img> Full Property</div>) ||
            //     (item == 'private-rooms' && <div className='flex mx-1 px-2 items-center  text-sm'><img src={PrivateRoom} alt='private' className='mr-1'></img> Private Room</div>) ||
            //     (item == 'dorm-beds' && <div className='flex mx-1 px-2 items-center  text-sm'><img src={DormRoom} alt='dorm' className='mr-1'></img> Dorm Room</div>))
            //   })}
              
            // </div>
    //         <p className='md:pr-10 text-justify px-2 text-sm md:text-medium md:block hidden'>{property.room_description.substring(0,310)}</p>
    //           <div className='mt-2'><b className=''>Starting from</b><span className='py-1 px-2 ml-2 border-2 rounded-lg border-green-500 text-green-500 font-medium'>Rs {property.price}/-</span></div>
    //         </div>
          
    //     </div>
    //   </div>
    // </div>

  
    
    <>
      <div class=" md:w-1/3 sm:mb-0 mb-6 rounded-tr-xl rounded-bl-xl border-2">
        <div class="rounded-tr-xl h-64 overflow-hidden">
          <img alt="content" class="object-cover object-center h-full w-full" src={slideImage[0]}/>
        </div>
        <div className='p-4 pt-0'>
          <div className='flex justify-between items-center'>
            <Link to={`/property/${property._id}`}><h2 class="text-2xl font-medium title-font text-gray-900 mt-5">{property.title}</h2></Link>
            <div class={`button animate active cursor-pointer  flex justify-end items-center`} onClick={()=>{toggleClass()}}>
                    <svg width="100px" height="40px" viewBox="0 0 70 25" xmlns="http://www.w3.org/2000/svg" className='mobile-svg'>
                    <g fill="none" fill-rule="evenodd" transform="translate(7.5 2.5)">
                        <path class="heart-stroke" d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z" fill="#e32d00"/>
                        <path class="heart-full" d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z" fill="#e32d00"/>
                        <path class="heart-lines" d="M26,4 L30.6852129,0.251829715" stroke="#e32d00" stroke-width="2" stroke-linecap="round"/>
                        <path class="heart-lines"d="M2.314788,4 L7.00000086,0.251829715" stroke="#e32d00" stroke-width="2" stroke-linecap="round" transform="matrix(-1 0 0 1 10.314788 1)"/>
                        <path class="heart-lines" d="M27,12 L33,12" stroke="#e32d00" stroke-width="2" stroke-linecap="round" />
                        <path class="heart-lines" d="M0,12 L6,12" stroke="#e32d00" stroke-width="2" stroke-linecap="round" transform="matrix(-1 0 0 1 7 1)"/>
                        <path class="heart-lines" d="M24,19 L28.6852129,22.7481703" stroke="#e32d00" stroke-width="2" stroke-linecap="round"/>
                        <path class="heart-lines" d="M4.314788,19 L9.00000086,22.7481703" stroke="#e32d00" stroke-width="2" stroke-linecap="round" transform="matrix(-1 0 0 1 14.314788 1)"/>
                        </g>
                    </svg>
            </div>
          </div>
        
          <span className="md:text-md text-[#8E8E8E]">
            <i className="fa  fa-map-marker text-[#6ACDE9] md:text-lg text-lg mr-2"></i>
            {property.location}
          </span>
          <div className=' mt-2 md:flex hidden'>
            {essentialAmenities?.map((item,index)=>{
              if(index < 2){
                return (<div className='bg-[#E0F4FA] rounded-full mr-1 px-4 py-1 flex items-center'><img src={item.icon.url} className='w-[1.2rem] mx-1' alt='meal'></img>{item.title}</div>)
              }
              })}
              <div className='bg-[#E0F4FA] rounded-full mr-1 px-4 py-1 flex items-center'>More</div>
            
          </div>
          <div className='flex my-1 mt-2'>
              {property.roomType.map((item,index)=>{
              return(
                (item == 'full-property' && <div className='flex mr-1 pr-2 items-center text-sm'><img src={FullProperty} alt='full' className='mr-1'></img> Full Property</div>) ||
                (item == 'private-rooms' && <div className='flex mx-1 px-2 items-center  text-sm'><img src={PrivateRoom} alt='private' className='mr-1'></img> Private Room</div>) ||
                (item == 'dorm-beds' && <div className='flex mx-1 px-2 items-center  text-sm'><img src={DormRoom} alt='dorm' className='mr-1'></img> Dorm Room</div>))
              })}
            </div>
            <div className='mt-2'><b className=''>Starting from</b><span className='py-1 px-2 ml-2 border-2 rounded-lg border-green-500 text-green-500 font-medium'>Rs {property.price}/-</span></div>
          
        </div>
        <button className='w-full bg-[#F79489] py-4 text-xl text-white font-medium rounded-bl-xl'>Book Now</button>
        
      </div>
      
      </>
  )
}
