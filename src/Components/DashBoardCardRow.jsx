import React, { useState, useEffect } from "react";
import { BiTrash } from "react-icons/bi";
import { FaRegEdit } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import EditCardModal from "./EditCardModal";
import { deleteCard } from "../Store/cardSlice";


function DashBoardCardRow({ card }) {
  const dispatch = useDispatch();
  const [openModal, setOpenModal] = useState();
  const handleDelete = () => {
    dispatch(deleteCard(card._id));
  };

  return (
    <div className="md:flex text-center py-9 md:justify-center content-center items-center border-b-2 border-black">
      <div className="md:flex w-full text-center py-9 md:justify-center content-center items-center">
        <div className="flex basis-1/8 mb-3">
          <img
            src={card.icon.url}
            alt=""
            className="w-2/3 block md:mr-5 md:ml-0 mx-auto"
          />
          <div className="self-center "></div>
        </div>
        <div className="basis-1/6 mb-3">
          <h2 className="text-l font-semibold hidden md:block">
            {card.title} 
          </h2>
        </div>
        <div className="basis-1/2 mb-3">
          <h2 className="text-xl">{card.description}</h2>
        </div>
        <div className="flex flex-col basis-1/4 mb-3">
          <button onClick={() => setOpenModal(true)}>
            <FaRegEdit className="block mx-auto bg-green-500 text-white p-3 text-5xl rounded-xl hover:bg-green-600 hover:cursor-pointer mb-5" />
          </button>
          <button onClick={handleDelete}>
            <BiTrash className="block mx-auto bg-red-500 text-white p-3 text-5xl rounded-xl hover:bg-red-600 hover:cursor-pointer" />
          </button>
          <EditCardModal
            id={card._id}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </div>
      </div>
    </div>
  );
}

export default DashBoardCardRow;
