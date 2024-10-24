import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { logout, login } from '../Store/userSlice';
import api from "../api/api";
import { authentication } from '../firebase/config';
import { createFaq } from "../Store/faqSlice";
import DashBoardNavbar from "../Components/DashBoardNavbar";
import { createAdmin } from "../Store/adminSlice";

const DashBoardAddAdmin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    const [email, setEmail] = useState();
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



    const handleEmail = (e) => {
        setEmail(e.target.value);
    };


    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        if (
            !email
        ) {
            alert("Please Fill the missing values");
        }
        const newAdmin = {
            email
        };
        const payload = await dispatch(createAdmin(newAdmin)).unwrap();
        // setPayload(payload);
        setEmail('');
    };

    //   useEffect(() => {
    //     if(payload) {
    //       navigate(`/dashboard/property/${payload._id}`)
    //     }
    //   },[payload])


    if (!visible) {
        return <div></div>
    }
    return (
        <div>
            <DashBoardNavbar />
            <div className="bg-white px-8 py-5 rounded mx-auto box-border w-3/5">
                <h2 className="text-3xl mb-3 text-center font-poppins">Add Admin</h2>
                <form action="" className="font-montserrat text-sm">

                    <div className="mb-3">
                        <input
                            type="email"
                            className="border-2 rounded-xl py-1 px-3  w-full"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>




                    <button
                        className="block w-full bg-[#F79489] text-white py-2 px-5 rounded-full hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border text-l mb-3 font-poppins"
                        onClick={handleCreateAdmin}
                    >
                        Add
                    </button>
                </form>
            </div>
        </div>
    );
};

export default DashBoardAddAdmin;