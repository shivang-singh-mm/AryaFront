
import React, { useEffect, useState } from 'react'
import { Label, TextInput, Button } from 'flowbite-react';
import NavbarC from '../Components/NavbarC';
import FooterC from '../Components/FooterC';
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { createUser, editUser, getUserById } from '../Store/userSlice';
import { authentication } from '../firebase/config';
import { useNavigate } from 'react-router-dom';
import { Toast } from 'flowbite-react';
import { HiCheck, HiExclamation, HiX } from 'react-icons/hi';
import logo from '../Resources/logo.png'
import img from '../Resources/profile-page-img.png'
import ScrollToTop from '../ScrollToTop';

export default function Profile() {

    const dispatch = useDispatch();
    const user = useSelector(state => state.user);

    const[editName,setEditName] = useState(false)
    const[editEmail,setEditEmail] = useState(false)
    const[editNumber,setEditNumber] = useState(false)
    const[editAge,setEditAge] = useState(false)

    const[name,setName] = useState('');
    const[email,setEmail] = useState('')
    const[number,setNumber] = useState('');
    const[age,setAge] = useState('')

    const changeEditAge = () => {
        setEditAge(false);
    }

    const changeEditNumber = () => {
        setEditNumber(false);
    }


    const changeEditName = () =>{
        setEditName(false);
    }

    const changeEditEmail = () =>{
        setEditEmail(false);
    }

    const [success,setSuccess] = useState(false)
//     const { pathname } = useLocation();

//   useEffect(() => {
//     window.scrollTo(-100, -100)
//   }, [pathname]);

    const saveChanges = () =>{
        if(!name || !email || !number || !age) {
            alert("Please fill the missing details");
        } else {
            if(Object.keys(user.userDetails).length == 0) {
                const userDetails ={_id:user.user.uid, name, email, phone: Number(number),age:Number(age)}
                dispatch(createUser(userDetails));

            } else {
                const updatedUser = {id:user.user.uid};
                const newUser = {};

                if(!editName) newUser.name = name;
                if(!editEmail) newUser.email = email;
                if(!editNumber) newUser.number = Number(number);
                if(!editAge) newUser.age = Number(age);

                updatedUser.newUser = newUser;
                dispatch(editUser(updatedUser));
            }
            // saveChanges; update user data using post request
           
            setEditName(true);
            setEditEmail(true);
            setEditNumber(true);
            setEditAge(true);
        }
        
    }

    const [userget,setUser] = useState(null)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const unsubscribe = authentication.onAuthStateChanged(async (currentUser) => {
            if (currentUser) {
              setUser(currentUser);
              setLoading(false); 
      
            } else {
              setUser(null);
              setLoading(false); 
            }
          });
      
          return () => unsubscribe();
    }, []);

    const navigate = useNavigate()
    useEffect(() => {
        if(!loading && userget === null){
            alert("you must me logged in")
            navigate('/')
        }
        if(!loading && userget){
            dispatch(getUserById(userget.uid));
        }
    },[userget, loading])


    useEffect(() => {

        if(Object.keys(user.userDetails).length > 0) {
            setName(user.userDetails.name);
            setEmail(user.userDetails.email);
            setAge(user.userDetails.age);
            setNumber(user.userDetails.phone);

            setEditName(true);
            setEditEmail(true);
            setEditNumber(true);
            setEditAge(true);
        }
    },[user.userDetails]);

  return (
    <div>
        <ScrollToTop />
        <div className="text-center bg-[#B4E2EF] py-2 md:font-medium text-[10px] md:text-base">
        Book your comfortable rooms, even before 60 mins before the check in!
      </div>
        <NavbarC/>
        {/* {success && <Toast>
        <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
          <HiCheck className="h-5 w-5" />
        </div>
        <div className="ml-3 text-sm font-normal">Item moved successfully.</div>
        <Toast.Toggle />
      </Toast>} */}
        <div className='w-full flex flex-wrap px-12 flex-col my-10 md:flex-row'>
            <div className='md:w-2/3 md:px-10 '>
                <h1 className='text-xl font-bold'>Personal Info</h1>
                <div className='flex justify-between mt-4'>
                    
                    <Label htmlFor="">Name</Label>
                    <button onClick={changeEditName} className='text-red-500 text-sm underline'>Edit</button>
                </div>
                <TextInput type="text" id="" placeholder="Your Name" disabled={editName} value={name} onChange={(e) => setName(e.target.value)}/>
                <div className='flex justify-between mt-4'>
                    
                    <Label htmlFor="">Email Id</Label>
                    <button onClick={changeEditEmail} className='text-red-500 text-sm underline'>Edit</button>
                </div>
                <TextInput type="email" id="" placeholder="Your Email Id" disabled={editEmail} value={email} onChange={(e) => setEmail(e.target.value)}/>
                <div className='flex justify-between mt-4'>
                    
                    <Label htmlFor="">Phone Number</Label>
                    <button onClick={changeEditNumber} className='text-red-500 text-sm underline'>Edit</button>
                </div>
                <TextInput type="number" id="" placeholder="Your Phone Number" disabled={editNumber} value={number} onChange={(e) => setNumber(e.target.value)}/>
                <div className='flex justify-between mt-4'>
                    
                    <Label htmlFor="">Age</Label>
                    <button onClick={changeEditAge} className='text-red-500 text-sm underline'>Edit</button>
                </div>
                <TextInput type="number" id="" placeholder="Age" disabled={editAge} value={age} onChange={(e) => setAge(e.target.value)}/>
                
                <h1 className='font-medium text-green-600 my-4'>Tip: Add above details for faster Web Check-In</h1>
                <Button color="success" onClick={saveChanges} disabled={editName && editEmail && editNumber && editAge} >Save</Button>
            </div>
            <div className='md:w-1/3 hidden md:flex rounded-lg border-2 px-8 py-5 flex-col items-center  border-slate-200'>
                {/* <h1 className="text-4xl font-bold">Profile</h1> */}
                {/* <div> */}
                    <img src={logo} className="w-1/2 mb-4" alt="Aarya Stays Logo" />
                    <div>
                        <h1 className='text-[1.05rem]'>Your peaceful, comfortable, and secure home away from home in Thane. Relax with your family, friends, or colleagues at Aarya Stays, with customizable services.</h1>
                    </div>
                    <img src={img} className='w-1/2 mt-4'></img>
                    <div>
                        <h1 className='text-[1.05rem]'>Kitchen access included with every booking, cook your own meals or order from one of our on-demand home chefs On-demand Air-Conditioner for your needs according to Mumbai’s dynamic Wheather for affordable Homestays.</h1>
                    </div>
                {/* </div> */}
                
            </div>
        </div>
        <FooterC/>
    </div>
  )
}
