import React, { useState, useEffect } from "react";
import DashBoardItems from "../Components/DashBoardOrderRow";
import { useSelector, useDispatch } from "react-redux";
import { allOrders } from "../Store/orderSlice";
import DashBoardOrderRow from "../Components/DashBoardOrderRow";
import { getAllAmenity } from "../Store/amenitySlice";
import DashBoardAmenityRow from "../Components/DashBoardAmenityRow";
import AddAmenityModal from "../Components/AddAmenityModal";
import DashBoardNavbar from "../Components/DashBoardNavbar";
import { onAuthStateChanged } from "firebase/auth";
import api from "../api/api";
import { logout, login } from '../Store/userSlice';
import { useNavigate } from "react-router-dom";
import { authentication } from '../firebase/config';


function DashBoardAmenities() {
  const amenitites = useSelector((state) => state.amenity);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [openModal,setOpenModal] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllAmenity());
  }, []);

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


 if(!visible){
  return <div></div>
}
  return (
    <>
    <DashBoardNavbar/>
      <div className="md:container mx-auto pt-5 md:px-10 px-6 mb-5">
        <div>
          <div className="md:container mx-auto relative">
            <div>
              <h2 className="text-center text-3xl mb-9">Amenities</h2>
            </div>
            <div>
            <button className='block w-full bg-[#F79489] text-white py-1 px-5 rounded-xl hover:bg-white hover:text-[#F79489] border-2 border-secondary transition duration-200 box-border text-l mb-5 font-poppins' onClick={() => setOpenModal(true)}>Add Amenity</button>
            {/* <input type="text" className='w-full border-2 rounded-xl py-2 px-5 font-montserrat' value={search} onChange={handleSearch} placeholder="Search by Name or Id"/> */}
            </div>
            <div className="">
              <div className="md:flex hidden mb-5 text-center text-xl">
                <div className="basis-1/8">
                  <h3>Icon</h3>
                </div>
                <div className="basis-1/6">
                  <h3>Title / Type</h3>
                </div>
                <div className="basis-1/6">
                  <h3>Price</h3>
                </div>
                <div className="basis-1/3">
                  <h3>Description</h3>
                </div>
                <div className="basis-1/5">
                  <h3></h3>
                </div>

              </div>
              <hr className="border border-black" />
            </div>
          </div>
        </div>
        {amenitites &&
          amenitites.allAmenities.map((amenity) => <DashBoardAmenityRow amenity = {amenity} />)}
          <AddAmenityModal openModal={openModal} setOpenModal={setOpenModal}/>
      </div>
    </>
  );
}

export default DashBoardAmenities;
