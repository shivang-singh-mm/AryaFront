import React, { useEffect, useState } from "react";
import { Modal } from "flowbite-react";
import { useDispatch } from "react-redux";
import { createCard } from "../Store/cardSlice";

const AddCardModal = ({ openModal, setOpenModal }) => {
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

  const handleCreateCard = (e) => {
    e.preventDefault();
    if (!icon || !title || !description) {
      alert("Fill the missing details");
      return;
    }
    const newCard = { icon, title, description };
    dispatch(createCard(newCard));
    setOpenModal(false);
  };

  useEffect(() => {
    setTitle();
    setDescription();
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
            Add Card
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
              <p className="text-red-500">351 Characters Recommended</p>
            </div>
            <button
              className="block w-full bg-[#F79489] text-white py-2 px-5 rounded-full hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border text-l mb-3 font-poppins"
              onClick={handleCreateCard}
            >
              Add
            </button>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default AddCardModal;
