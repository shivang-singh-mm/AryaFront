import React, { useEffect, useState } from 'react'
import api from '../api/api';
import { authentication } from '../firebase/config';
import HomeCard2 from './HomeCard2';

export default function Listing({ properties }) {

  const [wishlist, setWishList] = useState([])
  const [user, setUser] = useState();
  useEffect(() => {
    const unsubscribe = authentication.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);

        try {
          // Fetch wishlist or perform other actions that depend on the user
          const wishlistData = await api.get(`api/v1/user/wishlist/${currentUser.uid}`);
          setWishList(wishlistData.data);

          // Additional actions or API calls related to the current user
          // ...
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


  return (
    <div className='text-black bg-[white]'>
      <div className='container md:py-16 py-10 mx-auto   mx-auto '>
        <div className=' text-center md:text-3xl text-2xl font-bold'>🪄 Our Magical Stays</div>
        <div className='mt-5  px-3 text-center md:text-4xl text-xl font-medium'>"Make choosing <span className='text-[#179FEB]'>Aarya Stays,</span> <span className='text-[#F79489]'>the best decision of your vaccation</span>"</div>
      </div>

      {/* {properties?.map((property, index) => (
        <div className='w-100 md:h-56 h-96 even:bg-[#FABEB7] odd:bg-[#D1EDF5] md:mt-40 md:mt-32 mt-36  relative'>
          <div className={`md:px-0    md:w-2/3  absolute -top-32 ${
              index % 2 === 0 ?   'md:left-20':'md:right-20'
            }`}>
            <div className='md:w-full p-3 bg-white  custom-shadow rounded'>
              <div><HomeCard property={property} wishlist={wishlist}/></div>
            </div>
          </div>
        </div>
      ))} */}

      {properties?.length &&
        properties?.map((property, index) => (
          <div className='w-full md:h-56 h-96 even:bg-[#FABEB7] odd:bg-[#D1EDF5]  md:mt-40 mt-36  relative'>
            <div className={`md:px-0 w-full   md:w-2/3  absolute bottom-5 ${index % 2 === 0 ? 'md:left-20' : 'md:right-20'
              }`}>
              <HomeCard2 property={property} wishlist={wishlist} />
            </div>
          </div>
        ))}






      {/* proper */}

      {/* <div className='w-100 md:h-56 h-96 bg-[#FABEB7] md:mt-40 md:mt-32 mt-32  relative'>

          <div className='md:px-0 px-10   md:w-2/3  absolute -top-32 md:left-20'>
            
            <div className='md:w-full p-3 bg-white  custom-shadow rounded'>
              <div><HomeCard2 ></HomeCard2></div>
            </div>
          </div>
        </div>

        <div className='w-100 md:h-56 h-96 bg-[#FABEB7] md:mt-40 md:mt-52 mt-44  relative'>

          <div className='md:px-0 px-10   md:w-2/3  absolute -top-32 md:right-20'>
            
            <div className='md:w-full p-3 bg-white  custom-shadow rounded'>
              <div><HomeCard2 ></HomeCard2></div>
            </div>
          </div>
        </div> */}






    </div>
  )
}
