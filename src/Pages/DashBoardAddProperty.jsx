import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAmenity } from "../Store/amenitySlice";
import { getAllCards } from "../Store/cardSlice";
import { createProperty } from "../Store/propertySlice";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { logout, login } from '../Store/userSlice';
import api from "../api/api";
import { authentication } from '../firebase/config';
import DashBoardNavbar from "../Components/DashBoardNavbar";

const DashBoardAddProperty = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const amenitiesList = useSelector(state => state.amenity);
  const cardsList = useSelector(state => state.card);


  const options = ['full-property', 'private-rooms', 'dorm-beds'];
  const [title, setTitle] = useState();
  const [location, setLocation] = useState();
  const [price, setPrice] = useState();
  const [bhk, setBhk] = useState();
  const [location_description, setLocation_description] = useState();
  const [room_description, setRoom_description] = useState();
  const [surrounding_description, setSurrounding_description] = useState();
  const [video, setVideo] = useState();
  const [payload, setPayload] = useState();
  const [roomType, setRoomType] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [cards, setCards] = useState([]);
  const [id, setId] = useState();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const unlisten = onAuthStateChanged(authentication,
      user => {
        if (user) {
          const userData = {
            token: user.accessToken,
            uid: user.uid,
            provider: user.providerData[0].providerId
          }

          const fetchData = async () => {
            try {
              console.log(user.uid);
              const response = await api.get(`/api/v1/user/${user.uid}`);
              console.log(response.data.role);
              setVisible(true)

              if (response.data.role != 'admin') {
                navigate('/')
              }
            } catch (error) {
              navigate('/')

              // console.log(error)
            }
          }
          // console.log(user)
          fetchData()
          dispatch(login(userData));

          // setOpenModal(false);
        } else {
          dispatch(logout());
          navigate('/')
        }
      });
    return () => {
      unlisten();
    }
  }, []);



  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleLocationDescription = (e) => {
    setLocation_description(e.target.value);
  };

  const handleRoomDescription = (e) => {
    setRoom_description(e.target.value);
  };

  const handleSurroundingDescription = (e) => {
    setSurrounding_description(e.target.value);
  };

  const handleLocation = (e) => {
    setLocation(e.target.value);
  };

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  const handleBHK = (e) => {
    setBhk(e.target.value);
  }

  const handleVideo = (e) => {
    setVideo(e.target.value);
  };

  const handleRoomTypeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setRoomType([...roomType, value]);
    } else {
      setRoomType(roomType.filter(item => item !== value));
    }
  };

  const handleCardChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCards([...cards, value]);
    } else {
      setCards(cards.filter(item => item !== value));
    }
  };


  const handleAmenityChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setAmenities([...amenities, value]);
    } else {
      setAmenities(amenities.filter(item => item !== value));
    }
  };

  const handleCreateProperty = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !location ||
      !price ||
      !location_description ||
      !room_description ||
      !surrounding_description ||
      !video ||
      !roomType ||
      !amenities ||
      !cards
    ) {
      alert("Please Fill the missing values");
    }
    const newProperty = {
      title,
      location,
      price: Number(price),
      location_description,
      room_description,
      surrounding_description,
      video,
      currentLocation_images: [],
      ats_image: [],
      slides: [],
      reviews: [],
      cards,
      amenities,
      roomType,
      bhk: Number(bhk)
    };
    const payload = await dispatch(createProperty(newProperty)).unwrap();
    setPayload(payload);
    setTitle();
    setLocation();
    setPrice();
    setLocation_description();
    setRoom_description();
    setSurrounding_description();
    setVideo();
    setAmenities([]);
    setCards([]);
    setRoomType([]);
  };

  useEffect(() => {
    dispatch(getAllAmenity());
    dispatch(getAllCards());
  }, [])

  useEffect(() => {
    if (payload) {
      navigate(`/dashboard/property/${payload._id}`)
    }
  }, [payload])


  if (!visible) {
    return <div></div>
  }
  return (
    <div>
      <DashBoardNavbar />
      <div className="bg-white px-8 py-5 rounded mx-auto box-border w-3/5">
        <h2 className="text-3xl mb-3 text-center font-poppins">Add Property</h2>
        <form action="" className="font-montserrat text-sm">
          <div className="mb-3">
            <input
              type="text"
              className="border-2 rounded-xl py-1 px-3  w-full"
              placeholder="Title"
              value={title}
              onChange={handleTitle}
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="border-2 rounded-xl py-1 px-3  w-full"
              placeholder="Location"
              value={location}
              onChange={handleLocation}
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              onChange={handlePrice}
              value={price}
              className="border-2 rounded-xl py-1 px-3  w-full"
              placeholder="Price"
            />
          </div>
          <div className="mb-3">
            <input
              type="number"
              onChange={handleBHK}
              value={bhk}
              className="border-2 rounded-xl py-1 px-3  w-full"
              placeholder="BHK"
            />
          </div>
          <div className="mb-3">
            <input
              type="text"
              className="border-2 rounded-xl py-1 px-3  w-full"
              placeholder="Video URL"
              value={video}
              onChange={handleVideo}
            />
          </div>
          {/* <div className='mb-3 flex'>
          <label htmlFor="" className=' text-gray-400 mr-2 text-lg'>Icon: </label>
          <input type="file" accept="image/" onChange={(e) => handleIcon(e.target.files)}/>
        </div> */}
          <div className="mb-6">
            <textarea
              name=""
              id=""
              cols=""
              rows="3"
              className="border-2 rounded-xl py-1 px-3 w-full"
              placeholder="Location Description"
              onChange={handleLocationDescription}
              value={location_description}
            ></textarea>
            <p className="text-red-500 text-end">Less than 753 characters Recommended</p>
          </div>
          <div className="mb-3">
            <textarea
              name=""
              id=""
              cols=""
              rows="3"
              className="border-2 rounded-xl py-1 px-3 w-full"
              placeholder="Room Description"
              onChange={handleRoomDescription}
              value={room_description}
            ></textarea>
          </div>
          <div className="mb-3">
            <textarea
              name=""
              id=""
              cols=""
              rows="3"
              className="border-2 rounded-xl py-1 px-3 w-full"
              placeholder="Surrounding Description"
              onChange={handleSurroundingDescription}
              value={surrounding_description}
            ></textarea>
          </div>

          <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
            Choose Room Types:
          </h3>
          <ul class="grid w-full gap-6 md:grid-cols-3 mb-5">
            {options.map(type => <li>
              <input
                type="checkbox"
                class="hidden peer"
                id={type}
                value={type}
                checked={roomType.includes(type)}
                onChange={handleRoomTypeChange}
              ></input>
              <label
                for={type}
                class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="block">
                  <div class="w-full text-lg font-semibold">{type}</div>
                  <div class="w-full text-sm">
                  </div>
                </div>
              </label>
            </li>)}
          </ul>
          <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
            Choose Amenities:
          </h3>
          <ul class="grid w-full gap-6 md:grid-cols-3 mb-5">
            {amenitiesList && amenitiesList.allAmenities.map(amenity => <li>
              <input
                type="checkbox"
                class="hidden peer"
                id={amenity._id}
                value={amenity._id}
                checked={amenities.includes(amenity._id)}
                onChange={handleAmenityChange}
              ></input>
              <label
                for={amenity._id}
                class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="flex w-full align-middle">
                  <div class="basis-1/4 text-sm">
                    <img src={amenity.icon.url} alt="" className="w-5 self-center" />
                  </div>
                  <div class="basis-3/4 text-lg font-semibold">{amenity.title}</div>
                </div>
              </label>
            </li>)}
          </ul>

          <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
            Choose Cards:
          </h3>
          <ul class="grid w-full gap-6 md:grid-cols-3 mb-5">
            {cardsList && cardsList.allCards.map(card => <li>
              <input
                type="checkbox"
                class="hidden peer"
                id={card._id}
                value={card._id}
                checked={cards.includes(card._id)}
                onChange={handleCardChange}
              ></input>
              <label
                for={card._id}
                class="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                <div class="flex w-full align-middle">
                  <div class="basis-1/4 text-sm">
                    <img src={card.icon.url} alt="" className="w-5 self-center" />
                  </div>
                  <div class="basis-3/4 text-lg font-semibold">{card.title}</div>
                </div>
              </label>
            </li>)}
          </ul>

          <button
            className="block w-full bg-[#F79489] text-white py-2 px-5 rounded-full hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border text-l mb-3 font-poppins"
            onClick={handleCreateProperty}
          >
            Add
          </button>
        </form>
      </div>
    </div>
  );
};

export default DashBoardAddProperty;
