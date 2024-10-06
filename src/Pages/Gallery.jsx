import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import NavbarC from '../Components/NavbarC'
import { Carousel } from 'flowbite-react'
import { useSelector,useDispatch } from 'react-redux';
import { getPropertyById } from '../Store/propertySlice';
import api from '../api/api';
import FooterC from '../Components/FooterC';
import { useLocation } from 'react-router-dom';

export default function Gallery() {
    const routeParams = useParams();
  const routeParamsID = routeParams.id;
  const dispatch = useDispatch();
  const property = useSelector((state) => state.property.propertyById);
  const [slideImage,setSlideImage] = useState([])

  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname]);

  useEffect(()=>{
    dispatch(getPropertyById(routeParamsID)).then((data)=>{
        getSlideImage(data.payload.currentLocation_images)
    })
  },[])


  const getSlideImage = async(data)=>{
    try{
      const new_slide_images = await Promise.all(data.map(async (id,index) => {
            const result = await api.get(`/api/v1/image/${id}`);
            return result.data.url;
      }));
      setSlideImage(new_slide_images)

    }catch(err){
      console.log(err)
    }
  }

//   comment out this for scroll
  useEffect(() => {
    const imgElement = document.querySelector('[data-testid="carousel-item"] img');
  
      if (imgElement) {
        imgElement.classList.remove('absolute', 'top-1/2', 'left-1/2', 'block', 'w-full', '-translate-x-1/2', '-translate-y-1/2');
      }
  }, [slideImage]);

  return (
    <>
    <div className="text-center bg-[#B4E2EF] py-2 md:font-medium text-[10px] md:text-base">
        Book your comfortable rooms, even before 60 mins before the check in!
      </div>
    <NavbarC/>
    <h1 className='text-center text-3xl font-bold'>{property.title}</h1>
    <div className='md:mx-20  md:h-[550px] h-[250] mt-4 mx-2 custom-slider rounded-lg mb-4'>
        <Carousel>
        {slideImage?.map((item)=>{
              return(<img src={item} class="object-cover w-full rounded-br-lg rounded-tl-lg h-auto md:h-full md:w-full "  alt="..." />)
            })}
        </Carousel>
    </div>
    <FooterC/>






</>
  )
}
