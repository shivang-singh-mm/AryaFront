import React, { useState, useEffect } from "react";
import api from "../api/api";
import { Link } from "react-router-dom";

function DashBoardPropertyRow({ search, property }) {
  
  const searchLowercase = search.toLowerCase();
  if(property.title.toLowerCase().includes(searchLowercase)){
    return (
      <div className="md:flex w-full text-center py-9 md:justify-center content-center items-center border-b-2 border-black">
        <div className="basis-1/4 mb-3">
          <h2 className="text-l">{property?._id}</h2>
        </div>
        <div className="basis-1/4 mb-3">
          <h2 className="text-l">{property?.title}</h2>
        </div>
        <div className="basis-1/4 mb-3">
          <h2 className="text-l">{property?.location}</h2>
        </div>
        {/* <div className="basis-1/6 mb-3">
          <h2 className="text-l">{formatDate(order.check_in)}</h2>
        </div>
        <div className="basis-1/6 mb-3">
          <h2 className="text-l">{formatDate(order.check_out)}</h2>
        </div> */}
        <div className="basis-1/6 mb-3">
          <Link
            className="block bg-[#F79489] text-white py-1 px-5 rounded-full ml-9 hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border" to={`/dashboard/property/${property._id}`}
          >
            View More
          </Link>
        </div>
      </div>
    );
  } else {
    <></>
  }

  
}

export default DashBoardPropertyRow;
