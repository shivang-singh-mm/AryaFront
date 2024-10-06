import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { updateOrder } from '../Store/currentOrderSlice';

export default function AddOn({item}) {

    const dispatch = useDispatch();
    const currOrder = useSelector(state => state.currentOrder.currentOrder)
    const [Qty,setQty] = useState(1);

    const incrQty = ()=>{
        const updatedQty = Qty + 1;
        setQty(updatedQty);
        //increment the qty in the object that is stored in amenities array
        const newAmenities = currOrder.amenities.map((amenity)=>{
            if(amenity.id===item._id){
                return {...amenity,qty:Qty + 1}
            }
            return amenity;
        })
        dispatch(updateOrder({key:'amenities',value:newAmenities}))
    }
    const decrQty = ()=>{
        if(Qty>1){
            setQty(Qty-1);
            //decrement the qty in the object that is stored in amenities array
            const newAmenities = currOrder.amenities.map((amenity)=>{
                if(amenity.id===item._id){
                    return {...amenity,qty:Qty-1}
                }
                return amenity;
            })
            dispatch(updateOrder({key:'amenities',value:newAmenities}))

        }
    }

  return (
    <div className='flex flex-col  items-center justify-center md:w-1/4 w-2/3 '>
                                
                                <img src={item.icon.url} className='custom-shadow w-1/3 rounded p-2'></img>
                                
                                <div className='text-center mt-2'>
                                    <h1>{item.title}</h1>
                                    {item.title === 'Custom TV' ?<div>Qty 1</div> :<div className='w-full justify-between  flex items-center'><button className='border mr-2 rounded-full border-2 px-3' onClick={decrQty}>-</button> {Qty}<button className='ml-2 border rounded-full border-2 px-3' onClick={incrQty}>+</button></div>}
                                    
                                </div>

                            </div>
  )
}
