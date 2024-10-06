import React from 'react'
import { useState, useEffect } from 'react'
import api from '../api/api'
import { authentication } from '../firebase/config'
import FullProperty from '../Resources/fullproperty.png'
import PrivateRoom from '../Resources/privateroom.png'
import DormRoom from '../Resources/Dormroom.png'
import { Link } from 'react-router-dom'
import {  toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

export default function WishList2() {

    const [user,setUser] = useState(null)
    const [wishlistProperties,setWishlistProperties] = useState([])
    const [slideImage,setSlideImage] = useState([])
  const [essentialAmenities, setEssentialAmenities] = useState([]);
  const [extraAmenities, setExtraAmenities] = useState([]);
  const [amenitiesByProperty, setAmenitiesByProperty] = useState({});
  const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
              setUser(currentUser);
              setLoading(false); // User data is available, so set loading to false
      
              try {
                const wishlistData = await api.get(`api/v1/user/wishlist/${currentUser.uid}`);
                getWishListProperty(wishlistData.data)
              } catch (error) {
                console.error('Error fetching wishlist:', error);
              }
            } else {
              setUser(null);
              setLoading(false); 
            }
          });
      
          return () => unsubscribe();
        
    }, []);

    useEffect(()=>{
        getSlideImage();
        getAmenities();
    },[wishlistProperties])

    const getSlideImage = async()=>{
        try{
          const new_slide_images = await Promise.all(wishlistProperties.map(async (item,index) => {
              try{
                const result = await api.get(`/api/v1/image/${item.currentLocation_images[0]}`);
                return result.data.url;
              }catch(err){}
          }));
          setSlideImage(new_slide_images)
    
        }catch(err){
          console.log(err)
        }
      }
  
    const getAmenities = async () => {
        try {
          const amenitiesMap = {};
    
          await Promise.all(
            wishlistProperties.map(async (property) => {
              const propertyAmenities = await Promise.all(
                property.amenities.map(async (id) => {
                  try {
                    const result = await api.get(`/api/v1/amenity/${id}`);
                    return result.data;
                  } catch (err) {
                    console.log(err);
                    return null;
                  }
                })
              );
              amenitiesMap[property._id] = propertyAmenities.filter((amenity) => amenity !== null);
            })
          );
    
          setAmenitiesByProperty(amenitiesMap);
        } catch (err) {
          console.log(err);
        }
      };

    const toggleClass = async (id) => {
        try {
          
             await api.patch(`api/v1/user/wishlist/remove/${user.uid}`, {
              propertyId: id 
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

    const getWishlist = async() =>{
        try {
            const wishlistData = await api.get(`api/v1/user/wishlist/${user.uid}`);
            getWishListProperty(wishlistData.data)
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    }

    const getWishListProperty = async (wishlistData) =>{
        if(wishlistData.length>0){
            const list = await Promise.all(
              wishlistData.map(async (item, index) => {
                try{
                  const result = await api.get(`/api/v1/property/${item}`);
                    return result.data; 
                }catch(err){
                  return null
                }
                  
                })
            );
            const filteredList = list.filter((item) => item !== null);
            setWishlistProperties(filteredList)
        }else{
            setWishlistProperties([])
        }
        
    }

    const contactUs = ()=>{
        window.open("https://api.whatsapp.com/send?phone=919136886650&text=Hello%20I%20want%20to%20enquire", "_blank");
      }


  return (
    <>
        <div class="flex flex-wrap   mb-10   mt-4">
            {  wishlistProperties?.map((item,idx)=>{
                return(

                <>
            <div class=" md:w-1/3 sm:mb-0 mb-6 p-0 md:p-2">
                <div className='rounded-tr-xl h-full rounded-bl-xl border-2'>
                <div class="rounded-tr-xl h-64 overflow-hidden">
                    <img alt="content" class="object-cover object-center h-full w-full" src={slideImage[idx]}/>
                </div>
                <div className='p-4 pt-0'>
                    <div className='flex justify-between items-center'>
                        <Link to={`/property/${item._id}`}><h2 class="text-2xl font-medium title-font text-gray-900 mt-5">{item.title}</h2></Link>
                        <div class={`button animate active cursor-pointer  flex justify-end items-center`} onClick={()=>{toggleClass(item._id)}}>
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
                        {item.location}
                    </span>
                    <div className=' mt-2 md:flex hidden'>
                        {amenitiesByProperty[item._id]?.map((item1,index)=>{
                        if(index < 2){
                            return (<div className='bg-[#E0F4FA] rounded-full mr-1 px-4 py-1 flex items-center'><img src={item1.icon.url} className='w-[1.2rem] mx-1' alt='meal'></img>{item1.title}</div>)
                        }
                        })}
                        <div className='bg-[#E0F4FA] rounded-full mr-1 px-4 py-1 flex items-center'>More</div>
                        
                    </div>
                    <div className='flex my-1 mt-2'>
                        {item.roomType.map((item1,index)=>{
                        return(
                            (item1 == 'full-property' && <div className='flex mr-1 pr-2 items-center text-sm'><img src={FullProperty} alt='full' className='mr-1'></img> Full Property</div>) ||
                            (item1 == 'private-rooms' && <div className='flex mx-1 px-2 items-center  text-sm'><img src={PrivateRoom} alt='private' className='mr-1'></img> Private Room</div>) ||
                            (item1 == 'dorm-beds' && <div className='flex mx-1 px-2 items-center  text-sm'><img src={DormRoom} alt='dorm' className='mr-1'></img> Dorm Room</div>))
                        })}
                    </div>
                    <div className='mt-2'><b className=''>Starting from</b><span className='py-1 px-2 ml-2 border-2 rounded-lg border-green-500 text-green-500 font-medium'>Rs {item.price}/-</span></div>
                    
                </div><Link to={`/property/${item._id}`}>
                <button className={`w-full bg-[#F79489] py-4 text-xl text-white font-medium rounded-bl-xl `}>Book Now</button>
                </Link>
                </div>
            </div>

            

</>
            )}) 
            }
        </div>
        {wishlistProperties.length == 0 && <><h1 className='md:text-3xl font-bold mt-20 underline underline-offset-8 decoration-1'>No WishList yet!</h1>
            <Link to="/"><button className='rounded-lg border-2 py-3 px-4 border-slate-800 mt-5 font-medium'> Add properties to your wishlist </button></Link>
            <hr className='my-4'></hr>
            <h1 className='text-lg font-medium mb-20'>Confused to find the Homestay? <span className='cursor-pointer underline decoration-1' onClick={()=>{contactUs()}}>Contact Us </span></h1></>}
    </>
  )
}
