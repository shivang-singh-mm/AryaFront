import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import api from "../api/api";
import { Link } from "react-router-dom";

function DashBoardOrderRow({ apply, startDate, endDate, search, order }) {
  const [user, setUser] = useState();
  const [property, setProperty] = useState();

  const getUser = async () => {
    const response = await api.get(`api/v1/user/${order.userId}`);
    setUser(response.data);
  };

  const getProperty = async () => {
    const response = await api.get(`api/v1/property/${order.propertyId}`);
    setProperty(response.data);
  };

  const formatDate = (isoDateString) => {
    const dateObject = new Date(isoDateString);

    const formattedDateString = dateObject.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "short",
      day: "numeric",
    });

    return formattedDateString;
  };

  useEffect(() => {
    getUser();
    getProperty();
  }, [order]);

  if (!property || !user) {
    return <></>;
  }

  const searchLowercase = search.toLowerCase();

  const propertyContainsSearchTerm = property.title
    .toLowerCase()
    .includes(searchLowercase);
  const userContainsSearchTerm = user.name
    .toLowerCase()
    .includes(searchLowercase);


  if ((propertyContainsSearchTerm || userContainsSearchTerm) && (!apply ||
  (new Date(startDate) <= new Date(order.check_in) &&
  new Date(order.check_in) <= new Date(endDate)))) {
      return (
        <div className="md:flex text-center py-9 md:justify-center content-center items-center border-b-2 border-black">
          <div className="basis-1/6 mb-3">
            <h2 className="text-l">{user?.name}</h2>
          </div>
          <div className="basis-1/8 mb-3">
            <h2 className="text-l">{order.accomodation}</h2>
          </div>
          <div className="basis-1/4 mb-3">
            <h2 className="text-l">{property?.title}</h2>
          </div>
          <div className="basis-1/6 mb-3">
            <h2 className="text-l">{formatDate(order.check_in)}</h2>
          </div>
          <div className="basis-1/6 mb-3">
            <h2 className="text-l">{formatDate(order.check_out)}</h2>
          </div>
          <div className="basis-1/6 mb-3">
            <Link
              className="block bg-[#F79489] text-white py-1 px-5 rounded-full ml-9 hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border"
              to={`/dashboard/order/${order._id}`}
            >
              View More
            </Link>
          </div>
        </div>
      );
  } else {
    <></>;
  }
}

export default DashBoardOrderRow;
