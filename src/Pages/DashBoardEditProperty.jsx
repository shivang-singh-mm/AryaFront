import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAmenity } from "../Store/amenitySlice";
import { getAllCards } from "../Store/cardSlice";
import {
  deleteProperty,
  editProperty,
  getPropertyById,
} from "../Store/propertySlice";
import { Modal } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";
import { BiTrash } from "react-icons/bi";
import Image from "../Components/Image";
import { createImage, deleteImage } from "../Store/imageSlice";
import DashBoardSlide from "../Components/DashBoardSlide";
import { createSlide, deleteSlide } from "../Store/slideSlice";
import DashBoardCalender from "../Components/DashBoardCalender";
import { deleteEvent } from "../Store/eventSlice";
import { deleteOrdersByPropertyId } from "../Store/orderSlice";
import { deleteReview } from "../Store/reviewSlice";
import { onAuthStateChanged } from "firebase/auth";
import { logout, login } from '../Store/userSlice';
import { authentication } from '../firebase/config';

const DashBoardEditProperty = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const amenitiesList = useSelector((state) => state.amenity);
  const cardsList = useSelector((state) => state.card);
  const property = useSelector((state) => state.property.propertyById);

  const options = ["full-property", "private-rooms", "dorm-beds"];
  const [title, setTitle] = useState();
  const [location, setLocation] = useState();
  const [price, setPrice] = useState();
  const [bhk, setBhk] = useState();
  const [location_description, setLocation_description] = useState();
  const [room_description, setRoom_description] = useState();
  const [slide_description, setSlide_description] = useState();
  const [surrounding_description, setSurrounding_description] = useState();
  const [video, setVideo] = useState();
  const [roomType, setRoomType] = useState([]);
  const [amenities, setAmenities] = useState([]);
  const [cards, setCards] = useState([]);
  const [slideImages, setSlideImages] = useState([]);

  const [disableTitle, setDisableTitle] = useState(true);
  const [disableLocation, setDisableLocation] = useState(true);
  const [disablePrice, setDisablePrice] = useState(true);
  const [disableBhK, setDisableBhk] = useState(true);
  const [disableLocation_description, setDisableLocation_description] =
    useState(true);
  const [disableRoom_description, setDisableRoom_description] = useState(true);
  const [disableSurrounding_description, setDisableSurrounding_description] =
    useState(true);
  const [disableVideo, setDisableVideo] = useState(true);
  const [cimages, setCImages] = useState();
  const [aimage, setAImage] = useState();

  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const user = useSelector(state => state.user);

  const [visible, setVisible] = useState(false);

  useEffect(() =>{
    const unlisten = onAuthStateChanged(authentication,
       user => {
        if (user) {
          const userData = {
            token:user.accessToken,
            uid:user.uid,
            provider:user.providerData[0].providerId
          }
          
          const fetchData = async()=>{
            try {
              console.log(user.uid);
              const response = await api.get(`/api/v1/user/${user.uid}`);
              console.log(response.data.role);
              setVisible(true)

              if(response.data.role != 'admin'){
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

  const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);

      fileReader.onload = () => {
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

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
  };

  const handleVideo = (e) => {
    setVideo(e.target.value);
  };

  const handleRoomTypeChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setRoomType([...roomType, value]);
    } else {
      setRoomType(roomType.filter((item) => item !== value));
    }
  };

  const handleCardChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setCards([...cards, value]);
    } else {
      setCards(cards.filter((item) => item !== value));
    }
  };

  const handleEditTitle = (e) => {
    e.preventDefault();
    setDisableTitle(false);
  };

  const handleEditLocation = (e) => {
    e.preventDefault();
    setDisableLocation(false);
  };

  const handleEditPrice = (e) => {
    e.preventDefault();
    setDisablePrice(false);
  };

  const handleEditBHK = (e) => {
    e.preventDefault();
    setDisableBhk(false);
  };

  const handleEditLocationDescription = (e) => {
    e.preventDefault();
    setDisableLocation_description(false);
  };

  const handleEditRoomDescription = (e) => {
    e.preventDefault();
    setDisableRoom_description(false);
  };

  const handleEditSurroundingDescription = (e) => {
    e.preventDefault();
    setDisableSurrounding_description(false);
  };

  const handleEditVideo = (e) => {
    e.preventDefault();
    setDisableVideo(false);
  };

  const handleCImages = async (e) => {
    e.preventDefault();
    let base64s = [];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const base64 = await convertBase64(files[i]);
      base64s.push(base64);
    }
    setCImages(base64s);
  };

  const handleAImage = async (e) => {
    e.preventDefault();
    const base64 = await convertBase64(e.target.files[0]);
    setAImage(base64);
  };

  const handleSlideImages = async (e) => {
    e.preventDefault();
    let base64s = [];
    const files = e.target.files;
    for (let i = 0; i < files.length; i++) {
      const base64 = await convertBase64(files[i]);
      base64s.push(base64);
    }
    setSlideImages(base64s);
  };

  const handleSlideDescription = (e) => {
    setSlide_description(e.target.value);
  };

  const handleAddCurrentLocationImages = async (e) => {
    e.preventDefault();
    if (cimages.length === 0) {
      alert("Please Upload Image");
      return;
    }

    for (let i = 0; i < cimages.length; i++) {
      const imageObj = {
        type: "currentLocation_images",
        propertyId: id,
        image: cimages[i],
      };
      if (i != cimages.length - 1) {
        dispatch(createImage(imageObj));
      } else {
        dispatch(createImage(imageObj)).then((data) =>
          dispatch(getPropertyById(id))
        );
      }
    }
  };

  const handleAddAtsImage = async (e) => {
    if (!aimage) {
      alert("Please Upload Image");
      return;
    }
    const imageObj = { type: "ats_image", propertyId: id, image: aimage };
    dispatch(createImage(imageObj)).then((data) =>
      dispatch(getPropertyById(id))
    );
  };

  const handleAddSlide = (e) => {
    e.preventDefault();
    const slide = {
      propertyId: id,
      images: slideImages,
      description: slide_description,
    };
    dispatch(createSlide(slide));
  };

  const handleAmenityChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setAmenities([...amenities, value]);
    } else {
      setAmenities(amenities?.filter((item) => item !== value));
    }
  };

  const handlePropertyDeleteModal = (e) => {
    e.preventDefault();
    setOpenDeleteModal(true);
  };

  const handlePropertyDelete = (e) => {
    e.preventDefault();

    property.ats_image.forEach((id) => dispatch(deleteImage(id)));

    property.currentLocation_images.forEach((id) => dispatch(deleteImage(id)));

    property.slides.forEach((id) => dispatch(deleteSlide(id)));

    property.events.forEach((id) => dispatch(deleteEvent(id)));

    property.reviews.forEach((id) => dispatch(deleteReview(id)));

    dispatch(deleteOrdersByPropertyId(id));

    dispatch(deleteProperty(property._id));

    navigate("/dashboard/property");
  };

  const handleEditProperty = async (e) => {
    e.preventDefault();

    const newProperty = {};

    if (!disableTitle) newProperty.title = title;
    if (!disableLocation) newProperty.location = location;
    if (!disablePrice) newProperty.price = Number(price);
    if (!disableBhK) newProperty.bhk = Number(bhk);
    if (!disableVideo) newProperty.video = video;
    if (!disableLocation_description)
      newProperty.location_description = location_description;
    if (!disableRoom_description)
      newProperty.room_description = room_description;
    if (!disableSurrounding_description)
      newProperty.surrounding_description = surrounding_description;
    newProperty.roomType = roomType;
    newProperty.amenities = amenities;
    newProperty.cards = cards;

    const updatedProperty = { id, newProperty };

    dispatch(editProperty(updatedProperty));
    setDisableTitle(true);
    setDisableLocation(true);
    setDisablePrice(true);
    setDisableLocation_description(true);
    setDisableRoom_description(true);
    setDisableSurrounding_description(true);
    setDisableVideo(true);
    setDisableBhk(true);
  };

  useEffect(() => {
    dispatch(getPropertyById(id));
    dispatch(getAllAmenity());
    dispatch(getAllCards());
  }, []);

  useEffect(() => {
    if (property) {
      setTitle(property.title);
      setLocation(property.location);
      setPrice(property.price);
      setLocation_description(property.location_description);
      setRoom_description(property.room_description);
      setSurrounding_description(property.surrounding_description);
      setVideo(property.video);
      setAmenities(property.amenities);
      setCards(property.cards);
      setRoomType(property.roomType);
      setBhk(property.bhk);
    }
  }, [property]);

  if(!visible){
    return <div></div>
  }

  if (Object.keys(property).length == 0) {
    return <></>;
  }

  

  return (
    <>
      <div>
        <div className="bg-white px-8 py-5 rounded mx-auto box-border w-3/4">
          <div className="flex justify-between mb-10">
            <h2 className="text-3xl text-center font-poppins">Edit Property</h2>
            <button onClick={handlePropertyDeleteModal}>
              <BiTrash className="block bg-red-500 text-white p-3 text-5xl rounded-xl hover:bg-red-600 hover:cursor-pointer" />
            </button>
          </div>
          <form action="" className="font-montserrat text-sm">
            <div className="mb-3">
              <button
                onClick={handleEditTitle}
                className="text-red-500 underline block ml-auto"
              >
                Edit
              </button>
              <input
                type="text"
                className={`border-2 rounded-xl py-1 px-3  w-full ${
                  disableTitle
                    ? " text-gray-400 cursor-not-allowed"
                    : "text-black"
                }`}
                placeholder="Title"
                value={title}
                disabled={disableTitle}
                onChange={handleTitle}
              />
            </div>
            <div className="mb-3">
              <button
                onClick={handleEditLocation}
                className="text-red-500 underline block ml-auto"
              >
                Edit
              </button>
              <input
                type="text"
                className={`border-2 rounded-xl py-1 px-3  w-full ${
                  disableLocation
                    ? " text-gray-400 cursor-not-allowed"
                    : "text-black"
                }`}
                placeholder="Location"
                value={location}
                disabled={disableLocation}
                onChange={handleLocation}
              />
            </div>
            <div className="mb-3">
              <button
                onClick={handleEditPrice}
                className="text-red-500 underline block ml-auto"
              >
                Edit
              </button>
              <input
                type="number"
                onChange={handlePrice}
                value={price}
                className={`border-2 rounded-xl py-1 px-3  w-full ${
                  disablePrice
                    ? " text-gray-400 cursor-not-allowed"
                    : "text-black"
                }`}
                disabled={disablePrice}
                placeholder="Price"
              />
            </div>
            <div className="mb-3">
              <button
                onClick={handleEditBHK}
                className="text-red-500 underline block ml-auto"
              >
                Edit
              </button>
              <input
                type="number"
                onChange={handleBHK}
                value={bhk}
                className={`border-2 rounded-xl py-1 px-3  w-full ${
                  disableBhK
                    ? " text-gray-400 cursor-not-allowed"
                    : "text-black"
                }`}
                disabled={disableBhK}
                placeholder="BHK"
              />
            </div>
            <div className="mb-3">
              <button
                onClick={handleEditVideo}
                className="text-red-500 underline block ml-auto"
              >
                Edit
              </button>
              <input
                type="text"
                className={`border-2 rounded-xl py-1 px-3  w-full ${
                  disableVideo
                    ? " text-gray-400 cursor-not-allowed"
                    : "text-black"
                }`}
                placeholder="Video URL"
                value={video}
                disabled={disableVideo}
                onChange={handleVideo}
              />
            </div>
            <div className="mb-6">
              <button
                onClick={handleEditLocationDescription}
                className="text-red-500 underline block ml-auto"
              >
                Edit
              </button>
              <textarea
                name=""
                id=""
                cols=""
                rows="3"
                className={`border-2 rounded-xl py-1 px-3  w-full ${
                  disableLocation_description
                    ? " text-gray-400 cursor-not-allowed"
                    : "text-black"
                }`}
                placeholder="Location Description"
                onChange={handleLocationDescription}
                disabled={disableLocation_description}
                value={location_description}
              ></textarea>
              <p className="text-red-500 text-end mt-0">
                Less Than 753 Characters recommended
              </p>
            </div>
            <div className="mb-3">
              <button
                onClick={handleEditRoomDescription}
                className="text-red-500 underline block ml-auto"
              >
                Edit
              </button>
              <textarea
                name=""
                id=""
                cols=""
                rows="3"
                className={`border-2 rounded-xl py-1 px-3  w-full ${
                  disableRoom_description
                    ? " text-gray-400 cursor-not-allowed"
                    : "text-black"
                }`}
                placeholder="Room Description"
                onChange={handleRoomDescription}
                value={room_description}
                disabled={disableRoom_description}
              ></textarea>
            </div>
            <div className="mb-3">
              <button
                onClick={handleEditSurroundingDescription}
                className="text-red-500 underline block ml-auto"
              >
                Edit
              </button>

              <textarea
                name=""
                id=""
                cols=""
                rows="3"
                className={`border-2 rounded-xl py-1 px-3  w-full ${
                  disableSurrounding_description
                    ? " text-gray-400 cursor-not-allowed"
                    : "text-black"
                }`}
                placeholder="Surrounding Description"
                onChange={handleSurroundingDescription}
                value={surrounding_description}
                disabled={disableSurrounding_description}
              ></textarea>
            </div>

            <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
              Choose Room Types:
            </h3>
            <ul class="grid w-full gap-6 md:grid-cols-3 mb-5">
              {options.map((type) => (
                <li>
                  <input
                    type="checkbox"
                    class="hidden peer"
                    id={type}
                    value={type}
                    checked={roomType?.includes(type)}
                    onChange={handleRoomTypeChange}
                  ></input>
                  <label
                    for={type}
                    class={`inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700
                  `}
                  >
                    <div class="block">
                      <div class="w-full text-lg font-semibold">{type}</div>
                      <div class="w-full text-sm"></div>
                    </div>
                  </label>
                </li>
              ))}
            </ul>
            <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
              Choose Amenities:
            </h3>
            <ul class="grid w-full gap-6 md:grid-cols-3 mb-5">
              {amenitiesList &&
                amenitiesList.allAmenities.map((amenity) => (
                  <li>
                    <input
                      type="checkbox"
                      class="hidden peer"
                      id={amenity._id}
                      value={amenity._id}
                      checked={amenities?.includes(amenity._id)}
                      onChange={handleAmenityChange}
                    ></input>
                    <label
                      for={amenity._id}
                      class={`inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}
                    >
                      <div class="flex w-full align-middle">
                        <div class="basis-1/4 text-sm">
                          <img
                            src={amenity.icon.url}
                            alt=""
                            className="w-5 self-center"
                          />
                        </div>
                        <div class="basis-3/4 text-lg font-semibold">
                          {amenity.title}
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
            </ul>

            <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">
              Choose Cards:
            </h3>
            <ul class="grid w-full gap-6 md:grid-cols-3 mb-5">
              {cardsList &&
                cardsList.allCards.map((card) => (
                  <li>
                    <input
                      type="checkbox"
                      class="hidden peer"
                      id={card._id}
                      value={card._id}
                      checked={cards?.includes(card._id)}
                      onChange={handleCardChange}
                    ></input>
                    <label
                      for={card._id}
                      class={`inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700
                    `}
                    >
                      <div class="flex w-full align-middle">
                        <div class="basis-1/4 text-sm">
                          <img
                            src={card.icon.url}
                            alt=""
                            className="w-5 self-center"
                          />
                        </div>
                        <div class="basis-3/4 text-lg font-semibold">
                          {card.title}
                        </div>
                      </div>
                    </label>
                  </li>
                ))}
            </ul>

            <button
              className="block w-full bg-[#F79489] text-white py-1 px-5 rounded-full hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border text-xl text-semibold mb-3 font-poppins"
              onClick={handleEditProperty}
            >
              Save
            </button>
          </form>
          <div className="flex mt-14 mb-8">
            <h2 className="basis-3/4 text-xl font-semibold">
              Current Location Image :
            </h2>
            <div>
              <input
                type="file"
                accept="image/"
                className="mr-5"
                placeholder="Add"
                multiple
                onChange={handleCImages}
              />
              <p className="text-red-500 mt-2">720 x 300 Recommended</p>
            </div>
          </div>
          <button
            className="block w-full bg-black text-white py-1 px-5 rounded-xl hover:bg-white hover:text-black border-2 border-black transition duration-200 box-border text-l mb-5 font-poppins"
            onClick={handleAddCurrentLocationImages}
          >
            Add{" "}
          </button>
          <div class="grid grid-cols-3 gap-4">
            {property && property.currentLocation_images.length > 0 ? (
              property.currentLocation_images.map((id) => (
                <Image
                  id={id}
                  propertyId={property._id}
                  type={"currentLocation_images"}
                />
              ))
            ) : (
              <h2 className="basis-3/4 text-l font-semibold">
                No Images Added.
              </h2>
            )}
          </div>
          <div className="flex mt-14 mb-8">
            <h2 className="basis-3/4 text-xl font-semibold">
              About the Space Image :
            </h2>
            <div>
              <input
                type="file"
                accept="image/"
                className="mr-5"
                placeholder="Add"
                onChange={handleAImage}
              />
              <p className="text-red-500 mt-2">600 X 200 Recommended</p>
            </div>
          </div>
          <button
            className="block w-full bg-black text-white py-1 px-5 rounded-xl hover:bg-white hover:text-black border-2 border-black transition duration-200 box-border text-l mb-5 font-poppins"
            onClick={handleAddAtsImage}
          >
            Add{" "}
          </button>
          <div class="grid grid-cols-3 gap-4">
            {property && property.ats_image.length > 0 ? (
              property.ats_image.map((id) => (
                <Image
                  id={id}
                  file={aimage}
                  propertyId={property._id}
                  type={"ats_image"}
                />
              ))
            ) : (
              <h2 className="basis-3/4 text-l font-semibold">
                No Images Added.
              </h2>
            )}
          </div>
          <div className="flex mt-14 mb-10">
            <h2 className="basis-3/4 text-xl font-semibold">Slides :</h2>
          </div>
          <div>
            <form action="" className="font-montserrat text-sm">
              <div className="mb-3">
                <input
                  type="file"
                  multiple
                  accept="image/"
                  className="mr-5"
                  onChange={handleSlideImages}
                />
              </div>
              <div className="mb-3">
                <textarea
                  name=""
                  id=""
                  cols=""
                  rows="3"
                  className={`border-2 rounded-xl py-1 px-3  w-full`}
                  placeholder="Slide Description"
                  onChange={handleSlideDescription}
                  value={slide_description}
                ></textarea>
              </div>
            </form>
          </div>
          <button
            className="block w-full bg-black text-white py-1 px-5 rounded-xl hover:bg-white hover:text-black border-2 border-black transition duration-200 box-border text-l mb-5 font-poppins"
            onClick={handleAddSlide}
          >
            Add{" "}
          </button>
          <div class="">
            {property && property.slides.length > 0 ? (
              property.slides.map((id) => (
                <DashBoardSlide
                  id={id}
                  propertyId={property._id}
                  type={"slides"}
                />
              ))
            ) : (
              <h2 className="basis-3/4 text-l font-semibold">
                No Slides Added.
              </h2>
            )}
          </div>
          <div>
            <DashBoardCalender property={property} />
          </div>
        </div>
      </div>
      <Modal
        dismissible
        show={openDeleteModal}
        onClose={() => setOpenDeleteModal(false)}
        popup
      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className="flex flex-col">
            <h2 className="text-2xl text-center">
              Are you sure you want to detete the property
            </h2>
            <div className="flex justify-center mt-5">
              <button
                className="block w-1/4 bg-red-600 text-white py-1 px-5 rounded-xl hover:bg-white hover:text-red-600 border-2 border-red-600 transition duration-200 box-border text-l mb-5 mr-5 font-poppins"
                onClick={handlePropertyDelete}
              >
                Delete
              </button>
              <button
                className="block w-1/4 text-black py-1 px-5 rounded-xl border-2 border-gray-600 box-border text-l mb-5 font-poppins"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenDeleteModal(false);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DashBoardEditProperty;
