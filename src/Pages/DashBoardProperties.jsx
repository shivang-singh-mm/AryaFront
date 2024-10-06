import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import DashBoardNavbar from "../Components/DashBoardNavbar";
import DashBoardPropertyRow from "../Components/DashBoardPropertyRow";
import { onAuthStateChanged } from "firebase/auth";
import { getAllProperties } from "../Store/propertySlice";
import { Link } from "react-router-dom";
import api from "../api/api";
import { logout, login } from '../Store/userSlice';
import { authentication } from '../firebase/config';
import { useNavigate } from "react-router-dom";


function DashBoardProperties() {
  const properties = useSelector((state) => state.property);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [openModal, setOpenModal] = useState();
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();
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



  useEffect(() => {
    dispatch(getAllProperties());
  }, []);

  const handleSearch = (e) => {
    setSearch(e.target.value);
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
              <h2 className="text-center text-3xl mb-9">Properties</h2>
            </div>
            <div>
              <input type="text" className='w-full border-2 rounded-xl py-1 px-5 font-montserrat mb-5' value={search} onChange={handleSearch} placeholder="Search by Property Name" />
            </div>
            <div>
              <Link
                className="block text-center w-full bg-[#F79489] text-white py-1 px-5 rounded-xl hover:bg-white hover:text-[#F79489] border-2 border-secondary transition duration-200 box-border text-l mb-5 font-poppins" to="/dashboard/property/add"
              >
                Add Property
              </Link>
              {/* <input type="text" className='w-full border-2 rounded-xl py-2 px-5 font-montserrat' value={search} onChange={handleSearch} placeholder="Search by Name or Id"/> */}
            </div>
            <div className="">
              <div className="md:flex hidden mb-5 text-center text-xl">
                <div className="basis-1/3">
                  <h3>Id</h3>
                </div>
                <div className="basis-1/3">
                  <h3>Title</h3>
                </div>
                <div className="basis-1/3">
                  <h3>Location</h3>
                </div>
                <div className="basis-1/4">
                  <h3></h3>
                </div>
              </div>
              <hr className="border border-black" />
            </div>
          </div>
        </div>
        {properties &&
          properties.allProperties.map((property) => <DashBoardPropertyRow search={search} property={property} />)}
      </div>
    </>
  );
}

export default DashBoardProperties;
