import React, { useEffect, useState } from "react";
import { useDispatch,useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { deleteOrder, editOrder } from "../Store/orderSlice";
import api from "../api/api";
import { onAuthStateChanged } from "firebase/auth";
import { logout, login } from '../Store/userSlice';
import { authentication } from '../firebase/config';

const DashBoardSingleOrder = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [amenitiesPrice, setAmenitiesPrice] = useState();
  const [property, setProperty] = useState();
  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [formattedAmenities, setFormattedAmenities] = useState();

  const curruser = useSelector(state => state.user);

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

  const handleAccept = () => {
    const updatedOrder = { id: order._id };
    const newOrder = { status: "accepted" };
    updatedOrder.newOrder = newOrder;
    dispatch(editOrder(updatedOrder)).then((res) => setOrder(res.payload));

    let msg = `
  Dear ${user.name},
    
We are delighted to inform you that your booking request for our homestay has been confirmed. We are thrilled to welcome you to our home and hope you have a wonderful stay.

To complete your web check-in, please click on the following link:

https://development.dwpu3zn4uaepb.amplifyapp.com/
    
Please ensure that you complete the web check-in for all guests who will be accompanying you.
    
If you have any questions or require further assistance, please do not hesitate to contact us at +91 7999913023. We are committed to ensuring that your homestay experience is truly exceptional.
    
Thank you for choosing Aarya Stays. We look forward to welcoming you soon.
    
Sincerely,
    
Rohit Arya`;

    const whatsappmsg = convertToWhatsAppMessageTextFormat(msg);
    window.open(
      `https://api.whatsapp.com/send?phone=${user.phone}&text=${whatsappmsg}`
    );
  };

  function convertToWhatsAppMessageTextFormat(string) {
    return string.replace(/\n/g, "%0D%0A").replace(/ /g, "%20");
  }

  const handleReject = () => {
    let msg = `Dear ${user.name},

We regret to inform you that your booking request for our homestay from ${formatDate(order.check_in)} to ${formatDate(order.check_out)} cannot be accommodated due to limited availability during this period. We sincerely apologize for any inconvenience this may cause.
    
To ensure you have comfortable accommodations during your stay, we would be happy to assist you in finding an alternative homestay in a nearby area. Please feel free to contact us at +91 7999913023 to discuss your preferences and explore available options.
    
Thank you for your understanding. We hope to have the opportunity to host you in the future.
    
Sincerely,
    
Rohit Arya`;

    const whatsappmsg = convertToWhatsAppMessageTextFormat(msg);
    window.open(
      `https://api.whatsapp.com/send?phone=${user.phone}&text=${whatsappmsg}`
    );
    dispatch(deleteOrder(order._id));
    navigate("/dashboard/order");
  };

  const getUser = async () => {
    const response = await api.get(`api/v1/user/${order.userId}`);
    setUser(response.data);
  };

  const getProperty = async () => {
    const response = await api.get(`api/v1/property/${order.propertyId}`);
    setProperty(response.data);
  };

  const getOrder = async () => {
    const response = await api.get(`api/v1/order/${id}`);
    setOrder(response.data[0]);
  };

  const getFormatedAmenities = async () => {
    const amenities = await Promise.all(
      order.amenities.map(async (amenity) => {
        const response = await api.get(`/api/v1/amenity/${amenity.id}`);
        const formatedAmenity = {
          title: response.data.title,
          price: amenity.price,
          qty: amenity.qty,
        };
        return formatedAmenity;
      })
    );
    setFormattedAmenities(amenities);
  };

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
    if (order) {
      getUser();
      getProperty();
      getFormatedAmenities();

      const totalSum = order.amenities.reduce((accumulator, amenity) => {
        return accumulator + amenity.price * amenity.qty;
      }, 0);
      setAmenitiesPrice(totalSum);
    }
  }, [order]);

  if(!visible){
    return <div></div>
  }

  return (
    <div className="h-screen">
      <div className="sm:container h-full mx-auto flex flex-col justify-center content-center items-center">
        <div className="md:w-1/3 w-3/4 md:py-3 px-5 shadow-2xl border-2 border-black rounded-xl">
          <h2 className="text-3xl font-poppins text-center mb-5">
            Order Details
          </h2>
          <div className="mb-1 text-lg">
            <h2>Customer Name : {user?.name}</h2>
          </div>
          <div className="mb-1 text-lg">
            <h2>Property : {property?.title}</h2>
          </div>
          <div className="mb-1 text-lg">
            <h2>Accomodation : {order?.accomodation}</h2>
          </div>
          {order && order?.accomodation === "private-rooms" && <div className="mb-1 text-lg">
            <h2>Private Rooms : {order?.privateRooms}</h2>
          </div>}
          <div className="mb-1 text-lg">
            <h2>
              Guests :{" "}
              {`${order?.guest?.adult} adults and ${order?.guest?.children} children`}
            </h2>
          </div>
          <div className="mb-1 text-lg">
            <h2>Total Price : ₹{order?.totalPrice}</h2>
          </div>
          <div className="mb-1 text-lg">
            <h2>
              Amenities :{" "}
              {formattedAmenities?.map(
                (amenity) =>
                  `${amenity.title}, Price: ₹${amenity.price}, qty: ${amenity.qty}`
              )}
            </h2>
          </div>
          <div className="mb-1 text-lg">
            <h2>Amenities Price : ₹{amenitiesPrice}</h2>
          </div>
          <div className="mb-1 text-lg">
            <h2>Check In : {formatDate(order?.check_in)}</h2>
          </div>
          <div className="mb-1 text-lg">
            <h2>Check Out : {formatDate(order?.check_out)}</h2>
          </div>
          <div className="mb-1 text-lg">
            <h2>Phone : {user?.phone}</h2>
          </div>
          <div className=" text-lg">
            <h2>Email: {user?.email}</h2>
          </div>
          <div className=" text-lg">
            <h2>Status: {order?.status}</h2>
          </div>
        </div>
        <div>
          <div className="flex mt-5 w-full">
            <button
              className="block bg-[#F79489] text-white py-1 px-5 rounded-full ml-9 hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border"
              onClick={handleAccept}
            >
              Accept
            </button>
            <button
              className="block bg-black text-white py-1 px-5 rounded-full ml-9 hover:bg-white hover:text-black border-2 border-black transition duration-200 box-border"
              onClick={handleReject}
            >
              Reject
            </button>
            {/* <Link
          className="block bg-[#F79489] text-white py-1 px-5 rounded-full ml-9 hover:bg-white hover:text-[#F79489] border-2 border-[#F79489] transition duration-200 box-border" to="/dashboard/order" state = {{order,property, user}}
        >
          View More
        </Link> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoardSingleOrder;
