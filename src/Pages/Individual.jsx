import React, { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import NavbarC from "../Components/NavbarC";
// import aboutspace from "../Resources/aboutspace.png";
import Reviews from "../Components/Reviews";
import Query from "../Components/Query";
import About from "../Components/About";
import FooterC from "../Components/FooterC";
import Slide from "../Components/Slide";
import Bin from "../Resources/Bin.png";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getPropertyById } from "../Store/propertySlice";
import { useEffect } from "react";
import IndividualCard from "../Components/IndividualCard";
import { getHeadingImages, getImageById } from "../Store/imageSlice";
import DummyImgSqr from "../Resources/DummyImgSqr.png";
import { getSingleCard } from "../Store/cardSlice";
import api from "../api/api";
import ReactFlipCard from "reactjs-flip-card";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { authentication } from "../firebase/config";

import { Dropdown, Datepicker, Modal } from "flowbite-react";
import { updateOrder } from "../Store/currentOrderSlice";
import AddOn from "../Components/AddOn";
import IndividualCard2 from "../Components/IndividualCard2";
import { useLocation } from "react-router-dom";
import hd720 from "../Resources/hd720.png";
import hd300 from "../Resources/hd300.png";
import { Carousel } from "flowbite-react";
import ReadMore from "../Components/ReadMore";

export default function Individual() {
  const routeParams = useParams();
  const routeParamsID = routeParams.id;
  const [showOnDemand, setShowOnDemand] = useState(false);

  const dispatch = useDispatch();
  const property = useSelector((state) => state.property.propertyById);
  const currOrder = useSelector((state) => state.currentOrder.currentOrder);
  const heading_img = useSelector((state) => state.image.headingImage);
  const [price, setPrice] = useState();
  const [finalPrice, setFinalPrice] = useState();
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [essentialAmenities, setEssentialAmenities] = useState([]);
  const [extraAmenities, setExtraAmenities] = useState([]);
  const [addedOnDemand, setAddedOnDemand] = useState(new Set());
  const [amenitiesPrice, setAmenitiesPrice] = useState();
  const [allEvents, setAllEvents] = useState([]);
  const [headingImage, setHeadingImage] = useState("");
  const [checkInDate, setCheckInDate] = useState(currOrder?.CheckInDate);
  const [roomType, setRoomType] = useState(currOrder?.RoomType);
  const [checkOutDate, setCheckOutDate] = useState(currOrder?.CheckOutDate);
  const [aboutspace, setAboutspace] = useState("");
  const [slideImage, setSlideImage] = useState([])
  const [roomNumber, setRoomNumber] = useState(1)


  // const { pathname } = useLocation();

  // useEffect(() => {
  //   window.scrollTo(0, 0)
  // }, [pathname]);

  useEffect(() => {
    dispatch(updateOrder({ key: "Id", value: routeParamsID }));
    if (!("CheckInDate" in currOrder)) {

      const checkin = new Date();
      checkin.setDate(new Date().getDate() + 2);
      const checkout = new Date();
      checkout.setDate(new Date().getDate() + 3);

      setCheckInDate(`${checkin.getDate()}/${checkin.getMonth() + 1}/${checkin.getFullYear()}`);
      dispatch(updateOrder({ key: 'CheckInDate', value: `${checkin.getDate()}/${checkin.getMonth() + 1}/${checkin.getFullYear()}` }))
      setCheckOutDate(`${checkout.getDate()}/${checkout.getMonth() + 1}/${checkout.getFullYear()}`);
      dispatch(updateOrder({ key: 'CheckOutDate', value: `${checkout.getDate()}/${checkout.getMonth() + 1}/${checkout.getFullYear()}` }))
      dispatch(updateOrder({ key: 'adultNumber', value: 2 }))
      dispatch(updateOrder({ key: 'childNumber', value: 1 }))

    }
    dispatch(getPropertyById(routeParamsID)).then((data) => {
      dispatch(updateOrder({ key: "Title", value: data.payload.title }));
      dispatch(updateOrder({ key: "Location", value: data.payload.location }));
      dispatch(
        updateOrder({ key: "RoomType", value: data.payload.roomType[0] })
      );
      setPrice(data.payload.price);
      // getSlideImage();
      getAmenities(data.payload.amenities);
      getEvents(data.payload.events);
      dispatch(getHeadingImages(data.payload.currentLocation_images[0])).then(
        (data) => {
          setHeadingImage(data.payload.url);
        }
      );
      dispatch(getImageById(data.payload.ats_image)).then((data) => {
        setAboutspace(data.payload.url);
      });
    });
  }, [dispatch]);

  useEffect(() => {
    getSlideImage();
  }, [property])

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

  useEffect(() => {
    if (roomType === "full-property") {
      const events = allEvents?.filter(event => event.type === "full-property");
      setFilteredEvents(events);
    } else if (roomType === "private-rooms") {
      const events = allEvents?.filter(event => event.type === "private-rooms");
      setFilteredEvents(events);
    } else {
      const events = allEvents?.filter(event => event.type === "dorm-beds");
      setFilteredEvents(events);
    }
  }, [allEvents, roomType]);

  useEffect(() => {
    if (checkInDate) {
      overLap();
    }
  }, [filteredEvents, checkInDate]);



  const getAmenities = async (prop) => {
    try {
      const new_amenities = await Promise.all(
        prop.map(async (id, index) => {
          const result = await api.get(`/api/v1/amenity/${id}`);
          return result.data;
        })
      );
      const essential = new_amenities.filter(
        (amenity) => amenity.type === "essential"
      );
      const extra = new_amenities.filter((amenity) => amenity.type === "extra");
      setEssentialAmenities(essential);
      setExtraAmenities(extra);
    } catch (err) {
      console.log(err);
    }
  };

  const getEvents = async (events) => {
    const fethcedEvents = await Promise.all(
      events.map(async (id) => {
        const result = await api.get(`/api/v1/event/${id}`);
        return result.data;
      })
    );
    setAllEvents(fethcedEvents);
  }

  const overLap = () => {
    const [day, month, year] = checkInDate.split("/");
    for (let i = 0; i < filteredEvents.length; i++) {
      const d1 = new Date(filteredEvents[i].start);

      const d2 = new Date(year, month - 1, day);
      d2.setSeconds(d2.getSeconds() + 2);

      const d3 = new Date(filteredEvents[i].end);

      const d4 = new Date(year, month - 1, day);
      d4.setDate(d4.getDate() + 1);
      d4.setSeconds(d4.getSeconds() - 2);
      if ((d1 <= d2 && d2 <= d3) || (d1 <= d4 && d4 <= d3)) {
        setPrice(filteredEvents[i].title);
        return;
      }
    }
    setPrice(property.price);
  }

  const addOnDemand = (item) => {
    const obj = {
      id: item._id,
      price: item.price,
      qty: 1,
    };
    const arr = currOrder.amenities;
    const isNewObjArray = !arr.some((obj2) => obj2.id === obj.id);
    //add obj in arr
    if (isNewObjArray) {
      dispatch(updateOrder({ key: "amenities", value: [...arr, obj] }));
      setAddedOnDemand((prev) => new Set([...prev, item]));
    }

    setShowOnDemand(true);
  };

  const removeAddedItem = (item) => {
    const updatedValues = new Set(addedOnDemand);
    //i want to delete the object from amenities array

    const newAmenities = currOrder.amenities.filter((amenity) => {
      return amenity.id !== item._id;
    });
    dispatch(updateOrder({ key: "amenities", value: newAmenities }));

    updatedValues.delete(item);
    setAddedOnDemand(updatedValues);
    if (updatedValues.size == 0) {
      setShowOnDemand(false);
    }
  };



  // Search component logic


  useEffect(() => {
    setRoomType(currOrder.RoomType);
    const totalSum = currOrder.amenities.reduce((accumulator, amenity) => {
      return accumulator + amenity.price * amenity.qty;
    }, 0);
    setAmenitiesPrice(totalSum);

    if (currOrder.amenities.length > 0) {
      setShowOnDemand(true);
      getAlreadyAddedAmenity(currOrder.amenities);
    }
  }, [currOrder]);



  const getAlreadyAddedAmenity = async (prop) => {
    const new_amenities = await Promise.all(
      prop.map(async (item, index) => {
        const result = await api.get(`/api/v1/amenity/${item.id}`);
        return result.data;
      })
    );
    setAddedOnDemand(new_amenities);
  };

  const handleCheckIn = (date) => {
    setCheckInDate(
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
    dispatch(
      updateOrder({
        key: "CheckInDate",
        value:
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear(),
      })
    );
  };

  const handleCheckOut = (date) => {
    setCheckOutDate(
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
    dispatch(
      updateOrder({
        key: "CheckOutDate",
        value:
          date.getDate() +
          "/" +
          (date.getMonth() + 1) +
          "/" +
          date.getFullYear(),
      })
    );
  };

  const [adultNumber, setAdultNumber] = useState(
    currOrder.adultNumber ? currOrder.adultNumber : 2
  );
  const incrAdult = () => {
    setAdultNumber(adultNumber + 1);
    dispatch(updateOrder({ key: "adultNumber", value: adultNumber + 1 }));
  };
  const decrAdult = () => {
    if (adultNumber > 0) {
      setAdultNumber(adultNumber - 1);
      dispatch(updateOrder({ key: "adultNumber", value: adultNumber - 1 }));
    }
  };

  const incrRooms = () => {
    setRoomNumber(roomNumber + 1);
    // dispatch(updateOrder({ key: "adultNumber", value: adultNumber + 1 }));
  };
  const decrRooms = () => {
    if (roomNumber > 0) {
      setRoomNumber(roomNumber - 1);
      // dispatch(updateOrder({ key: "adultNumber", value: adultNumber - 1 }));
    }
  };

  const [childNumber, setChildNumber] = useState(
    currOrder.childNumber ? currOrder.childNumber : 1
  );
  const incrChild = () => {
    setChildNumber(childNumber + 1);
    dispatch(updateOrder({ key: "childNumber", value: childNumber + 1 }));
  };
  const decrChild = () => {
    if (childNumber > 0) {
      setChildNumber(childNumber - 1);
      dispatch(updateOrder({ key: "childNumber", value: childNumber - 1 }));
    }
  };

  const calculateFinalPrice = () => {
    if (!roomType) return;

    if (roomType === "full-property") {
      const maxAdults = property.bhk * 2;
      const extraAdults = adultNumber - maxAdults;
      const extraFees = extraAdults > 0 ? extraAdults * 500 : 0;
      setFinalPrice(price + extraFees);
    } else if (roomType === "dorm-beds") {
      const adultFee = adultNumber * price;
      const childrenBed = childNumber % 2 === 0 ? childNumber / 2 : Math.ceil(childNumber / 2);
      const childFee = childrenBed * price;
      setFinalPrice(adultFee + childFee);
    } else {
      setFinalPrice(price * roomNumber)
    }
  }


  const handleRoomType = (type) => {
    setRoomType(type);
    dispatch(updateOrder({ key: "RoomType", value: type }));
  };

  const myRef = useRef(null);

  const executeScroll = () => myRef.current.scrollIntoView();

  const [amenitesInfo, setAmenitiesInfo] = useState();
  const [openModal, setOpenModal] = useState(false);

  const showAmenitiesInfo = (data) => {
    setOpenModal(true);
    setAmenitiesInfo(data);
  }

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

  let navigate = useNavigate();

  const [user, setUser] = useState(null)
  const navigateToBook = () => {
    // if (user) {
    const checkOutDateParts = checkOutDate.split('/'); // Assuming checkOutDate is '10/12/2023'
    const day = parseInt(checkOutDateParts[0], 10);
    const month = parseInt(checkOutDateParts[1], 10) - 1; // Subtract 1 since months are zero-indexed in Date objects
    const year = parseInt(checkOutDateParts[2], 10);

    const checkout = new Date(year, month, day);

    const checkInDateParts = checkInDate.split('/'); // Assuming checkInDate is '10/12/2023'
    const day1 = parseInt(checkInDateParts[0], 10);
    const month1 = parseInt(checkInDateParts[1], 10) - 1; // Subtract 1 since months are zero-indexed in Date objects
    const year1 = parseInt(checkInDateParts[2], 10);

    const checkin = new Date(year1, month1, day1);

    if (checkin > checkout) {
      alert("Check In Date cannot be greater than Check Out Date")
      return;
    } else {
      navigate('/booking', { state: { propertyDetails: property, stateCurrOrders: currOrder, price: finalPrice, prooms: roomNumber } })
    }


    // } else {
    //   alert("You must be logged in")
    // }

  };

  useEffect(() => {
    calculateFinalPrice();
  }, [price, adultNumber, childNumber, roomType, roomNumber]);

  //    Amenities Logic
  const location = useLocation();
  // Scroll to the section based on the URL hash
  useEffect(() => {
    const { hash } = location;
    const sectionId = hash.substring(1); // Remove '#' from the hash
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, [location]);

  if (!property || !property.cards) {
    return <div></div>;
  }
  return (

    <div className="bg-[white]">
      <div className="text-center bg-[#B4E2EF] py-2 md:font-medium text-[10px] md:text-base">
        Book your comfortable rooms, even before 60 mins before the check in!
      </div>
      <NavbarC />
      <div className="relative overflow-hidden md:h-full h-64">
        {/* src={headingImage} */}
        <img src={headingImage} className="object-cover  h-full  w-full" />
        <div className="absolute inset-0    grid content-center text-center backdrop-brightness-50  ">
          <h1 className="text-white md:text-6xl text-xl font-medium">
            {property.title}
          </h1>
          <h1 className="text-white md:text-4xl text-md">
            {property.location}
          </h1>
          <div className="absolute bottom-0 right-0 p-4">
            <Link to={`/gallery/${routeParamsID}`}><button className="bg-white text-xs md:px-4 md:text-md px-3 py-2 rounded"><i class="fa fa-th text-[#6ACDE9]" aria-hidden="true"></i> Show all Photos</button></Link>
          </div>
        </div>

      </div>

      <h1 className="md:text-4xl text-xl text-center font-medium mt-10 mb-14 underline decoration-[#F79489] underline-offset-8 decoration-4">
        About the <span className="text-[#179FEB] font-bold">Space</span>
      </h1>

      <div className="w-100 md:h-full h-96 even:bg-[#FABEB7] odd:bg-[#D1EDF5]  md:mt-20 mt-10  relative">
        {/* src={aboutspace} */}
        <img src={aboutspace} className="object-  h-full  w-full" />

        <div className="absolute md:-bottom-20  -bottom-20 md:h-auto    w-4/5  mx-auto left-0 right-0 ml-auto mr-auto md:px-10 px-5 md:py-8 py-4 border-8 rounded border-[#B4E2EF] grid content-center text-center bg-white  ">
          <h1 className="text-black md:text-xl text-sm hidden md:block">
            {property.location_description}
          </h1>
          <h1 className="text-black  text-xs md:hidden">
            <ReadMore>{property.location_description}</ReadMore>
          </h1>
        </div>
      </div>

      {/* <h1 className="md:text-4xl text-xl text-center md:mt-36 mt-28 font-medium my-10 mx-5 ">
        Get a{" "}
        <span className="text-[#179FEB] font-bold">
          Sense of the Atmosphere
        </span>{" "}
        of your next Vacation Destination
      </h1> */}

      {/* <div className="md:mx-20 mx-10">
        <div className="video-responsive ">
          <iframe
            width="100%"
            height="480px"
            src={`https://www.youtube.com/embed/c6fY_E3hEZo`}
            // {property.video should be in this format ^}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="Embedded youtube"
          />
        </div>
      </div> */}
      <div ref={myRef}></div>
      {/* Search Components */}
      <div>
        <div className="sticky top-5 z-20">
          <div className="container md:block hidden  pt-16 mx-auto ">
            <div className="flex flex-wrap border-2 mx-28  border-slate-300/50 custom-shadow content-center divide-x	  rounded-lg">
              <div class="lg:w-2/6 dropdown bg-white px-5  py-2 ...">
                <div>
                  <h1 className="text-xl font-medium">{property.title}</h1>
                  <p>
                    <i className="fa  fa-map-marker text-[#6ACDE9] mr-2"></i>
                    {property.location}
                  </p>
                </div>
              </div>
              <div class="lg:w-1/6  text-lg py-2 bg-white ...">
                <h1 className="pl-3 z-10 font-medium">Check In</h1>
                <Datepicker
                  value={checkInDate}
                  minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())}
                  onSelectedDateChanged={handleCheckIn}
                  className=" custom-date"
                />
              </div>
              <div class="lg:w-1/6 text-lg py-2 bg-white ...">
                <h1 className="pl-3 z-10 font-medium">Check Out</h1>
                <Datepicker
                  value={checkOutDate}
                  minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)}
                  onSelectedDateChanged={handleCheckOut}
                  className=" custom-date "
                />
              </div>
              <div class="lg:w-1/6 dropdown px-3 py-2 bg-white ...">
                <Dropdown
                  arrowIcon={true}
                  dismissOnClick={false}
                  className="px-5 py-4 z-50"
                  inline
                  label={
                    <div className="text-start  w-full">
                      <div className="text-xl font-medium">Guests</div>
                      <div className="text-[#F79489]">
                        {adultNumber} Adult, {childNumber} Child
                      </div>
                    </div>
                  }
                >
                  <div className="flex w-100 mb-2 justify-between">
                    <div>
                      <h1 className="font-bold text-base w-3/5">Adults</h1>
                      <p className="text-gray-400">Age 8+</p>
                    </div>
                    <div className="w-2/5 justify-between  flex items-center">
                      <button
                        className="border mr-2 rounded-full border-2"
                        onClick={decrAdult}
                      >
                        -
                      </button>{" "}
                      {adultNumber}
                      <button
                        className="ml-2 border rounded-full border-2"
                        onClick={incrAdult}
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <Dropdown.Divider />
                  <div className="flex w-100 my-2 justify-between">
                    <div>
                      <h1 className="font-bold text-base w-3/5">Child</h1>
                      <p className="text-gray-400">Age 0 - 8</p>
                    </div>
                    <div className="w-2/5 justify-between  flex items-center">
                      <button
                        onClick={decrChild}
                        className="border mr-2 rounded-full border-2"
                      >
                        -
                      </button>{" "}
                      {childNumber}
                      <button
                        onClick={incrChild}
                        className="ml-2 border rounded-full border-2"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <Dropdown.Divider />
                  <div>
                    <h1 className="text-green-500 font-bold w-64">
                      Charges are not applicable for children below 8
                    </h1>
                  </div>
                </Dropdown>
              </div>
              <div class="lg:w-1/6 bg-white ...">
                <button
                  onClick={executeScroll}
                  className="w-full align-center bg-[#F79489] h-full text-xl font-bold rounded-lg text-white py-2 px-3"
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="">
          <div className="container md:hidden  pt-5 mx-auto ">
            <div className="flex flex-wrap border-2 mx-5  border-slate-300/50 custom-shadow-mobile content-center divide-x	  rounded-lg">
              <div className="w-3/5 dropdown  bg-white  py-2  px-4 ...">
                <h1 className="text-lg font-medium">{property.title}</h1>
                <p className="text-sm">
                  <i className="fa  fa-map-marker text-[#6ACDE9] mr-2"></i>
                  {property.location}
                </p>
              </div>
              <div className="w-2/5 dropdown pl-1 bg-white py-2 pr-1 ...">
                <Dropdown
                  arrowIcon={true}
                  dismissOnClick={false}
                  className="px-5 py-4"
                  inline
                  label={
                    <div className='text-start  w-full'><div className='text-[17px] font-medium'>Guests</div>
                      <div className='text-[#F79489] text-[13px]'>{adultNumber} Adult, {childNumber} Child</div></div>
                  }
                >
                  <div className='flex w-100 mb-2 justify-between items-center'>
                    <div><h1 className='font-bold text-base w-3/5'>Adults</h1><p className='text-gray-400'>Age 8+</p></div>
                    <div className='w-2/5 justify-between  flex '><button className='border mr-2 rounded-full border-2' onClick={decrAdult}>-</button> {adultNumber}<button className='ml-2 border rounded-full' onClick={incrAdult}>+</button></div>
                  </div>
                  <Dropdown.Divider />
                  <div className='flex w-100 my-2 justify-between  items-center'>
                    <div><h1 className='font-bold text-base w-3/5'>Child</h1><p className='text-gray-400'>Age 0 - 8</p></div>
                    <div className='w-2/5 justify-between  flex'><button onClick={decrChild} className='border mr-2 rounded-full'>-</button> {childNumber}<button onClick={incrChild} className='ml-2 border rounded-full'>+</button></div>
                  </div>
                  <Dropdown.Divider />
                  <div><h1 className='text-green-500 font-bold w-64'>Charges are not applicable for children below 8</h1></div>


                </Dropdown>
              </div>
            </div>
            <div className="flex flex-wrap border-2 mx-5 mt-2 border-slate-300/50 custom-shadow-mobile content-center divide-x	  rounded-lg">
              <div className="w-2/5 dropdown    py-2 ...">
                <h1 className='pl-3  z-10 font-medium'>Check In</h1>
                <Datepicker value={checkInDate} minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())} onSelectedDateChanged={handleCheckIn} className='p-0  custom-date' />
              </div>
              <div className="w-2/5 dropdown pl-0  py-2 ...">
                <h1 className='pl-3 z-10 font-medium'>Check Out</h1>
                <Datepicker value={checkOutDate} minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)} onSelectedDateChanged={handleCheckOut} className='p-0  custom-date mobile-date' />
              </div>
              <div className="w-1/5 dropdown    ...">
                <button
                  onClick={executeScroll}
                  className="w-full align-center bg-[#F79489] h-full text-xl font-bold rounded-lg text-white "
                >
                  <i class="fa fa-edit" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* <Search/>
            <SearchMobile /> */}

        <h1 className="md:text-4xl text-xl text-center font-medium mb-10 mt-8 underline decoration-[#F79489] underline-offset-8 decoration-4">
          Accomodations in{" "}
          <span className="text-[#179FEB] font-bold">Aarya Stays</span>
        </h1>

        {/* property card */}

        <div className="  md:mx-20 mx-5 ">
          <div class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:p-5 ">
            <div className="img-border p-2 md:w-1/3 md:h-71 w-full h-60  ">
              <Carousel>
                {slideImage?.map((item) => {
                  return (<img src={item} class="object-cover w-full rounded-br-lg rounded-tl-lg h-full md:h-full md:w-full " alt="..." />)
                })}
              </Carousel>
            </div>

            <div class="flex flex-col justify-between p-5 md:w-2/3 leading-normal">
              <h1 className="font-medium md:text-3xl text-xl">
                {property.title}
              </h1>
              <span className="md:text-lg text-md font-medium text-[#8E8E8E]">
                <i className="fa  fa-map-marker text-[#6ACDE9] text-xl"></i>{" "}
                {property.location}
              </span>
              <p className="md:text-xl text-md text-slate-400">{property.room_description}</p>
              <div className="flex flex-wrap">
                <div class="md:w-1/3 w-1/2 h-full text-lg py-2 ...">
                  <h1 className="pl-3 z-10 font-medium">Check In</h1>
                  <Datepicker
                    value={checkInDate}
                    onSelectedDateChanged={handleCheckIn}
                    className="  custom-date cursor-pointer"
                  />
                </div>

                <div class="md:w-1/3 w-1/2 text-lg py-2 ...">
                  <h1 className="pl-3 z-10 font-medium">Check Out</h1>
                  <Datepicker
                    value={checkOutDate}
                    onSelectedDateChanged={handleCheckOut}
                    className="  custom-date mobile-date2"
                  />
                </div>

                <div class="md:lg:w-1/3 w-1/2 dropdown px-3 py-2 ...">
                  {property.roomType.length == 1 ? (
                    <div>
                      <h1 className="text-xl font-medium">Type</h1>
                      <h1 className="text-[#F79489]">{roomType}</h1>
                    </div>) : <Dropdown
                      arrowIcon={true}
                      className="px-5 py-4"
                      inline
                      label={
                        <div className="text-start  w-full">
                          <div className="text-xl font-medium">Type</div>
                          <div className="text-[#F79489]">{roomType}</div>
                        </div>
                      }
                    >
                    {property.roomType.map((item, index) => {
                      return (
                        <Dropdown.Item>
                          <div
                            className=" cursor-pointer"
                            onClick={() => {
                              handleRoomType(item);
                            }}
                          >
                            <h1 className="font-bold text-base ">{item}</h1>
                          </div>
                        </Dropdown.Item>
                      );
                    })}

                  </Dropdown>}


                  {/* <Dropdown.Item>
                      <div className=' cursor-pointer' onClick={()=>{handleRoomType('Full Property')}}>
                          <h1 className='font-bold text-base '>Full Property</h1>
                      </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Divider />
                      <Dropdown.Item>
                      <div className=' cursor-pointer' onClick={()=>{handleRoomType('Dorm Beds')}}>
                          <h1 className='font-bold text-base '>Dorm Beds</h1>
                      </div>
                      </Dropdown.Item>
                      
                      <Dropdown.Divider />
                      <Dropdown.Item>
                      <div className=' cursor-pointer' onClick={()=>{handleRoomType('Private Rooms')}}>
                          <h1 className='font-bold text-base '>Private Rooms</h1>
                      </div>
                      </Dropdown.Item> */}
                </div>

                <div class="lg:w-1/3 w-1/2 dropdown px-3 py-2 ...">
                  <Dropdown
                    arrowIcon={true}
                    dismissOnClick={false}
                    className="px-5 py-4"
                    inline
                    label={
                      <div className="text-start  w-full">
                        <div className="text-xl font-medium">Guests</div>
                        <div className="text-[#F79489]">
                          {adultNumber} Adult, {childNumber} Child
                        </div>
                      </div>
                    }
                  >
                    <div className="flex w-100 mb-2 justify-between">
                      <div>
                        <h1 className="font-bold text-base w-3/5">Adults</h1>
                        <p className="text-gray-400">Age 8+</p>
                      </div>
                      <div className="w-2/5 justify-between  flex items-center">
                        <button
                          className="border mr-2 rounded-full border-2"
                          onClick={decrAdult}
                        >
                          -
                        </button>{" "}
                        {adultNumber}
                        <button
                          className="ml-2 border rounded-full border-2"
                          onClick={incrAdult}
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <Dropdown.Divider />
                    <div className="flex w-100 my-2 justify-between">
                      <div>
                        <h1 className="font-bold text-base w-3/5">Child</h1>
                        <p className="text-gray-400">Age 0 - 8</p>
                      </div>
                      <div className="w-2/5 justify-between  flex items-center">
                        <button
                          onClick={decrChild}
                          className="border mr-2 rounded-full border-2"
                        >
                          -
                        </button>{" "}
                        {childNumber}
                        <button
                          onClick={incrChild}
                          className="ml-2 border rounded-full border-2"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <Dropdown.Divider />
                    <div>
                      <h1 className="text-green-500 font-bold w-64">
                        Charges are not applicable for children below 8
                      </h1>
                    </div>
                  </Dropdown>
                </div>

                {roomType === "private-rooms" &&
                  <div class="lg:w-1/3 w-1/2 dropdown px-3 py-2 ...">
                    <Dropdown
                      arrowIcon={true}
                      dismissOnClick={false}
                      className="px-5 py-4"
                      inline
                      label={
                        <div className="text-start  w-full">
                          <div className="text-xl font-medium">Quantity</div>
                          <div className="text-[#F79489]">
                            {roomNumber} Rooms
                          </div>
                        </div>
                      }
                    >
                      <div className="flex w-100 mb-2 justify-between">
                        <div>
                          <h1 className="font-bold text-base w-3/5">Rooms</h1>

                        </div>
                        <div className="w-2/5 justify-between  flex items-center">
                          <button
                            className="border mr-2 rounded-full border-2"
                            onClick={decrRooms}
                          >
                            -
                          </button>{" "}
                          {roomNumber}
                          <button
                            className="ml-2 border rounded-full border-2"
                            onClick={incrRooms}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <Dropdown.Divider />

                      <div>
                        <h1 className="text-green-500 font-bold w-64">
                          Maximum 3 Adults can be accomodated in a room
                        </h1>
                      </div>
                    </Dropdown>
                  </div>}

                <div className="lg:w-max w-full px-1 py-2">
                  <div className="flex  items-center h-full">
                    <h1 className="font-medium md:text-xl">
                      Total before Taxes{" "}
                    </h1>
                    <span className="py-1 px-2 ml-2 border-2 rounded-lg border-green-500 text-green-500 font-medium">
                      Rs {finalPrice}/-
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* property card ends */}

        <h1 className="md:text-4xl text-xl text-center font-medium my-10 underline decoration-[#F79489] underline-offset-8 decoration-4" id="amenities">
          Amenities
        </h1>
        <div className="w-100  md:mx-20  md:p-10 mx-8 pb-10 grid justify-items-start  md:border-2 md:border-slate-200 md:rounded-lg">
          <h1 className="md:text-2xl text-xl font-medium">Essentials</h1>
          {/* <div className="flex h-full flex-wrap mt-4"> */}
          <div className='flex h-full flex-wrap gap-y-8 md:gap-x-14 gap-x-4 my-6'>

            {essentialAmenities?.map((item, index) => {
              return (
                <div onClick={() => { showAmenitiesInfo(item) }} className='md:h-[8rem] md:w-[8rem] cursor-pointer h-[4rem] w-[4rem] mt-2'>
                  <div className='flex-1 h-full custom-shadow rounded grid  justify-items-center place-content-center'>
                    <img src={item.icon.url} className='w-2/3 md:w-full text-center' />
                  </div>

                  <h1 className='text-center mt-2 md:text-md text-xs'>{item.title}</h1>
                </div>
              )
            })}
          </div>

          <h1 className="md:text-2xl text-xl font-medium mt-10">On Demand Service</h1>
          <h1 className="md:text-lg text-sm text-green-600">Click on services to add them</h1>
          <div className="flex flex-wrap gap-10  mt-4">
            {extraAmenities?.map((item, index) => {
              return (
                <div
                  className="md:h-[8rem] md:w-[8rem] cursor-pointer  h-[4rem] w-[4rem] mt-2"
                  onClick={() => {
                    addOnDemand(item);
                  }}
                >
                  <div className="flex-1 h-full custom-shadow2  rounded grid  justify-items-center place-content-center">
                    <img
                      src={item.icon.url}
                      className="w-2/3 md:w-full text-center"
                    />
                  </div>
                  <h1 className="text-center mt-2 md:text-md text-xs">{item.title}</h1>
                </div>
              );
            })}
          </div>
        </div>

        {showOnDemand && (
          <div className="flex flex-wrap  md:mx-20 mx-4 mt-5">
            <div className=" md:w-2/3 md:pr-2 ">
              <div className="border-2 border-slate-200 rounded-lg divide-y">
                {[...addedOnDemand].map((item, index) => {
                  // const [a,seta] = useState(1)
                  return (
                    <div className="flex md:flex-row flex-col items-center md:justify-start  py-4">
                      <AddOn item={item} />
                      <div className="px-2 md:w-3/4">
                        <h1>{item.description}</h1>
                        <div className="flex justify-between mt-2">
                          <div>
                            <h1 className="text-[#268F43]">
                              @ RS {item.price}/ Hour
                            </h1>
                          </div>
                          <div
                            onClick={() => {
                              removeAddedItem(item);
                            }}
                          >
                            <img src={Bin}></img>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="md:w-1/3 ">
              <div class="border-2 border-slate-200 rounded-lg grid grid-cols-1 divide-y">
                <div>
                  <h1 className="md:text-3xl text-xl text-[#949494] font-medium py-2 px-6">
                    Price details
                  </h1>
                </div>
                <div className="flex justify-between py-2 px-6">
                  <div>
                    <h1 className="font-medium md:text-xl text-lg">
                      Total Service Charges
                    </h1>
                    <h1 className="text-lg">
                      ({currOrder.amenities.length} Items)
                    </h1>
                  </div>
                  <div>
                    <h1 className="text-xl text-[#268F43] font-medium">
                      Rs {amenitiesPrice}
                    </h1>
                  </div>
                </div>
                <div className="py-2 px-6">
                  <h1 className="md:text-3xl text-xl text-[#949494] font-medium">
                    Why customized amenities?
                  </h1>
                  <p className="md:text-lg mt-2">
                    Aarya Stays gives flexibility to their guest to pay according
                    to the needs, we are transperant on pricing & the most
                    affordable brand for Homestays.
                  </p>
                  <button onClick={() => { navigateToBook() }} className="bg-[#F79489] w-full md:text-2xl text-xl py-1 rounded font-medium text-white my-4">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div id="amenites" className="md:mx-20 mx-4 w-100 mt-10 text-center">
          {/* <Link to="/booking" state={{property}}> */}
          <button onClick={() => { navigateToBook() }} className=" bg-[#F79489] md:w-1/2 w-full md:text-3xl text-xl md:py-4 py-2 rounded font-medium text-white">
            Book Now
          </button>
          {/* </Link> */}
        </div>


        <h1 className="md:text-4xl text-xl text-center font-medium my-10 underline decoration-[#F79489] underline-offset-8 decoration-4" id="amenities">
          Around <span className="text-[#179FEB]">Aarya Stays</span>
        </h1>
        <div className="w-100 md:mx-20 mx-10 md:mt-20 mt-10 rounded-lg overflow-auto">
          <Slide slides={property.slides} />
        </div>
        {/* <h1 className="lg:text-4xl md:tex-3xl text-xl text-center font-medium my-10 underline decoration-[#F79489] underline-offset-8 decoration-4">
        Everything You Need To Know{" "}
        <span className="text-[#179FEB]">Before You Book</span>
      </h1>  */}

        <div className='flex items-center justify-center mb-8 mt-5 md:mt-0'>
          <div className='bg-[#F79489] md:w-52 w-36 h-1'> </div>
          <div className='px-1 text-center lg:text-4xl md:tex-3xl text-xl font-medium'>Everything You Need To Know <span className='text-[#179FEB]'>Before You Book</span></div>
          <div className='bg-[#F79489] md:w-52 w-36 h-1'> </div>
        </div>

        <div className="md:mx-20 mx-4">

          <IndividualCard2 cards={property.cards} />

        </div>


      </div>



      <Modal dismissible show={openModal} className="center" onClose={() => setOpenModal(false)}>
        <Modal.Header >
          <div className="flex w-full gap-x-3 items-center justify-center">
            <img src={amenitesInfo?.icon.url} className='  text-center' />
            {amenitesInfo?.title}
          </div></Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
              {amenitesInfo?.description}
            </p>

          </div>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button onClick={() => setOpenModal(false)}>I accept</Button>
          
        </Modal.Footer> */}
      </Modal>
      <Reviews />
      <Query />
      <About />
      <FooterC />
      <button onClick={executeScroll} id="fixedbutton" className="md:hidden bg-[#F79489] text-white font-medium border-2 rounded-full p-4"> Edit</button>
      <button onClick={executeScroll} id="fixedbutton-pc" className="md:block hidden bg-[#F79489] text-white font-medium border-2 rounded-full p-4"> Book Now</button>
    </div>
  );
}
