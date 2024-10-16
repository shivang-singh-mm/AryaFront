import React, { useEffect } from 'react'
import { Avatar, Dropdown, Navbar } from 'flowbite-react';
import { Button, Modal } from 'flowbite-react';
import logo from '../Resources/logo.png'
import user1 from '../Resources/user1.png'
import { useState } from 'react';
import { authentication } from '../firebase/config';
import { GoogleAuthProvider, RecaptchaVerifier, signInWithPhoneNumber, signInWithPopup, OAuthProvider, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { Link, useNavigate } from 'react-router-dom';
import { logout, login } from '../Store/userSlice';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import api from '../api/api';

export default function NavbarC() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const user = useSelector(state => state.user);
  const [openModal, setOpenModal] = useState(false);
  const [otpsent, setOtpSent] = useState(false);

  const [selectedCountry, setSelectedCountry] = useState('India(+91)');
  const [selectedCountryCode, setSelectedCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState();

  const [OTP, setOTP] = useState();
  // const [user,setUser] = useState();

  const [showEmail, setShowEmail] = useState(false)
  const [emailAddress, setEmailAddress] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isRegestering, setIsRegestering] = useState(false)
  const [signoutConfirmation, setSignoutConfirmation] = useState(false)
  const [role, setRole] = useState('')
  const [isHovered, setIsHovered] = useState(false);


  const buttonStyle = {
    cursor: 'pointer',
    // transform: isHovered ? 'scale(1.2)' : 'scale(1)',
    transition: 'transform 0.2s ease-in-out',
  };

  const generateRecaptcha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(authentication, 'recaptcha-container', {
      'size': 'invisible',
      'callback': (response) => {
      }
    });
  }

  const handleOtpsent = () => {
    if (phoneNumber.length == 10) {
      setOtpSent(true);
      generateRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      signInWithPhoneNumber(authentication, selectedCountryCode + phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
        }).catch((error) => {
          console.log("error")
        });
    } else {
      alert("Enter valid phone number")
    }
  }



  const change = (selectedcountry, countrycode) => {
    setSelectedCountry(selectedcountry);
    setSelectedCountryCode(countrycode);
  }

  const handleVerifyOtp = () => {
    let confirmationResult = window.confirmationResult
    confirmationResult.confirm(OTP).then((result) => {
      // User signed in successfully.
      const user = result.user;
      navigate('/profile')
      // ...
    }).catch((error) => {
      // User couldn't sign in (bad verification code?)
      // ...
    });
  }

  const handleGoogleSignIn = () => {
    const provider = new GoogleAuthProvider()
    signInWithPopup(authentication, provider).then((result) => {
      const user = result.user;
      navigate('/profile')
    }).catch((error) => {
      // Handle Errors here.
      console.log(error)
    });
  }

  const handleAppleSignIn = () => {
    const provider = new OAuthProvider('apple.com');
    signInWithPopup(authentication, provider).then((result) => {
      const user = result.user;
      navigate('/profile')
    }).catch((error) => {
      // Handle Errors here.
      console.log(error)
    });
  }

  const handleRegister = () => {
    if (password == confirmPassword) {
      createUserWithEmailAndPassword(authentication, emailAddress, password).then((userCredential) => {
        const user = userCredential.user;
        navigate('/profile')
      })
        .catch((error) => {
          console.log(error)
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
    } else {
      alert("Password and confirm password should be same")
    }
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(authentication, emailAddress, password).then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      navigate('/profile')
      // ...
    })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  const handleSignOut = () => {
    signOut(authentication).then(() => {
      dispatch(logout());
      navigate('/');
    }).catch((error) => {
      console.log(error);
    });
  }

  // useEffect(() => {
  //   onAuthStateChanged(authentication, (user) => {
  //     if (user) {
  //       // User is signed in, see docs for a list of available properties
  //       // https://firebase.google.com/docs/reference/js/firebase.User
  //       const uid = user.uid;

  //     } else {
  //       // User is signed out
  //       // ...
  //     }
  //   });
  // },[])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get(`/api/v1/user/${user.user.uid}`);
        setRole(response.data.isAdmin);
        // Process the data fetched from the API call here
      } catch (error) {
        // Handle any errors that occur during the API call
        console.error('Error fetching user data:', error);
      }
    };

    if (user && user.user && user.user.uid) {
      fetchData();
    }
  }, [user])



  useEffect(() => {
    const unlisten = onAuthStateChanged(authentication,
      user => {
        if (user) {
          const userData = {
            token: user.accessToken,
            uid: user.uid,
            provider: user.providerData[0].providerId
          }

          dispatch(login(userData));
          setOpenModal(false);
        } else {
          dispatch(logout());
        }
      });
    return () => {
      unlisten();
    }
  }, []);

  //  const navigate = useNavigate();
  const navigateToOrders = () => {

    navigate('/orders', { state: { id: 1 } });
  }

  const navigateToWishlist = () => {
    navigate('/orders', { state: { id: 3 } });
  }



  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const scrollDownThreshold = 10; // Set the scroll threshold
  const scrollUpThreshold = 3;

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY - lastScrollY > scrollDownThreshold) {
        // If scrolling down and past the threshold, hide navbar
        setShow(false);
      } else if (lastScrollY - window.scrollY > scrollUpThreshold) {
        // If scrolling up and past the threshold, show navbar
        setShow(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);

      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);



  return (
    <div className={`md:sticky md:top-0 md:z-50 w-full bg-white 
      transition-transform duration-300
       lg:${show ? 'translate-y-0' : '-translate-y-full'}
      `}>
      <Navbar fluid rounded className='md:mx-20 mx-4 '>
        <Navbar.Brand href="/">
          <img src={logo} className="mr-3 h-9 sm:h-9" alt="Aarya Stays Logo" />
        </Navbar.Brand>
        <div className="flex flex-row md:order-2 max-md:space-x-3">
          {!(user && user.user)

            ? <Dropdown
              arrowIcon={false}
              // inline
              color={'white'}
              // borderWidth={'0px'}
              dismissOnClick={true}
              className='mr-5'
              label={
                <Avatar alt="User settings" className='usericon' img={user1} rounded />
              }
            >
              <Dropdown.Item onClick={() => setOpenModal(true)}>Login/Register</Dropdown.Item>
              <Dropdown.Divider />
              <Link /><Dropdown.Item> Contact</Dropdown.Item>
            </Dropdown>
            : <Dropdown
              arrowIcon={false}
              color={'white'}
              style={{ borderColor: 'white' }}
              dismissOnClick={true}
              className='z-20'
              label={
                <Avatar alt="User settings" className='usericon ' img={user1} rounded />
              }
            >
              <div
              // style={{ marginRight: "10px" }}
              >
                <Link to="/profile">
                  <Dropdown.Item>
                    My Profile
                  </Dropdown.Item>
                </Link>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => { navigateToOrders() }}>My Booking</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item onClick={() => { navigateToWishlist() }}> My WishList</Dropdown.Item>
                <Dropdown.Divider />
                {role === 'admin' && <><Link to="/dashboard/property"><Dropdown.Item >
                  Dashboard</Dropdown.Item></Link> <Dropdown.Divider /></>}

                <Dropdown.Item onClick={() => setSignoutConfirmation(true)}>Sign out</Dropdown.Item>
              </div>
            </Dropdown>

          }
          <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
          <Navbar.Link href="/" active>
            <Link to='/'
              style={buttonStyle}
              onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >Home</Link>
          </Navbar.Link>
          <Navbar.Link href="#" className='text-md '
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >Find Near By</Navbar.Link>
          <Navbar.Link href="#" className='text-md'
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >View On Map</Navbar.Link>
          <Navbar.Link href="#" className='text-md'
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >Blogs</Navbar.Link>
          <Navbar.Link href="#" className='text-md'
            style={buttonStyle}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')}
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          >Web Check-in</Navbar.Link>
        </Navbar.Collapse>
      </Navbar>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)} popup

      >
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div className=" w-full">
            <h1 className='font-medium text-center text-lg underline decoration-[#F79489] underline-offset-8 decoration-4'>Log in or sign up</h1>
            <h1 className='text-center md:text-3xl text-2xl text-[#81D8F1] font-medium md:mt-5 mt-2 mb-4'>Welcome to Aarya Stays</h1>
            {!showEmail && <div className='border-slate-100 border-2 rounded-lg'>
              <div className='dropdown px-3 py-2 '>
                <Dropdown inline label={<div className='w-full dropdown text-start'><h1 className='text-lg font-light text-slate-400'>Country/Region</h1><p> {selectedCountry} </p></div>}>
                  <Dropdown.Item onClick={() => { change('India(+91)', '+91') }}>India(+91)</Dropdown.Item>
                  <Dropdown.Item onClick={() => { change('US(+1)', '+1') }}>US(+1)</Dropdown.Item>
                  {/* list of country code */}
                </Dropdown>
              </div>
              <input type='number' className='w-full  focus:border-none py-2 border-t-2 border-x-0 border-b-0 border-slate-100 md:text-xl rounded' placeholder='Phone number' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}></input>

              {otpsent && <input type='text' className='w-full border-t-2 border-x-0 border-b-0 border-slate-100 rounded md:text-xl' placeholder="OTP" value={OTP} onChange={(e) => { setOTP(e.target.value) }}></input>}
              {otpsent ? <Button className='text-white w-full bg-[#F79489] mt-3  enabled:hover:bg-[#F79489] ' onClick={handleVerifyOtp}>Verify</Button> : <Button className='text-white w-full bg-[#F79489] mt-3  enabled:hover:bg-[#F79489] ' onClick={handleOtpsent}>Continue</Button>}
            </div>}

            {
              showEmail && <>
                <div className='border-slate-100 border-2 rounded-lg'>
                  <div className='  mb-2'>
                    <input type='email' className='w-full  focus:border-none py-2  border-x-0 border-b-0 border-slate-100 md:text-xl rounded' placeholder='Email address' value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)}></input>
                  </div>
                  <input type='password' className='w-full  focus:border-none py-2 border-t-2 border-x-0 border-b-0 border-slate-100 md:text-xl rounded' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)}></input>

                  {isRegestering && <input type='password' className='w-full border-t-2 border-x-0 border-b-0 border-slate-100 rounded md:text-xl' placeholder="confirm password" value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }}></input>}
                  {isRegestering ? <Button className='text-white w-full bg-[#F79489] mt-3  enabled:hover:bg-[#F79489] ' onClick={handleRegister}>Register</Button> : <Button className='text-white w-full bg-[#F79489] mt-3  enabled:hover:bg-[#F79489] ' onClick={handleLogin}>Login</Button>}

                </div>
                <div>
                  {!isRegestering ? <div className='text-red-400 underline-2 cursor-pointer' onClick={() => { setIsRegestering(true) }}>New Here? Register</div> : <div className='text-red-400 underline-2 cursor-pointer' onClick={() => { setIsRegestering(false) }}>Already Have an Account? Login</div>}
                </div></>
            }




            <hr className='my-5 ' />
            <Button className='w-full border-2 border-slate-100 bg-white enabled:hover:bg-white' onClick={handleGoogleSignIn}><i className='fa fa-google text-slate-400 text-start mr-5'></i><span className='text-black'>Continue with Google</span></Button>
            <Button className='w-full border-2 border-slate-100 bg-white enabled:hover:bg-white mt-2' onClick={handleAppleSignIn}><i className='fa fa-apple text-slate-400 text-start mr-5'></i><span className='text-black'>Continue with Apple</span></Button>
            {!showEmail ? <Button className='w-full border-2 border-slate-100 bg-white enabled:hover:bg-white mt-2' onClick={() => { setShowEmail(true) }}><i className='fa fa-envelope-o text-slate-400 text-start mr-5'></i><span className='text-black'>Continue with email</span></Button> : <Button className='w-full border-2 border-slate-100 bg-white enabled:hover:bg-white mt-2' onClick={() => { setShowEmail(false) }}><i className='fa fa-envelope-o text-slate-400 text-start mr-5'></i><span className='text-black'>Continue with Phone</span></Button>}
          </div>
        </Modal.Body>
        {/* <Modal.Footer>
      <Button onClick={() => setOpenModal(false) }>I accept</Button>
      <Button color="gray" onClick={() => setOpenModal(false)}>
        Decline
      </Button>
    </Modal.Footer> */}
        <div id="recaptcha-container"></div>
      </Modal>

      <Modal show={signoutConfirmation} size="md" onClose={() => setSignoutConfirmation(false)} popup>
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-gray-400 dark:text-gray-200" />
            <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              Are you sure you want to Signout?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color="failure" onClick={() => { handleSignOut(); setSignoutConfirmation(false) }}>
                {"Yes, I'm sure"}
              </Button>
              <Button color="gray" onClick={() => setSignoutConfirmation(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}
