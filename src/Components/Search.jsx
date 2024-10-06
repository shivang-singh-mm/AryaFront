import React, { useEffect } from 'react';
import { Datepicker } from 'flowbite-react';
import { useState } from 'react';
import { Dropdown } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updateOrder } from '../Store/currentOrderSlice';
import { useNavigate } from 'react-router-dom';

export default function Search({ dropdownArray }) {

    const dispatch = useDispatch();
    const currOrder = useSelector(state => state.currentOrder.currentOrder)
    let navigate = useNavigate();

    const [selectedTitle, setSelectedTitle] = useState('');
    const [selectedLoc, setSelectedLoc] = useState('');
    const [selectedId, setSelectedId] = useState('');
    const [isChoose, SetisChoose] = useState(false);

    const changeDropdown = (title, loc, id) => {
        setSelectedLoc(loc)
        setSelectedTitle(title)
        dispatch(updateOrder({ key: 'Title', value: title }))
        dispatch(updateOrder({ key: 'Location', value: loc }))
        dispatch(updateOrder({ key: 'Id', value: id }))
        setSelectedId(id)
        SetisChoose(true);

    }
    //set date using useeffect
    const [checkInDate, setCheckInDate] = useState();
    const [checkOutDate, setCheckOutDate] = useState();
    useEffect(() => {
        const checkin = new Date();
        checkin.setDate(new Date().getDate());
        const checkout = new Date();
        checkout.setDate(new Date().getDate() + 1);

        setCheckInDate(`${checkin.getDate()}/${checkin.getMonth() + 1}/${checkin.getFullYear()}`);
        dispatch(updateOrder({ key: 'CheckInDate', value: `${checkin.getDate()}/${checkin.getMonth() + 1}/${checkin.getFullYear()}` }))
        setCheckOutDate(`${checkout.getDate()}/${checkout.getMonth() + 1}/${checkout.getFullYear()}`);
        dispatch(updateOrder({ key: 'CheckOutDate', value: `${checkout.getDate()}/${checkout.getMonth() + 1}/${checkout.getFullYear()}` }))
        dispatch(updateOrder({ key: 'adultNumber', value: 2 }))
        dispatch(updateOrder({ key: 'childNumber', value: 1 }))
    }, [])


    const handleCheckIn = (date) => {
        setCheckInDate(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
        dispatch(updateOrder({ key: 'CheckInDate', value: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() }))
    };

    const handleCheckOut = (date) => {
        setCheckOutDate(date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear());
        dispatch(updateOrder({ key: 'CheckOutDate', value: date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() }))
    };


    const [adultNumber, setAdultNumber] = useState(2);
    const incrAdult = () => {
        setAdultNumber(adultNumber + 1);
        dispatch(updateOrder({ key: 'adultNumber', value: adultNumber + 1 }))
    }
    const decrAdult = () => {
        if (adultNumber > 0) {
            setAdultNumber(adultNumber - 1)
            dispatch(updateOrder({ key: 'adultNumber', value: adultNumber - 1 }))
        }
    }

    const [childNumber, setChildNumber] = useState(1);
    const incrChild = () => {
        setChildNumber(childNumber + 1);
        dispatch(updateOrder({ key: 'childNumber', value: childNumber + 1 }))
    }
    const decrChild = () => {
        if (childNumber > 0) {
            setChildNumber(childNumber - 1)
            dispatch(updateOrder({ key: 'childNumber', value: childNumber - 1 }))
        }
    }

    const redirectToIndividualPage = () => {
        if (selectedId) {
            const checkOutDateParts = checkOutDate.split('/'); // Assuming checkOutDate is '10/12/2023'
            const day = parseInt(checkOutDateParts[0], 10);
            const month = parseInt(checkOutDateParts[1], 10) - 1; // Subtract 1 since months are zero-indexed in Date objects
            const year = parseInt(checkOutDateParts[2], 10);

            const checkout = new Date(year, month, day);

            const checkInDateParts = checkInDate.split('/'); // Assuming checkInDate is '10/12/2023'
            const day1 = parseInt(checkInDateParts[0], 10);
            const month1 = parseInt(checkInDateParts[1], 10) - 1; // Subtract 1 since months are zero-indexed in Date objects
            const year1 = parseInt(checkInDateParts[2], 10);

            const checkin = new Date(year1, month1, day1);

            if (checkin > checkout) {
                alert('CheckIn date should be less than CheckOut date')
                return;
            } else {
                navigate('/property/' + selectedId)
            }


        } else {
            alert('Please select a property')
        }
    }

    return (

        <div className='bg-[white]'>
            <div className='container md:block hidden pt-16 mx-auto '>
                <div className='flex flex-wrap border-2 mx-28  border-slate-300/50 custom-shadow content-center divide-x	  rounded-lg'>
                    <div class="lg:w-2/6 flex items-center  dropdown  px-5  py-2 ...">
                        <Dropdown
                            inline
                            className='mt-2'
                            label={isChoose ? <div className='w-full text-start'><h1 className='font-medium text-lg'>{selectedTitle}</h1><p><i className='fa  fa-map-marker text-[#6ACDE9] mr-2'></i>{selectedLoc}</p></div> : <div className='py-2  text-lg   w-full'>Choose your stays</div>}
                        >
                            {dropdownArray.map(item => {
                                return (<>
                                    <Dropdown.Item onClick={() => { changeDropdown(item.title, item.location, item.id) }}><div className='text-start'>
                                        <h1>{item.title}</h1>
                                        <p>{item.location}</p>
                                    </div></Dropdown.Item>
                                    <div className='last-divider'><Dropdown.Divider /></div>

                                </>)
                            })}


                            {/* <Dropdown.Item onClick={change}><div className='text-start'>
                <h1>Classy 1 BHK, near Viviana Mall</h1>
                <p>Casa Ultima, Behind Jupiter Hospital, Thane (W)</p>
            </div></Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={change}><div className='text-start'>
                <h1>Classy 1 BHK, near Viviana Mall</h1>
                <p>Casa Ultima, Behind Jupiter Hospital, Thane (W)</p>
            </div></Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={change}><div className='text-start'>
                <h1>Classy 1 BHK, near Viviana Mall</h1>
                <p>Casa Ultima, Behind Jupiter Hospital, Thane (W)</p>
            </div></Dropdown.Item>
          <Dropdown.Divider />
          <Dropdown.Item onClick={change}><div className='text-start'>
                <h1>Classy 1 BHK, near Viviana Mall</h1>
                <p>Casa Ultima, Behind Jupiter Hospital, Thane (W)</p>
            </div></Dropdown.Item> */}
                        </Dropdown>
                    </div>
                    <div className="lg:w-1/6 h-full items-center text-lg py-2 ...">
                        <h1 className='pl-3 z-10 font-medium'>Check In</h1>
                        {/* new Date().getDate()+'/'+(new Date().getMonth()+1) +'/'+new Date().getFullYear() */}
                        <Datepicker value={checkInDate} minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())} onSelectedDateChanged={handleCheckIn} className='p-0  custom-date' />
                    </div>
                    <div class="lg:w-1/6 text-lg py-2 ...">
                        <h1 className='pl-3 z-10 font-medium'>Check Out</h1>
                        <Datepicker value={checkOutDate} minDate={new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1)} onSelectedDateChanged={handleCheckOut} className='p-0  custom-date z-20' />
                    </div>
                    <div class="lg:w-1/6 dropdown px-3 py-2 ...">
                        <Dropdown
                            arrowIcon={true}
                            dismissOnClick={false}
                            className='px-5 py-4 mt-2'
                            inline
                            label={<div className='text-start  w-full'><div className='text-xl font-medium'>Guests</div>
                                <div className='text-[#F79489] '>{adultNumber} Adult, {childNumber} Child</div></div>}

                        >
                            <div className='flex w-100 mb-2 justify-between'>
                                <div><h1 className='font-bold text-base w-3/5'>Adults</h1><p className='text-gray-400'>Age 8+</p></div>
                                <div className='w-2/5 justify-between  flex items-center'><button className='border mr-2 rounded-full border-2' onClick={decrAdult}>-</button> {adultNumber}<button className='ml-2 border rounded-full border-2' onClick={incrAdult}>+</button></div>
                            </div>
                            <Dropdown.Divider />
                            <div className='flex w-100 my-2 justify-between'>
                                <div><h1 className='font-bold text-base w-3/5'>Child</h1><p className='text-gray-400'>Age 0 - 8</p></div>
                                <div className='w-2/5 justify-between  flex items-center'><button onClick={decrChild} className='border mr-2 rounded-full border-2'>-</button> {childNumber}<button onClick={incrChild} className='ml-2 border rounded-full border-2'>+</button></div>
                            </div>
                            <Dropdown.Divider />
                            <div><h1 className='text-green-500 font-bold w-64'>Charges are not applicable for children below 8</h1></div>

                        </Dropdown>
                    </div>
                    <div class="lg:w-1/6 ...">
                        {/* <Link to={`/property/${selectedId}`}> */}
                        <button onClick={() => { redirectToIndividualPage() }} className='w-full align-center bg-[#F79489] h-full text-xl font-bold rounded-lg text-white py-2 px-3'>Search</button>
                        {/* </Link> */}

                    </div>
                </div>
            </div>
        </div>
    )
}
