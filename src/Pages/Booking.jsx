import React, { useEffect, useState } from 'react'
import NavbarC from '../Components/NavbarC'
import FooterC from '../Components/FooterC'
import { useDispatch, useSelector } from 'react-redux'
import { Modal } from 'flowbite-react';
import api from '../api/api'
import whatsapp from '../Resources/Whatsapp.png'
import gmail from '../Resources/Gmail.png'
import { useLocation, useNavigate } from 'react-router-dom';
import { createOrder } from '../Store/orderSlice';
import { reset } from '../Store/currentOrderSlice';
import emailjs from '@emailjs/browser'
import { authentication } from '../firebase/config';
import ScrollToTop from '../ScrollToTop';
import { getUserById } from '../Store/userSlice';
// import { useLocation } from 'react-router-dom';



export default function Booking() {
    const {state} = useLocation();
    const dispatch = useDispatch();
    const currOrder = useSelector(state => state.currentOrder.currentOrder);
    const [stateCurrOrder,setStateCurrOrder] = useState()
    const [property,setProperty] = useState()
    const userDetails = useSelector(state => state.user.userDetails);
    const [slideImage,setSlideImage] = useState([])
    const [numberOfNights,setNumberOfNights] = useState()
    const [amenitiesPrice,setAmenitiesPrice] = useState()
    const [openModal, setOpenModal] = useState(false);
    const [price, setPrice] = useState();
    const [roomNumber, setRoomNumber] = useState();
    const [amenityTitle,setAmenityTitle] = useState([])
    const [user,setUser] = useState(null)
    let navigate = useNavigate(); 

    

    useEffect(() => {
        if (state) {
          const { propertyDetails, stateCurrOrders, price, prooms } = state;
          setStateCurrOrder(stateCurrOrders);
          setProperty(propertyDetails);
          setPrice(price);
          setRoomNumber(prooms);
        } else {
          navigate('/'); // Redirect to the home page if state is null
        }
      }, [state]);

      useEffect(() => {
        if (stateCurrOrder?.CheckInDate && stateCurrOrder?.CheckOutDate) {
          const [day, month, year] = stateCurrOrder.CheckInDate.split('/').map(Number);
          const checkInDate = new Date(year, month - 1, day);
          const [day2, month2, year2] = stateCurrOrder.CheckOutDate.split('/').map(Number);
          const checkOutDate = new Date(year2, month2 - 1, day2);
          const differenceInTime = checkOutDate.getTime() - checkInDate.getTime();
          const oneDayInMilliseconds = 1000 * 60 * 60 * 24;
          const numOfNights = Math.round(differenceInTime / oneDayInMilliseconds);
          setNumberOfNights(numOfNights);
        }
      }, [stateCurrOrder, property]);

    

    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
              setUser(currentUser);
            } else {
              setUser(null);
            }
          });
          return () => unsubscribe();
      }, []);

      useEffect(() => {
        if(user) {
          dispatch(getUserById(user.uid))
        }
      },[user]);

    // get property images
    useEffect(()=>{
        getSlideImage()
    },[property])

    const getSlideImage = async()=>{
        try{
            const new_slide_images = await Promise.all(property.currentLocation_images.map(async (id,index) => {
                
                    const result = await api.get(`/api/v1/image/${id}`);
                    return result.data.url;
                
            }));
            setSlideImage(new_slide_images)
        }catch(err){
          console.log(err)
        }
    }
    
    // calculate amenities price and amenity title
    useEffect(()=>{
        
            const totalSum = stateCurrOrder?.amenities.reduce((accumulator, amenity) => {
                return accumulator + (amenity.price * amenity.qty);
              }, 0);
            setAmenitiesPrice(totalSum)
            getAmenityTitle()
        
        
    },[stateCurrOrder])

    const getAmenityTitle = async()=>{
        if (stateCurrOrder && stateCurrOrder.amenities && Array.isArray(stateCurrOrder.amenities)) {
            const amenitytitle = await Promise.all(stateCurrOrder.amenities.map(async (item, index) => {
              const result = await api.get(`/api/v1/amenity/${item.id}`);
              return result.data.title;
            }));
            setAmenityTitle(amenitytitle);
          } else {
            // Handle the case where amenities array is undefined or not iterable
            // For example, set amenityTitle to an empty array or handle it based on your requirements
            setAmenityTitle([]);
            // Or you can display a message or take appropriate action based on your logic
          }
    }

    const WhatsappMessage = () =>{

        let msg = 'Hello+I%27m+'+userDetails.name+'%2C+I+would+like+to+enquire+about+following+property%0D%0AProperty+%3A+'+ stateCurrOrder.Title +'%0D%0ALocation+%3A+'+ stateCurrOrder.Location +'%0D%0ACheckInDate+%3A+'+ stateCurrOrder.CheckInDate + '%0D%0ACheckOutDate+%3A+'+ stateCurrOrder.CheckOutDate +'%0D%0ARoom+Type+%3A+'+ stateCurrOrder.RoomType +'%0D%0ANumber+of+Adult+%3A+'+ stateCurrOrder.adultNumber +'%0D%0ANumber+of+Child+%3A+'+ stateCurrOrder.childNumber +'%0D%0AAmenities+%3A+'+ amenityTitle;


        window.open('https://api.whatsapp.com/send?phone=919136886650&text='+msg, '_blank', 'noreferrer');
        
        const requiredFormatInDate = convertDateFormat(stateCurrOrder.CheckInDate);
        const requiredFormatOutDate = convertDateFormat(stateCurrOrder.CheckOutDate);

        const finalOrder = {
            check_in:new Date(requiredFormatInDate).toISOString(),
            check_out:new Date(requiredFormatOutDate).toISOString(),
            accomodation:stateCurrOrder.RoomType,
            guest:{
                adult:stateCurrOrder.adultNumber,
                children:stateCurrOrder.childNumber
            },
            propertyId:stateCurrOrder.Id,
            userId:user.uid,
            amenities:stateCurrOrder.amenities,
            totalPrice: (price * numberOfNights) + amenitiesPrice
        }

        if(finalOrder.accomodation === "private-rooms") finalOrder.privateRooms = roomNumber;
dispatch(createOrder(finalOrder));
        dispatch(reset());
        navigate('/orders')
    }


    const sendEmail = () => {
        const param = {
            to_name:'yash',
            from_name:'username',
            from_email:'useremail',
            title:stateCurrOrder.Title,
            location:stateCurrOrder.Location,
            checkindate:stateCurrOrder.CheckInDate,
            checkoutdate:stateCurrOrder.CheckOutDate,
            roomtype:stateCurrOrder.RoomType,
            adultnumber:stateCurrOrder.adultNumber,
            childnumber:stateCurrOrder.childNumber,
            amenities:amenityTitle,
        };
    
        emailjs.send('service_xocsixq', 'template_5jokq89', param, 'hxrJoDY6Iai13B0RZ')
          .then((result) => {

          }, (error) => {
              console.log(error.text);
          });

          const requiredFormatInDate = convertDateFormat(stateCurrOrder.CheckInDate);
          const requiredFormatOutDate = convertDateFormat(stateCurrOrder.CheckOutDate);
  
          const finalOrder = {
              check_in:new Date(requiredFormatInDate).toISOString(),
              check_out:new Date(requiredFormatOutDate).toISOString(),
              accomodation:stateCurrOrder.RoomType,
              guest:{
                  adult:stateCurrOrder.adultNumber,
                  children:stateCurrOrder.childNumber
              },
              propertyId:stateCurrOrder.Id,
              userId: user.uid,
              amenities:stateCurrOrder.amenities,
              totalPrice: (price * numberOfNights) + amenitiesPrice
          }
          
          if(finalOrder.accomodation === "private-rooms") finalOrder.privateRooms = roomNumber;

          dispatch(createOrder(finalOrder));
          dispatch(reset());

          navigate('/orders')
      };

    const convertDateFormat = (inputDate) => {
        const dateComponents = inputDate.split('/');
      
        if (dateComponents.length !== 3) {
          throw new Error('Invalid date format. Please use dd/mm/yyyy.');
        }
      
        const day = dateComponents[0];
        const month = dateComponents[1];
        const year = dateComponents[2];
      
        const outputDate = `${month}/${day}/${year}`;
      
        return outputDate;
      }

      if(state === null){
        navigate('/')
    }
  return (
    <div>
        <ScrollToTop />
        <div className="text-center bg-[#B4E2EF] py-2 md:font-medium text-[10px] md:text-base">
        Book your comfortable rooms, even before 60 mins before the check in!
      </div>
        <NavbarC/>
        <div class="container mx-auto px-5 py-2 lg:px-20 lg:my-5">
            <div className='flex gap-x-2 flex-col md:flex-row'>
                <div className='md:w-2/3 p-4 rounded border-2 border-[#6ACDE9]'>
                    <div class="-m-1 flex flex-wrap md:-m-2">
                        <div class="flex w-1/2 flex-wrap">
                            <div class="w-full p-1 md:p-2">
                                <img
                                alt="gallery"
                                class="block h-full w-full rounded-lg object-cover object-center"
                                src={slideImage[0]} />
                            </div>
                        </div>
                        <div class="flex w-1/2 flex-wrap">
                            <div class="w-1/2 p-1 md:p-2">
                                <img
                                alt="gallery"
                                class="block h-full w-full rounded-lg object-cover object-center"
                                src={slideImage[1]} />
                            </div>
                            <div class="w-1/2 p-1 md:p-2">
                                <img
                                alt="gallery"
                                class="block h-full w-full rounded-lg object-cover object-center"
                                src={slideImage[3]} />
                            </div>
                            <div class="w-1/2 p-1 md:p-2">
                                <img
                                alt="gallery"
                                class="block h-full w-full rounded-lg object-cover object-center"
                                src={slideImage[4]} />
                            </div>
                            <div class="w-1/2 p-1 md:p-2">
                                <img
                                alt="gallery"
                                class="block h-full w-full rounded-lg object-cover object-center"
                                src={slideImage[5]} />
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <h1 className='font-medium md:text-xl'>{stateCurrOrder?.Title}</h1>
                        <h1 className='text-lg'>{stateCurrOrder?.Location}</h1>
                        <h1 className='text-lg'>Type : {stateCurrOrder?.RoomType}</h1>
                        <h1 className='text-lg'>Total guest : {stateCurrOrder?.adultNumber + stateCurrOrder?.childNumber}</h1>
                        <h1 className='text-lg'>Adult : {stateCurrOrder?.adultNumber}, Children : {stateCurrOrder?.childNumber}</h1>
                        <div className='flex'>
                            <div className='w-1/2 pr-2 py-2 text-white font-medium'><div className='bg-[#6ACDE9] md:text-xl p-4 rounded-lg '><h1 className=''>Check In Date</h1>{stateCurrOrder?.CheckInDate}</div></div>
                            <div className='w-1/2 pl-2 py-2 text-white font-medium'><div className='bg-[#6ACDE9] md:text-xl p-4 rounded-lg '><h1 className=''>Check Out Date</h1>{stateCurrOrder?.CheckOutDate}</div></div>
                        </div>
                    </div>
                </div>
                <div className='md:w-1/3 rounded border-2 border-[#6ACDE9]'>
                    <div className='p-4 border-b-2'>
                        <h1 className='text-xl text-[#949494] font-medium'>Price Details</h1>
                    </div>
                    <div className='p-4 border-b-2 flex justify-between items-center'>
                        <div><h1 className='text-lg font-medium'>Stay Amount</h1><h1>{stateCurrOrder?.adultNumber} Adults x {numberOfNights} Nights</h1></div>
                        <div><h1 className='text-[#268F43] font-bold'>RS {price * numberOfNights}/-</h1></div>
                    </div>
                    <div className='p-4 border-b-2 flex justify-between items-center'>
                        <div><h1 className='text-lg font-medium'>Total Service Charges</h1><h1>( {stateCurrOrder?.amenities.length} Items)</h1></div>
                        <div><h1 className='text-[#268F43] font-bold'>RS {amenitiesPrice} /-</h1></div>
                    </div>
                    <div className='p-4 border-b-2 flex justify-between items-center'>
                        <div><h1 className='text-lg font-medium'>Amount to be Paid</h1></div>
                        <div><h1 className='text-[#268F43] font-bold'>RS {(price * numberOfNights) + amenitiesPrice}/-</h1></div>
                    </div>
                    <div className='p-4 border-b-2'>
                    <button onClick={() => setOpenModal(true)} className=' bg-[#F79489] w-full md:text-xl text-xl py-2 rounded font-medium text-white'>Book Now</button>
                    </div>
                    <div className='p-4'>
                        <h1 className='font-medium'>Our Team will shortly contact you with the
availabilty of our Homestays</h1>
                    </div>
                </div>

            </div>
            
        </div>
        <FooterC/>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)} popup>
    <Modal.Header></Modal.Header>
    <Modal.Body>
        <div className=" w-full">
            <h1 className='font-medium text-center text-lg underline decoration-[#F79489] underline-offset-8 decoration-4'>Send Booking Request</h1>
            <div className='flex gap-x-2 mt-4 flex-row   '>
                <div className='w-1/2 p-4 rounded border-2 border-[#6ACDE9] cursor-pointer' onClick={WhatsappMessage}>
                    <div className='text-center p-2  grid justify-items-center '>
                        <h1 className='text-xl font-medium'>Whatsapp</h1>
                        <img src={whatsapp} className='w-2/3 ' />
                        <h1>Quicker Response</h1>
                        <h1>(Recommended)</h1>
                    </div>
                </div>
                <div className='w-1/2 p-4 rounded border-2 border-[#6ACDE9] cursor-pointer' onClick={sendEmail}>
                    <div className='text-center p-2  grid justify-items-center '>
                        <h1 className='text-xl font-medium'>G-mail</h1>
                        <img src={gmail} className='w-2/3 ' />
                        <h1>Response within 24 hours</h1>Hello
                        {/* <h1>(Recommended)</h1> */}
                    </div>
                </div>
                
            </div>
         

        
        
        
        
        
        
        </div>
    </Modal.Body>
    
  </Modal>
    </div>
  )
}