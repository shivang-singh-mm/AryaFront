import React, { useState, useEffect } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { editCard } from "../Store/cardSlice";

const EditCardModal = ({ id, openModal, setOpenModal }) => {
  const [title, setTitle] = useState();

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

  const handleUpdateCard = (e) => {
    e.preventDefault();
    const newCard = {};
    if (icon) newCard.icon = icon;
    if (title) newCard.title = title;
    if (description) newCard.description = description;
    const updatedCard = { id, newCard };

    dispatch(editCard(updatedCard));
    setOpenModal(false);
  };

  useEffect(() => {
    setTitle("");
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
          <h2 className="text-3xl mb-3 text-center font-poppins">Edit Card</h2>
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
                  Height: 58px and Width: 58px Recommended
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
              onClick={handleUpdateCard}
            >
              Edit
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default EditCardModal;
