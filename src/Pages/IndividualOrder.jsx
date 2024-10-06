import React, { useEffect, useState } from 'react'
import NavbarC from '../Components/NavbarC';
import { useParams } from "react-router-dom";   
import FooterC from '../Components/FooterC';
import info from '../Resources/info.png';
import { useDispatch} from 'react-redux';
import {getOrderById} from '../Store/orderSlice'
import { getPropertyById } from '../Store/propertySlice';
import api from '../api/api'
import { getUserById } from '../Store/userSlice';
import { AiFillStar } from "react-icons/ai";
import { css } from "@emotion/css";
import { Modal,Textarea } from 'flowbite-react';
import { postReview } from '../Store/reviewSlice';
import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'flowbite-react';

const stars = [1, 2, 3, 4, 5];


// const flex = css`
//   margin-top: 50px;
//   display: flex;
//   justify-content: center;
// `;
// const star = css`
//   margin-left: 10px;
//   border: none;
//   background: none;

//   cursor: pointer;
//   :hover {
//     color: yellow;
//   }
// `;




export default function IndividualOrder() {

    

    const routeParams = useParams();
    const routeParamsID = routeParams.id;
    const Validity = routeParams.validity;
    const dispatch = useDispatch();
    const [singleOrder,setSingleOrder] = useState()
    const [property,setProperty] = useState()
    const [amenitiesPrice,setAmenitiesPrice] = useState()
    const [totalPrice,setTotalPrice] = useState()
    const [slideImage,setSlideImage] = useState([])
    const [userName,setUserName] = useState('')
    const [openModal, setOpenModal] = useState(false);
    const [selectedStar, setSelectedStar] = useState();
    const [review,setReview] = useState('');
    const [typeOfModal,setTypeOfModal] = useState();
    const [noCheckInReview,setNoCheckInReview] = useState('');
    const [toolTip2,setToolTip2] = useState([])
    const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname]);

    useEffect(()=>{
        dispatch(getOrderById(routeParamsID)).then(async (data)=>{
            setSingleOrder(data.payload[0])
            const totalSum = data.payload[0].amenities.reduce((accumulator, amenity) => {
                return accumulator + (amenity.price * amenity.qty);
              }, 0);
            setAmenitiesPrice(totalSum)
            dispatch(getPropertyById(data.payload[0].propertyId)).then((data2)=>{
                setProperty(data2.payload)
                setTotalPrice(data2.payload.price + totalSum)
            })
            dispatch(getUserById(data.payload[0].userId)).then((data3)=>{
                setUserName(data3.payload.name)
            })

            const fetchedTooltips = await Promise.all(
                data.payload[0].amenities.map(async (obj) => {
                  const result = await api.get(`/api/v1/amenity/${obj.id}`);
                  return `${result.data.title} x ${obj.qty} = ${result.data.price * obj.qty} Rs`;
                })
              );
          
              setToolTip2((prevToolTip2) => {
                const uniqueTooltips = fetchedTooltips.filter((tooltip) => !prevToolTip2.includes(tooltip));
                return [...prevToolTip2, ...uniqueTooltips];
              });
        })
    },[dispatch])

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

    const PostReview = async()=>{
        const data = {
            userId: singleOrder.userId,
            propertyId: singleOrder.propertyId,
            rating: selectedStar,
            description: review
        }
        dispatch(postReview(data)).then((data)=>{
            
        })
        const result = await api.patch(`/api/v1/order/reviewed/${singleOrder._id}`)
        setSingleOrder(result.data)
        setOpenModal(false)
    }

    const PostNoCheckInReview = () =>{
        const data = {
            orderId: singleOrder._id,
            userId: singleOrder.userId,
            // propertyId: singleOrder.propertyId,
            // rating: selectedStar,
            description: review
            }

    }


    const renderList = (
        <div>
        {toolTip2.map((item, index) => (
            <h1 key={index}>{item}</h1>
          ))}
        </div>
         
      );
    

  return (
    <>
    <div className="text-center bg-[#B4E2EF] py-2 md:font-medium text-[10px] md:text-base">
        Book your comfortable rooms, even before 60 mins before the check in!
      </div>
        <NavbarC/>
        <div className="md:mx-20 mx-5 my-4">
            <div className='flex gap-x-4 flex-col md:flex-row '>
                <div className=' md:w-1/3 '>
                    <div className='rounded-lg border-[#6ACDE9] border-2 py-3 px-4'>
                        <h1 className='font-bold text-2xl'>Your Booking</h1>
                        <img class="h-auto max-w-full rounded-lg mt-2" src={slideImage[0]} ></img>
                        <h1 className='md:text-2xl text-xl font-medium mt-2'>{property?.title}</h1>
                        <div className='flex justify-between'>
                            <div className='text-md md:text-lg'>{property?.location}</div>
                            {/* <div className='text-[#F79489] text-md md:text-lg'>Type</div> */}
                        </div>
                        <div className='mt-1'>Booking ID : {routeParamsID}</div>
                        <div className='mt-1'>{userName}  + {singleOrder?.guest.adult + singleOrder?.guest.children - 1} guest</div>
                        <div className='mt-1'>1 x {singleOrder?.accomodation}</div>
                        <div className='flex gap-x-2 mt-1'>
                            <div className='w-1/2 rounded-lg text-white bg-[#6ACDE9] p-2'>
                                <h1>Check In</h1>
                                <h1>{new Date(singleOrder?.check_in).toDateString()}</h1>
                            </div>
                            <div className='w-1/2 rounded-lg text-white bg-[#6ACDE9] p-2'>
                                <h1>Check out</h1>
                                <h1>{new Date(singleOrder?.check_out).toDateString()}</h1>
                            </div>
                        </div>
                    </div>
                </div>
                <div className=' md:w-2/3 mt-2 md:mt-0'>
                    {/* new condition would be Validity == 'past' && reviewed == false && !singleOrder?.reviewed  */}
                    <div className={Validity=='past' && !singleOrder?.reviewed ? ' rounded-lg border-2 border-[#6ACDE9] p-4 ' : 'rounded-lg border-2 border-[#6ACDE9] p-4 hidden'}>
                        <div><h1 className='font-bold text-xl md:text-2xl'>Did you Check-In this Hotel ?</h1></div>
                        <div className='flex gap-x-4 text-white mt-2 text-center'>
                            <div onClick={() => {setOpenModal(true); setTypeOfModal(1)}} className='w-1/2 bg-[#F79489] cursor-pointer rounded-lg p-4 md:text-lg'>Yes, I did.</div>
                            <div onClick={() => {setOpenModal(true); setTypeOfModal(2)}} className='w-1/2 bg-[#F79489] cursor-pointer rounded-lg p-4 md:text-lg'>No, I didn't.</div>
                        </div>
                    </div>
                    <h1 className='text-xl md:text-2xl font-bold mt-2 md:mb-2'>Booking Details</h1>
                    <div className='rounded-lg border-2 border-[#6ACDE9] p-4'>
                        <div className='flex flex-col md:flex-row gap-x-2'>
                            <div className='md:w-1/2'>
                                <h1 className='text-lg md:text-xl md:font-medium md:mb-2'>Pricing Details</h1>
                                <div className='rounded-lg border-2 border-[#C4C4C4] p-4'>
                                    <div className='flex justify-between'>
                                        <div className='flex items-center'><i class="fa fa-info-circle mr-2" aria-hidden="true"></i><h1 className='md:text-lg'>Room Price</h1></div>
                                        <div className='md:text-lg'> RS {property?.price}/-</div>
                                    </div>
                                    <div className='flex justify-between mt-2'>
                                    
                                        <div className='flex items-center'><Tooltip content={renderList} style="dark"><i class="fa fa-info-circle mr-2" aria-hidden="true"></i></Tooltip><h1 className='md:text-lg'>Service Charges</h1></div>
                                        
                                        <div className='md:text-lg'> RS {amenitiesPrice}/-</div>
                                    </div>
                                    <hr className='mt-3 md:block hidden'></hr>
                                    <div className='flex justify-between mt-2 md:text-lg'>
                                        <h1>Total Price</h1>
                                        <h1 className='text-lime-600'>RS {totalPrice}/-</h1>
                                    </div>
                                </div>
                            </div>
                            <div className='md:w-1/2'>
                                <h1 className='text-lg md:text-xl mt-2 md:font-medium md:mt-0 md:mb-2'>Hotel Contact</h1>
                                <div className='rounded-lg border-2 border-[#C4C4C4] p-4'>
                                    <div className='flex items-center'><i class="fa fa-envelope mr-2 text-xl" aria-hidden="true"></i><h1 className='text-lg'>Write Aarya Stays at:</h1></div>
                                    <h1>Email Id</h1>
                                    <div className='flex items-center mt-2'><i class="fa fa-phone mr-2 text-xl" aria-hidden="true"></i><h1 className='text-lg'>Call Aarya Stays at:</h1></div>
                                    <h1>Phone Number</h1>
                                </div>
                            </div>
                        </div>
                        <div class="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                            {
                                slideImage.map((item,index)=>{
                                    if(index < 5)
                                    return(
                                        <div>
                                            <img class="h-full max-w-full rounded-lg" src={item} alt=""/>
                                        </div>
                                    )
                                })
                            }
                            <div className='border-2 rounded-lg border-[#F79489] flex justify-center items-center'>
                                <Link to={`/gallery/${property?._id}`}  className=''>See more</Link>
                            </div>
                            
                        </div>
                    </div>
                </div>
                
            </div>
            <div className='rounded-lg border-2 border-[#F79489] md:py-2 md:px-6 p-2 mt-6'>
                <h1 className='md:text-2xl text-xl md:font-bold font-medium'>Cancellation Policy</h1>
                <ul class="list-disc px-5 md:mt-2">
                    <li>Policy one</li>
                    <li>Policy one</li>
                    <li>Policy one</li>
                </ul>

            </div>
        </div>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
            {typeOfModal == 1 ? <><Modal.Header>Hey {userName}! PLease Leave us a Review</Modal.Header>
        <Modal.Body>

            <div className='flex'>
                <div className='flex  items-center'>
                    <h1 className='text-xl font-medium'>Overall Rating : </h1>
                </div>
                <div  className='flex justify-center '>
                    {stars.length > 0 && stars.map((starNum) => (
                        <button
                        type="button"
                        key={starNum}
                        onClick={() => setSelectedStar(starNum)}
                        className='ml-3 border-0 bg-transparent cursor-pointer hover:text-yellow-400'
                        >
                        <AiFillStar
                            className={selectedStar === starNum || selectedStar > starNum? `text-yellow-400 text-4xl` : `text-gray-400  text-4xl`}
                        />
                        </button>
                    ))}
                </div>
            </div>
        
            <div className='mt-4'>
                <h1 className='text-md'>Write a Review</h1>
                <Textarea id="comment" placeholder="Leave a comment..." className='mt-2' value={review} onChange={(e)=>{setReview(e.target.value)}} required rows={4} />
            </div>
            

        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => PostReview()} className='border-2 border-[#C4C4C4] bg-[#F79489] rounded-lg px-6 py-2 hover:bg-[#F79489] text-white'>Post</button>
          <button onClick={() => setOpenModal(false)} className='border-2 border-[#C4C4C4]  rounded-lg px-6 py-2 hover:bg-[#ECEBEB]'>
            Cancel
          </button>
        </Modal.Footer></>:
        <>
            <Modal.Header>Hey {userName}! Tell us what happened, we will try to help you</Modal.Header>
            <Modal.Body>
            <div className=''>
                <h1 className='text-md'>Write a Review</h1>
                <Textarea id="comment" placeholder="Leave a comment..." className='mt-2' value={noCheckInReview} onChange={(e)=>{setNoCheckInReview(e.target.value)}} required rows={6} />
            </div>
            

        </Modal.Body>
        <Modal.Footer>
          <button onClick={() => PostNoCheckInReview()} className='border-2 border-[#C4C4C4] bg-[#F79489] rounded-lg px-6 py-2 hover:bg-[#F79489] text-white'>Post</button>
          <button onClick={() => setOpenModal(false)} className='border-2 border-[#C4C4C4]  rounded-lg px-6 py-2 hover:bg-[#ECEBEB]'>
            Cancel
          </button>
        </Modal.Footer>
        </> }
        
      </Modal>
      
        <FooterC/>

    </>
  )
}
