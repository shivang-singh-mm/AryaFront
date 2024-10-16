import React, { useEffect, useState } from "react";
import api from "../api/api";
import { BiTrash } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { deleteSlide, editSlide } from "../Store/slideSlice";
import { useDispatch } from "react-redux";

const DashBoardSlide = ({ id, propertyId, type }) => {
  const dispatch = useDispatch();
  const [slide, setSlide] = useState();
  const [image, setImage] = useState();
  const [disableSlide_description,setDisableSlide_description] = useState(true);
  const [slide_description,setSlide_description] = useState();

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

  const handleImage = async (e) => {
    e.preventDefault();
    const base64 = await convertBase64(e.target.files[0]);
    setImage(base64);
  };

  const handleSlideDescription = (e) => {
    setSlide_description(e.target.value);
  }

  const handleEditSlideDescription = () => {
    setDisableSlide_description(false);
  }

  const handleEditSlide = (e) => {
    e.preventDefault();
    const newSlide = {description:slide_description};
    const updatedSlide = {id, newSlide}
    dispatch(editSlide(updatedSlide));
    setDisableSlide_description(true);
  }

  const getSlide = async () => {
    const response = await api.get(`/api/v1/slide/${id}`);
    setSlide(response.data[0]);
  };

  const handleImageEdit = (e,public_id) => {
    e.preventDefault();
    const newSlide = {image,public_id};
    const updatedSlide = {id, newSlide}
    dispatch(editSlide(updatedSlide));
  }

  // const handleImageDelete = (e) => {
  //   e.preventDefault();
    
    
  // }

  const handleSlideDelete = (e) => {
    e.preventDefault();
    const propertyDetails = { propertyId, type}
    const data = {id, propertyDetails};
    dispatch(deleteSlide(data));
  }

  useEffect(() => {
    if(slide) {
      setSlide_description(slide.description);
    }
  }, [slide]);

  useEffect(() => {
    getSlide();
  }, []);

  return (
    <div className="border-2 border-blue-600 rounded-xl px-5">
      <div className="flex mt-14 mb-10 justify-between">
        <input
          type="file"
          accept="image/"
          className="mr-5"
          placeholder="Add"
          onChange={handleImage}
        />
         <button onClick={handleSlideDelete}>
                    <BiTrash className="block mx-auto bg-red-500 text-white p-3 text-5xl rounded-xl hover:bg-red-600 hover:cursor-pointer" />
                  </button>
      </div>
      <div class="grid grid-cols-3 gap-4">
        {(slide && slide.images.length) &&
          slide.images.map((image) => (
            <div class="w-full bg-white p-3 drop-shadow-2xl">
              <img class="h-52 w-full object-cover" src={image.url} />
              <ul class="mt-3 flex flex-wrap justify-around">
                <li class="">
                  <button onClick={(e) => handleImageEdit(e, image.public_id)}>
                    <FaRegEdit className="block mx-auto bg-green-500 text-white p-3 text-5xl rounded-xl hover:bg-green-600 hover:cursor-pointer mb-5" />
                  </button>
                </li>
                {/* <li class="">
                  <button onClick={handleImageDelete}>
                    <BiTrash className="block mx-auto bg-red-500 text-white p-3 text-5xl rounded-xl hover:bg-red-600 hover:cursor-pointer" />
                  </button>
                </li> */}
              </ul>
            </div>
          ))}
      </div>
      <div className="my-3">

            <textarea
              name=""
              id=""
              cols=""
              rows="3"
              className={`border-2 rounded-xl py-1 px-3 mt-5 w-full text-black`}
              placeholder="Surrounding Description"
              onChange={handleSlideDescription}
              value={slide_description}
            ></textarea>
            <button
            className="block w-full bg-[#F79489] text-white py-1 px-5 rounded-full hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border text-l my-3 font-poppins"
            onClick={handleEditSlide}
          >
            Save
          </button>
          </div>
    </div>
  );
};

export default DashBoardSlide;
