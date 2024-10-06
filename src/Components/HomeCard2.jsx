import React from 'react'
import FullProperty from '../Resources/fullproperty.png'
import PrivateRoom from '../Resources/privateroom.png'
import DormRoom from '../Resources/Dormroom.png'
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../api/api';
import { authentication } from '../firebase/config';
import { Carousel } from 'flowbite-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './likeButton.css'

export default function HomeCard2({ property, wishlist }) {
  const [slideImage, setSlideImage] = useState([])
  const [essentialAmenities, setEssentialAmenities] = useState([]);
  const [extraAmenities, setExtraAmenities] = useState([]);
  const [user, setUser] = useState();
  const [isInWishlist, setIsInWishlist] = useState(wishlist.includes(property._id));

  // const notify = () => toast("Wow so easy!");

  useEffect(() => {
    getSlideImage();
    getAmenities();
  }, []);

  useEffect(() => {
    const currentUser = authentication.currentUser;
    if (currentUser) {
      setUser(currentUser);
      setIsInWishlist(wishlist.includes(property._id));
    }
  }, [wishlist, user]);



  const getSlideImage = async () => {
    try {
      const new_slide_images = await Promise.all(property.currentLocation_images.map(async (id, index) => {
        try {
          const result = await api.get(`/api/v1/image/${id}`);
          return result.data.url;
        } catch (err) { }
      }));
      setSlideImage(new_slide_images)

    } catch (err) {
      console.log(err)
    }
  }

  const getAmenities = async () => {
    try {
      const new_amenities = await Promise.all(property.amenities.map(async (id, index) => {

        const result = await api.get(`/api/v1/amenity/${id}`);
        return result.data;
      }
      ));
      // setAmenities(new_amenities)
      const essential = new_amenities.filter(amenity => amenity.type === 'essential');
      const extra = new_amenities.filter(amenity => amenity.type === 'extra');
      setEssentialAmenities(essential);
      setExtraAmenities(extra);

    } catch (err) {
      console.log(err)
    }
  }

  const toggleClass = async () => {
    try {
      if (!user) {
        alert('You must be logged in and details must fill user details on profile page')
        return;
      }
      if (isInWishlist) {
        await api.patch(`api/v1/user/wishlist/remove/${user.uid}`, {
          propertyId: property._id
        });
        // toast('💔 Removed from wishlist!', {
        //   position: "top-right",
        //   autoClose: 2000,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: false,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "light",
        //   toastId: 'removed'
        // });
      } else {
        await api.patch(`api/v1/user/wishlist/${user.uid}`, {
          propertyId: property._id,
        });
        toast('❤️ Added to wishlist!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: true,
          progress: undefined,
          theme: "light",
          toastId: 'added'
        });
      }
      setIsInWishlist(!isInWishlist);
    } catch (error) {
      console.error('Error toggling wishlist:', error);
    }
  };


  return (
    <div className=' mx-8 p-3 bg-white flex flex-col-reverse md:flex-row custom-shadow rounded'>
      <div className='md:w-2/3 md:pl-4 py-2 pl- '>
        <div className='flex justify-between items-center'>
          <Link to={`/property/${property._id}`}><h1 className='font-medium md:text-3xl text-lg'>{property.title}</h1></Link>
          {/* <div class={`button ${isInWishlist ? 'animate active' : ''} cursor-pointer  flex justify-end items-center`} onClick={()=>{toggleClass()}}>
                      <svg width="100px" height="40px" viewBox="0 0 40 25" xmlns="http://www.w3.org/2000/svg" className='mobile-svg'>
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
                  </div> */}
        </div>
        <span className='md:text-lg text-md text-[#8E8E8E]'><i className='fa  fa-map-marker text-[#6ACDE9] text-xl'></i> {property.location}</span>
        <div className=' mt-2 md:flex hidden'>
          {essentialAmenities?.map((item, index) => {
            if (index < 3) {
              return (<div className='bg-[#E0F4FA] rounded-full mr-4 px-4 py-1 flex items-center justify-center'><img src={item.icon.url} className='w-[1.2rem] ' alt='meal'></img><div className='pl-1'>{item.title}</div></div>)
            }
          })}
          <Link to={`/property/${property._id}/#amenities`} >
            <div className='bg-[#E0F4FA] rounded-full mr-1 px-4 py-1 flex items-center cursor-pointer'>More...</div>

          </Link>

        </div>
        <h1 className='text-[#F79489] font-medium text-xl mt-2 md:block hidden'>Room types</h1>
        <div className='flex my-1 justify-start md:justify-start pr-'>
          {property.roomType.map((item, index) => {
            return (
              (item == 'full-property' && <div className='flex mr-4  items-center text-sm'><img src={FullProperty} alt='full' className='mr-1'></img> Full Property</div>) ||
              (item == 'private-rooms' && <div className='flex mr-4 items-center  text-sm'><img src={PrivateRoom} alt='private' className='mr-1'></img> Private Room</div>) ||
              (item == 'dorm-beds' && <div className='flex mr-4 items-center  text-sm'><img src={DormRoom} alt='dorm' className='mr-1'></img> Dorm Room</div>))
          })}

        </div>
        <p className='md:pr-10 text-justify px-2 md:px-0 text-sm md:text-medium md:block hidden'>{property.room_description.substring(0, 310)}</p>
        <div className='mt-3'><b className=''>Starting from</b><span className='py-1 px-2 ml-2 border-2 rounded-lg border-green-500 text-green-500 font-medium'>Rs {property.price}/-</span></div>

      </div>
      <div className='md:w-1/3 w-full md:h-[19rem] h-[17rem] img-border p-2 bg-red-800 custom-slider'>
        <div class={`button transition-transform duration-300 ease-in-out ${isInWishlist ? 'scale-120' : ''
          } cursor-pointer absolute z-10 md:right-10 right-14 flex justify-end items-center`} onClick={() => { toggleClass() }}>
          {/* <svg width="100px" height="40px" viewBox="0 0 40 25" xmlns="http://www.w3.org/2000/svg" className='mobile-svg'>
            <g fill="none" fill-rule="evenodd" transform="translate(7.5 2.5)">
              <path class="heart-stroke" d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z" fill="#e32d00" />
              <path class="heart-full" d="M13.0185191,4.25291223 L12.9746137,4.25291223 C10.1097846,4.25291223 8.67188189,6.6128289 8.5182129,8.92335198 C8.39747298,10.6740809 8.73225185,12.8528876 14.0777375,18.4782704 C14.7127154,19.1080239 15.5654911,19.4695694 16.4596069,19.4880952 C17.3247917,19.4700909 18.1444718,19.0969678 18.7262246,18.4563177 C19.3189478,17.9074999 24.5052763,12.5894551 24.3570955,8.98921012 C24.2363556,6.42623084 22.123407,4.25291223 19.7525139,4.25291223 C18.5053576,4.22947431 17.3125171,4.76253118 16.4980242,5.70727948 C15.6177331,4.73767759 14.354699,4.20555668 13.04596,4.25291223 L13.0185191,4.25291223 Z" fill="#e32d00" />
              <path class="heart-lines" d="M26,4 L30.6852129,0.251829715" stroke="#e32d00" stroke-width="2" stroke-linecap="round" />
              <path class="heart-lines" d="M2.314788,4 L7.00000086,0.251829715" stroke="#e32d00" stroke-width="2" stroke-linecap="round" transform="matrix(-1 0 0 1 10.314788 1)" />
              <path class="heart-lines" d="M27,12 L33,12" stroke="#e32d00" stroke-width="2" stroke-linecap="round" />
              <path class="heart-lines" d="M0,12 L6,12" stroke="#e32d00" stroke-width="2" stroke-linecap="round" transform="matrix(-1 0 0 1 7 1)" />
              <path class="heart-lines" d="M24,19 L28.6852129,22.7481703" stroke="#e32d00" stroke-width="2" stroke-linecap="round" />
              <path class="heart-lines" d="M4.314788,19 L9.00000086,22.7481703" stroke="#e32d00" stroke-width="2" stroke-linecap="round" transform="matrix(-1 0 0 1 14.314788 1)" />
            </g>
          </svg> */}
          <svg id="likeIcon" style={{ marginRight: '25px', marginTop: '10px' }} class={`w-8 h-10 focus:outline-none transition-all duration-300 ease-in-out transform ${isInWishlist ? 'text-blue-500 animate-heartbeat' : 'text-gray-500'
            }`} stroke={isInWishlist ? '#6ACDE9' : 'gray'} fill={isInWishlist ? '#6ACDE9' : 'none'} stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.318 6.318a4.5 4.5 0 010-6.364 4.5 4.5 0 016.364 0L12 1.636l1.318-1.318a4.5 4.5 0 016.364 0 4.5 4.5 0 010 6.364L12 14l-7.682-7.682z"></path>
          </svg>

        </div>
        <Carousel>
          {slideImage?.map((item) => {
            return (<img src={item} class="object-cover w-full rounded-br-lg rounded-tl-lg h-auto md:h-full md:w-full " alt="..." />)
          })}
        </Carousel>
      </div>

    </div>
  )
}
