import React, { useEffect, useState } from 'react'
import Search from '../Components/Search'
import Navbar from '../Components/NavbarC'
import Banner from '../Components/Banner'
import Social from '../Components/Social'
import SearchMobile from '../Components/SearchMobile'
import Listing from '../Components/Listing'
import Reviews from '../Components/Reviews'
import Query from '../Components/Query'
import About from '../Components/About'
import FooterC from '../Components/FooterC'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { getAllProperties } from '../Store/propertySlice'

export default function Home() {
  const dispatch = useDispatch();
  const properties = useSelector(state => state.property.allProperties);
  const [dropdownArray, setDropdownArray] = useState([])


  useEffect(() => {
    dispatch(getAllProperties());
  }, [dispatch]);

  useEffect(() => {
    if (properties.length > 0) {
      const dropdownArray = properties.map((property) => {
        return {
          title: property.title,
          location: property.location,
          id: property._id,
        };
      });
      setDropdownArray(dropdownArray);
    }
  }
    , [properties]);

  return (
    <>
      <div className="text-center bg-[#B4E2EF] py-2 md:font-medium text-[10px] md:text-base">
        Book your comfortable rooms, even before 60 mins before the check in!
      </div>
      <Navbar />
      <Social />
      <Banner />
      <Search dropdownArray={dropdownArray} />
      <SearchMobile dropdownArray={dropdownArray} />
      <div className='bg-white'>
        <Listing properties={properties} />
        <Reviews />
        <Query />
      </div>
      <About />
      <FooterC />
    </>

  )
}
