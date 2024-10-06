import React, { useEffect, useState } from "react";
import api from "../api/api";
import { useDispatch, useSelector } from "react-redux";
import { getUserById } from "../Store/userSlice";
import { Link } from "react-router-dom";

const OrderCard = ({order, validity}) => {
  const dispatch = useDispatch();
  const userDetails = useSelector(state => state.user.userDetails);
  const [property, setProperty] = useState();
  const [image, setImage] = useState();
  const [amenitiesPrice, setAmenitiesPrice] = useState();

  const getPropertyById = async (id) => {
    const property = await api.get(`api/v1/property/${id}`);
    const data = property.data;
    setProperty(data);
  }

  const getImageById = async (id) => {
    const image = await api.get(`api/v1/image/${id}`);
    const data = image.data;
    setImage(data);
  }

  const formatString = (inputString) => {
    // Remove "-" from the string
    const stringWithoutDash = inputString.replace(/-/g, ' ');
  
    // Capitalize the first letter
    const formattedString = stringWithoutDash.charAt(0).toUpperCase() + stringWithoutDash.slice(1);
  
    return formattedString;
  }

  const formatDate = (isoDateString) => {
    const dateObject = new Date(isoDateString);
  
    const formattedDateString = dateObject.toLocaleDateString('en-IN',{weekday:"long", year:"numeric", month:"short", day:"numeric"});
  
    return formattedDateString;
  }
  
  const getTotalGuest = () => {
    const guests = order.guest.adult + order.guest.children - 1;
    return guests;
  }

  // const getStayCity = () => {
  //   const locationArr = property?.location.split(',');
  //   return locationArr[locationArr.length-1];
  // }
  

  useEffect(() => {
    if(property){
      getImageById(property.currentLocation_images[0]);
    }
  },[property]);

  useEffect(()=>{
    const totalSum = order.amenities.reduce((accumulator, amenity) => {
        return accumulator + (amenity.price * amenity.qty);
      }, 0);
    setAmenitiesPrice(totalSum);
    getPropertyById(order.propertyId);
    dispatch(getUserById(order.userId));
  },[])

  return (
    <div className="flex flex-col  bg-white  md:flex-row md:p-5 mt-3 ">
      <div className="img-border p-2 md:w-1/4 md:h-80   ">
        <img
          class="object-cover w-full rounded-br-lg rounded-tl-lg h-auto md:h-full md:w-full  "
          src={image?.url}
          alt=""
        />
      </div>
      <div className=" md:w-3/4 md:h-80 ">
        <div className="md:ml-5 border-2 h-full  border-slate-200 flex flex-col">
          <div className="md:flex-1 border-2 border-slate-200 md:px-10 p-4 justify-center flex-col flex">
            <div className="flex justify-between ">
              <h1 className="font-medium md:text-3xl text-xl">
                {property?.title}
              </h1>{" "}
              
              <Link to={`/booking/${validity}/${order._id}`}>
              <div className="rounded-lg bg-[#F79489] h-full flex items-center text-white md:p-2 md:px-4 hidden md:block">
                <div>
                  VIEW BOOKING
                </div>
                </div>
              </Link>
              
            </div>
            <span className="md:text-lg text-[#8E8E8E]">
              <i className="fa  fa-map-marker text-[#6ACDE9] md:text-xl text-lg"></i>{" "}
              {property?.location}
            </span>
            <ul className="flex flex-col md:flex-row gap-x-8 md:text-lg md:list-disc list-none mt-2">
              <div className={order.status == 'accepted' ?'text-green-500 font-medium' : 'text-red-500 font-medium'}>
                {order.status.charAt(0).toUpperCase() + order.status.slice(1)} {/*Add status here */}
              </div>
              <li><b className="font-medium">Booking Id</b> - {order._id}</li>
            </ul>
          </div>
          <div className="flex-1 border-2 border-slate-200 md:px-10 p-3 justify-center flex-col flex">
            <div className="flex md:gap-x-10 gap-5">
              <div>
                <h1 className="md:text-xl text-[#797979]">Check In</h1>
                <h1 className="font-medium">{formatDate(order.check_in)}</h1>
              </div>
              <div>
                <h1 className="md:text-xl  text-[#797979]">Check Out</h1>
                <h1 className="font-medium">{formatDate(order.check_out)}</h1>
              </div>
              <div>
                <h1 className="font-medium md:text-xl  ">1 X {formatString(order.accomodation)}</h1>
                <h1>{userDetails.name} {getTotalGuest() == 0 ? "" :`+ ${getTotalGuest()} Guests`} </h1>
              </div>
            </div>
            <div className="flex  items-center mt-3">
              <h1 className="font-medium md:text-xl">Amount </h1>
              <span className="py-1 px-2 ml-2 border-2 rounded-lg border-green-500 text-green-500 font-medium">
                {order.totalPrice}
              </span>
              <Link to={`/booking/${validity}/${order._id}`}>
                <button className="rounded-lg bg-[#F79489] text-white px-4 py-1 ml-2  md:hidden">
                  VIEW BOOKING
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
