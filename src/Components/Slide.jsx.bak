import React, { useState, useEffect, useRef } from "react";
import { Carousel } from "flowbite-react";
import api from "../api/api";
import DummyImgSqr from '../Resources/DummyImgSqr.png'

export default function Slide2({slides}) {
  const [slideDetails,setSlideDetails] = useState([]);


  const getSlideDetails = async()=>{
    
    try{
      const slideDetails = await Promise.all(slides.map(async (id,index) => {
            const result = await api.get(`/api/v1/slide/${id}`);
            return result.data[0];
      }));
      setSlideDetails(slideDetails)
    }catch(err){
      console.log(err)
    }
  }

  useEffect(() => {
    getSlideDetails();
  },[slides]);




  return (
        <Carousel className="h-[500px]" slide={false} indicators={false}>
          {slideDetails.map(slide => {
            const length = slide.images.length;
            return (<div className="dark:text-white h-full">
            <div className="flex justify-between md:mb-10 mb-3 h-1/2">
              {slide.images.map((img, index) => {
                if(index == 0) {
                  return <img src={img.url} className="h-full md:mr-14 md:w-1/3 w-full" />;
                }
                if (index === length - 1) {
                  return (
                    <img src={img.url} className="h-full w-1/3 hidden md:block" />
                  );
                }

                return <img src={img.url} className="h-full w-1/3 md:mr-14 hidden md:block" />;
      
                  
                })}
            </div>
            <div className="border-[#179FEB] border-2 px-4 py-1 leading-6">
              {/* <p className="mb-5">{slide.description}</p> */}
              <p className="text-xs md:text-lg">Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio eius fugiat numquam quas dolorem distinctio voluptate, culpa beatae facilis. Ex fugiat placeat facilis, qui eligendi suscipit quisquam dolorem atque voluptatibus libero. Minus atque similique facere consequatur ipsam distinctio tempore repellat culpa nisi iste voluptas delectus placeat repudiandae, adipisci, aliquam cupiditate, dolorem harum nulla rerum fugit? Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio eius fugiat numquam quas dolorem distinctio voluptate, culpa beatae facilis. Ex fugiat placeat facilis, qui eligendi suscipit quisquam dolorem atque voluptatibus libero. </p>
            </div>
          </div>)
          })} 

          {/* <div className="h-3/4 dark:text-white">
            <div className="flex flex-wrap h-3/4">
              <div className="flex">
                <div className="w-full sm:w-1/3 justify-center">
    
                  <img
                    src={sl1}
                    className="w-full h-auto sm:h-1/2"
                    alt="Image 1"
                  />
                </div>
                <div className="w-full sm:w-1/3 justify-center">
         
                  <img
                    src={sl2}
                    className="w-full h-auto sm:h-1/2 hidden sm:block"
                    alt="Image 2"
                  />
                </div>
                <div className="w-full sm:w-1/3 justify-center">
           
                  <img
                    src={sl3}
                    className="w-full h-auto sm:h-1/2 hidden sm:block"
                    alt="Image 3"
                  />

                </div>
              </div>
            </div>
          </div>
          <div className="h-full dark:text-white">
            <div className="flex flex-wrap">
              <div className="flex">
                <div className="w-full sm:w-1/3 justify-center">
              
                  <img
                    src={sl1}
                    className="w-full h-auto sm:h-1/2"
                    alt="Image 1"
                  />
                </div>
                <div className="w-full sm:w-1/3 justify-center">
                
                  <img
                    src={sl2}
                    className="w-full h-auto sm:h-1/2 hidden sm:block"
                    alt="Image 2"
                  />

                </div>
                <div className="w-full sm:w-1/3 justify-center">
               
                  <img
                    src={sl3}
                    className="w-full h-auto sm:h-1/2 hidden sm:block"
                    alt="Image 3"
                  />
                </div>
              </div>
            </div>
          </div> */}
        </Carousel>
  );
}