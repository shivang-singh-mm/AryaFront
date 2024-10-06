import React, { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { editAmenity, getAllAmenity } from "../Store/amenitySlice";
import { useDispatch, useSelector } from "react-redux";

const EditAmenityModal = ({ amenity, openModal, setOpenModal }) => {
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();
  const [type, setType] = useState(amenity.type);
  const [description, setDescription] = useState();
  const [icon, setIcon] = useState();
  const dispatch = useDispatch();

  const setFileToBase = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setIcon(reader.result);
    };
  };

  const handleIcon = (files) => {
    const file = files[0];
    setFileToBase(file);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleDescription = (e) => {
    setDescription(e.target.value);
  };

  const handlePrice = (e) => {
    setPrice(e.target.value);
  };

  const handleUpdateAmity = (e) => {
    e.preventDefault();
    const newAmenity = {};
    if (icon) newAmenity.icon = icon;
    if (type) newAmenity.type = type;
    if (title) newAmenity.title = title;
    if (description) newAmenity.description = description;
    if (price) newAmenity.price = Number(price);
    const updatedAmenity = { id: amenity._id, newAmenity };

    dispatch(editAmenity(updatedAmenity));
    setOpenModal(false);
  };

  useEffect(() => {
    setTitle("");
    setType("essential");
    setPrice();
    setDescription("");
    setIcon();
  }, [openModal]);

  return (
    <Modal
      dismissible
      show={openModal}
      onClose={() => setOpenModal(false)}
      popup
    >
      <Modal.Header></Modal.Header>
      <Modal.Body>
        <div className="bg-white px-8 py-5 rounded mx-auto box-border">
          <h2 className="text-3xl mb-3 text-center font-poppins">
            Edit Amenity
          </h2>
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
                type="number"
                onChange={handlePrice}
                value={price}
                className="border-2 rounded-xl py-1 px-3  w-full"
                placeholder="Price"
              />
            </div>
            <div className="mb-3 flex">
              <label htmlFor="" className=" text-gray-400 mr-2 text-lg">
                Icon:{" "}
              </label>
              <div>
                <input
                  type="file"
                  accept="image/"
                  onChange={(e) => handleIcon(e.target.files)}
                />
                <p className="text-red-500 mt-1 text-md">
                  Height: 54px and Width: 64px Recommended
                </p>
              </div>
            </div>
            <div className="mb-3">
              <textarea
                name=""
                id=""
                cols=""
                rows="3"
                className="border-2 rounded-xl py-1 px-3 w-full"
                placeholder="Description"
                onChange={handleDescription}
                value={description}
              ></textarea>
            </div>
            <button
              className="block w-full bg-green-500 text-white py-2 px-5 rounded-full hover:bg-white hover:text-green-500 border-2 border-green-500 transition duration-200 box-border text-l mb-3 font-poppins"
              onClick={handleUpdateAmity}
            >
              Edit
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditAmenityModal;
