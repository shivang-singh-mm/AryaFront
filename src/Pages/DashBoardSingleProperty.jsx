import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate, useParams } from 'react-router-dom';
import { deleteOrder, editOrder } from '../Store/orderSlice';
import api from "../api/api";
import { onAuthStateChanged } from "firebase/auth";
import { logout, login } from '../Store/userSlice';
import { authentication } from '../firebase/config';

const DashBoardSingleProperty = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  
  const navigate = useNavigate();
  const [property, setProperty] = useState();

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


  const getProperty = async () => {
    const response = await api.get(`api/v1/property/${id}`);
    setProperty(response.data);
  };

  useEffect(()=>{
    getProperty();
  },[]);



  if(!visible){
    return <div></div>
  }
  return (
    <div className='h-screen'>
      {/*  */}
      
    </div>
  )
}

export default DashBoardSingleProperty;