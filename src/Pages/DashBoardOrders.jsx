import React, { useState, useEffect } from "react";
import DashBoardItems from "../Components/DashBoardOrderRow";
import { useSelector, useDispatch } from "react-redux";
import { allOrders } from "../Store/orderSlice";
import DashBoardOrderRow from "../Components/DashBoardOrderRow";
import api from "../api/api";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";
import { DateRangePicker } from "react-date-range";
import DashBoardNavbar from "../Components/DashBoardNavbar";
import { onAuthStateChanged } from "firebase/auth";
import { logout, login } from '../Store/userSlice';
import { useNavigate } from "react-router-dom";
import { authentication } from '../firebase/config';

function DashBoardOrders() {
  const order = useSelector((state) => state.order);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [apply, setApply] = useState(false);


  const navigate = useNavigate();
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

              console.log(error)
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

  useEffect(() => {
    dispatch(allOrders());
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (date) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  };

  const handleDateRangeApply = (e) => {
    e.preventDefault();
    setApply(!apply);
  };

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  if (!visible) {
    return <div></div>
  }

  return (
    <>
      <DashBoardNavbar />
      <div className="md:container mx-auto pt-5 md:px-10 px-6 mb-5">
        <div>
          <div className="md:container mx-auto relative">
            <div>
              <h2 className="text-center text-3xl mb-9">Order</h2>
            </div>
            <div>
              <div>

              </div>
              <input
                type="text"
                className="w-full border-2 rounded-xl py-1 px-5 font-montserrat mb-5"
                value={search}
                onChange={handleSearch}
                placeholder="Search by User Name or Property Name"
              />
              <button
                className="block text-center w-full bg-black text-white py-1 px-5 rounded-xl hover:bg-white hover:text-black border-2 border-black transition duration-200 box-border text-l mb-5 font-poppins"
                onClick={handleDateRangeApply}>
                {!apply ? "Apply Date Filter" : "Remove Date Filter"}
              </button>
              <div>
                {apply && (
                  <DateRangePicker
                    ranges={[selectionRange]}
                    onChange={handleSelect}
                    className="w-full"
                  />
                )}
              </div>
            </div>
            <div className="">
              <div className="md:flex hidden mb-5 text-center text-xl">
                <div className="basis-1/6">
                  <h3>Name</h3>
                </div>
                <div className="basis-1/6">
                  <h3>Accomodation</h3>
                </div>
                <div className="basis-1/4">
                  <h3>Property</h3>
                </div>
                <div className="basis-1/3">
                  <h3>Check-In</h3>
                </div>
                <div className="basis-1/6">
                  <h3>Check-Out</h3>
                </div>
                <div className="basis-1/6">
                  <h3></h3>
                </div>
              </div>
              <hr className="border border-black" />
            </div>
          </div>
        </div>
        {/* {formattedOrders &&
          formattedOrders.filter(item => {
            return search.toLowerCase() === '' ? item : item.user.name.includes(search) || item.property.title.includes(search);
          }).map((formattedOrder) => <DashBoardOrderRow order={formattedOrder.order} user={formattedOrder.user} property={formattedOrder.property}/>)} */}
        {order &&
          order.allOrders.map((order) => (
            <DashBoardOrderRow apply={apply} startDate={startDate} endDate={endDate} search={search} order={order} />
          ))}
      </div>
    </>
  );
}

export default DashBoardOrders;
